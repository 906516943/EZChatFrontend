import { GetImageIds, PutImage, GetImage, GetUserInfo } from '../services/Api';
import { useContext, useEffect, useReducer, useState} from 'react'
import ChatBoxBase from './ChatBox/ChatBoxBase'
import ChatBoxTopBanner from './ChatBox/ChatBoxTopBanner'
import { GlobalContext, VIEW_CHAT }  from '../Global';
import { GenHash, GenId } from '../services/Utils';

function MsgQueueReducer(current, action) { 
    switch (action.type) { 
        case 'add': { 
            current.push(action.item); break;
        }
        case 'modify': { 
            let index = -1;

            for (let i = 0; i < current.length; i++) { 
                if (current[i].id == action.id) { 
                    index = i;
                    break;
                }
            }

            if (index != -1) {
                current[index] = action.newItem;
            }

            break;
        }
        case 'clear': { 
            return [];
        }
        case 'addRange': { 
            current = current.concat(action.item);
            break;
        }
    }

    return [...current];
}


function SendParse(m, channelId){ 
    return {channelId: channelId, text: m.msg.text, imagesByHash: m.msg.imgs.map(x => x.hash)};
}

function ReceiveParse(msg) { 

    return { id: GenId(), userName: null, time:msg.timeStamp, userId: msg.senderId, msgId: msg.messageId, success: true, msg:{text:msg.text, imgs:msg.imagesById ?? []}}
}

async function SendNewMsgAsync(msg, setMsgQueue) { 

    //exclude already uploaded images
        const alreadyUploadedImgs = await GetImageIds(msg.msg.imgs.map(x => x.hash));
        const alreadyUploadedHashes = alreadyUploadedImgs.map(x => x.hash);
        const newImgs = msg.msg.imgs.filter(y => !alreadyUploadedHashes.includes(y.hash));

        //distinct by hash
        const newImgHashes = new Set();
        const distinctNewImgs = newImgs.filter(x => {
            if (!newImgHashes.has(x.hash)) {
                newImgHashes.add(x.hash);
                return true;
            }
                        
            return false;
        });


        //upload new imgs
        await Promise.all(distinctNewImgs.map(x => PutImage(GlobalContext.cache.imageMap.get(x.hash).arrayBuffer)));


        //send message
        const sentMsg = await GlobalContext.service.chatConnector.SendMessage(SendParse(msg, GlobalContext.user.selectedChatId.Get()));
    await GlobalContext.dbService.AddNewMessage(sentMsg);
    
        //update send status
        setMsgQueue({ type: 'modify', id: msg.id, newItem: { ...msg, id: sentMsg.msgId, success: true } });

}


async function ReceiveMsgAsync(x, setMsgQueue) { 

    const msg = ReceiveParse(x);


    //pull username
    if (!GlobalContext.cache.userNamesMap.has(msg.userId)) 
        GlobalContext.cache.userNamesMap.set(msg.userId, (await GetUserInfo(msg.userId)).name);
                    
    msg.userName = GlobalContext.cache.userNamesMap.get(msg.userId);


    //pull images from cache
    const imgData = msg.msg.imgs;
    const imgHashes = imgData.map(x => { 
        const ret = { id: GenId(), hash: 'loading' };

        if (GlobalContext.cache.imageMap.has(x.hash))
            ret.hash = x.hash

        return ret;        
    })

     msg.msg.imgs = imgHashes;


    //initial render
    setMsgQueue({ type: 'add', item: msg });



    //if we cannot find images from the cache.. load them from api
    for (var i = 0; i < imgData.length; i++) { 
                        
        if (imgHashes[i].hash != 'loading')
            continue;

                        
        //load in parallel
        (async () => {
            const currentIndex = i;


            //load thumbnail
            var thumbnail = await GetImage(imgData[currentIndex].thumbnailImgId, true);
            var thumbnailArrayBuffer = await thumbnail.arrayBuffer();
            var thumbnailHash = GenHash(thumbnailArrayBuffer);

            //add thumbnail to cache
            GlobalContext.cache.imageMap.set(thumbnailHash, { url: URL.createObjectURL(new Blob([thumbnail])), arrayBuffer: thumbnailArrayBuffer});
            msg.msg.imgs[currentIndex] = {...msg.msg.imgs[currentIndex], hash: thumbnailHash}
                          
            //render
            setMsgQueue({ type: 'modify', id: msg.id, newItem: { ...msg } })
                                

            //load real image
            var img = await GetImage(imgData[currentIndex].imgId, true);
            var imgArrayBuffer = await img.arrayBuffer();
            var imgHash = GenHash(imgArrayBuffer);

            //add to cache
            GlobalContext.cache.imageMap.set(imgHash, { url: URL.createObjectURL(new Blob([img])), arrayBuffer: imgArrayBuffer });
            msg.msg.imgs[currentIndex] = {...msg.msg.imgs[currentIndex], hash: imgHash}
                                
            setMsgQueue({ type: 'modify', id: msg.id, newItem: { ...msg } })

        })();
                    
    }     

}


