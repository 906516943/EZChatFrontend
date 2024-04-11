import { GenAccessToken, GetAuthInfo, GetUserGroups, GetUserInfo, GetImageIds, PutImage, GetImage } from '../services/Api';
import ChatConnector from '../services/ChatConnector';
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import ChatBoxBase from './ChatBox/ChatBoxBase'
import { GlobalContext } from '../Global';
import { GenHash, GenId } from '../services/Utils';

const LEVEL_SUCCESS = 0;
const LEVEL_WARN = 1;
const LEVEL_ERROR = 2;
const LEVEL_INFO = 3;

/*
    Connection status banner located at the top of the Chat box
*/
function ConnectionStatusDOM(connectionStatus) { 
    let color;
    let v = connectionStatus.visible ? "h-14" : "h-0"
    switch (connectionStatus.level)
    { 
        case LEVEL_INFO: color = "bg-sky-300/90"; break;
        case LEVEL_WARN: color = "bg-amber-300/90"; break;
        case LEVEL_ERROR: color = "bg-red-300/90"; break;
        case LEVEL_SUCCESS: color = "bg-green-300/90"; break;
    }


    return (
        <div className={'w-full '+ v + ' absolute z-10 top-0 left-0 backdrop-blur-md shadow-lg flex items-center transition-all overflow-hidden duration-150 box-border ' + color}>
            <p className='pl-4 text-lg'>{connectionStatus.msg}</p>
        </div>)


}

function SendParse(m, channelId){ 
    return {channelId: channelId, text: m.msg.text, imagesByHash: m.msg.imgs.map(x => x.hash)};
}

function ReceiveParse(msg) { 

    return { id: GenId(), userName: null, time:msg.timeStamp, userId: msg.senderId, msgId: msg.messageId, success: true, msg:{text:msg.text, imgs:msg.imagesById ?? []}}
}

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
    }

    return [...current];
}

export default function ChatBox(props) { 
    const [msgQueue, setMsgQueue] = useReducer(MsgQueueReducer, [])
    const [connectionStatus, setConnectionStatus] = useState({ visible: true, level: LEVEL_INFO, msg: "Connecting..." })

    const chatConnector = useRef(new ChatConnector());
    const userNamesDict = useRef(new Map());
    const token = useRef(null);
    const authInfo = useRef({userId: null});
    const userInfo = useRef({ name: null });
    const userGroups = useRef([]);
    const globalContext = useContext(GlobalContext);
    

    const SendNewMsgAsync = async (msg) => { 

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
        await Promise.all(distinctNewImgs.map(x => PutImage(globalContext.imageMap.get(x.hash).arrayBuffer)));


        //send message
        const msgId = await chatConnector.current.SendMessage(SendParse(msg, userGroups.current[0]));
        
        if (msgId == null) throw new Error("Failed to send message");


        //update send status
        setMsgQueue({ type: 'modify', id: msg.id, newItem: { ...msg, id: msgId, success: true } });
        
    }


    const SendNewMsg = (x, imgs) => { 

        const msg = {
            id: GenId(),
            userName: userInfo.current.name,
            time: Date.now(),
            userId: authInfo.current.userId,
            msgId: null,
            success: null,
            msg: { text: x, imgs: imgs }
        };


        //append message to the message queue locally
        setMsgQueue({ type: 'add', item: msg });


        SendNewMsgAsync(msg)
        .catch(x => {
            setMsgQueue({ type: 'modify', id: msg.id, newItem: { ...msg, success: false } });
        });
    }
    

    
    useEffect(() => { 

        (async () => {

            try {
                //make new user
                token.current = await GenAccessToken();

                //pull user info
                authInfo.current = await GetAuthInfo(token.current);
                userInfo.current = await GetUserInfo(authInfo.current.userId);
                userGroups.current = await GetUserGroups(authInfo.current.userId);

                //connect to the server
                await chatConnector.current.Connect(5, token.current);

                //handle reconnection
                chatConnector.current.OnClose(() => setConnectionStatus({ visible: true, level: LEVEL_ERROR, msg: "Disconnected from the server" }));

                //handle new message
                chatConnector.current.OnReceiveMessage(async (x) => { 

                    const msg = ReceiveParse(x);


                    //pull username
                    if (!userNamesDict.current.has(msg.userId)) 
                        userNamesDict.current.set(msg.userId, (await GetUserInfo(msg.userId)).name);
                    
                    console.log(userNamesDict.current.get(msg.userId));
                    
                    msg.userName = userNamesDict.current.get(msg.userId);


                    //pull images from cache
                    const imgData = msg.msg.imgs;
                    const imgHashes = imgData.map(x => { 
                        const ret = { id: GenId(), hash: 'loading' };

                        if (globalContext.imageMap.has(x.hash))
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

                                globalContext.imageMap.set(thumbnailHash, { url: URL.createObjectURL(new Blob([thumbnail])), arrayBuffer: thumbnailArrayBuffer});
                                msg.msg.imgs[currentIndex] = {...msg.msg.imgs[currentIndex], hash: thumbnailHash}
                                
                                setMsgQueue({ type: 'modify', id: msg.id, newItem: { ...msg } })
                                

                                //load real image
                                var img = await GetImage(imgData[currentIndex].imgId, true);
                                var imgArrayBuffer = await img.arrayBuffer();
                                var imgHash = GenHash(imgArrayBuffer);

                                globalContext.imageMap.set(imgHash, { url: URL.createObjectURL(new Blob([img])), arrayBuffer: imgArrayBuffer });
                                msg.msg.imgs[currentIndex] = {...msg.msg.imgs[currentIndex], hash: imgHash}
                                
                                setMsgQueue({ type: 'modify', id: msg.id, newItem: { ...msg } })

                            })();
                    }     

                    
                });



                setConnectionStatus({ visible: true, level: LEVEL_SUCCESS, msg: "Connected" });
                setTimeout(() => setConnectionStatus({ visible: false, level: LEVEL_SUCCESS, msg: "Connected" }), 1000);

            } catch (err){ 
                setConnectionStatus({ visible: true, level: LEVEL_ERROR, msg: err.message})
            }
        })();
        
    },[])

    return (
        <div className='size-full relative'>
            { ConnectionStatusDOM(connectionStatus)}
            <ChatBoxBase msgQueue={msgQueue} userName={userInfo.current.name} userId={ authInfo.current.userId} newMsg={SendNewMsg}></ChatBoxBase>
        </div>
    )

}