export default function ChatBox(props) { 
    const [msgQueue, setMsgQueue] = useReducer(MsgQueueReducer, [])
    const [chatVisible, setchatVisible] = useState(false);

    const SendNewMsg = (x, imgs) => { 

        const msg = {
            id: GenId(),
            userName: GlobalContext.user.userInfo.Get()?.name,
            time: Date.now(),
            userId: GlobalContext.user.authInfo.Get()?.userId,
            msgId: null,
            success: null,
            msg: { text: x, imgs: imgs }
        };


        //if signalR is not connected.. then set msg to failed state
        if (!GlobalContext.service.chatConnector.IsConnected()) { 
            msg.success = false;
            setMsgQueue({ type: 'add', item: msg });

            return;
        }

        //append message to the message queue locally
        setMsgQueue({ type: 'add', item: msg });

        SendNewMsgAsync(msg, setMsgQueue)
            .catch(x => {
                console.log(x);
                setMsgQueue({ type: 'modify', id: msg.id, newItem: { ...msg, success: false } });
            });
    }
    

    useEffect(() => {

        var currentMessageChannelEventId = null;

        //invoke when user select different chat channel
        const eventId = GlobalContext.user.selectedChatId.Subscribe(async () => {

            //clear current chat messages
            setMsgQueue({ type: 'clear' });

            //re-subscribe channel
            GlobalContext.service.chatMessageDistributor.UnsubscribeMessageChannel(currentMessageChannelEventId)

            if (GlobalContext.user.selectedChatId.Get() != null) { 
                
                //load history
                const messages = await GlobalContext.dbService.GetMessages(100, GlobalContext.user.selectedChatId.Get());
                for (var m of messages)
                    ReceiveMsgAsync(m, setMsgQueue);


                console.log(messages);

                currentMessageChannelEventId = GlobalContext.service.chatMessageDistributor
                    .SubscribeMessageChannel(GlobalContext.user.selectedChatId.Get(), (x) => ReceiveMsgAsync(x, setMsgQueue));
            }

        });


        //view change event
        const viewChangeEvent = GlobalContext.currentView.Subscribe(() => {

            setchatVisible(GlobalContext.currentView.Get() == VIEW_CHAT);

        });

        return () => {
            GlobalContext.user.selectedChatId.Unsubscribe(eventId);
            GlobalContext.currentView.Unsubscribe(viewChangeEvent);
        };

    }, []);

    return (
        <div className={'size-full flex flex-col ease-in-out duration-200 ' + (chatVisible ? 'opacity-100' : 'opacity-0')}>
            <div className='w-full h-14 shrink-0 grow-0 backdrop-blur-md backdrop-blur-md shadow-md bg-white/60'>
                <ChatBoxTopBanner></ChatBoxTopBanner>
            </div>
            <div className='w-full h-full shrink grow min-h-0'>
                <ChatBoxBase msgQueue={msgQueue} userName={GlobalContext.user.userInfo.Get()?.name} userId={ GlobalContext.user.authInfo.Get()?.userId} newMsg={SendNewMsg}></ChatBoxBase>
            </div>
        </div>
    )

}