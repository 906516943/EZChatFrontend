import { GenAccessToken, GetAuthInfo, GetUserGroups, GetUserInfo, GetImageIds, PutImage } from '../services/Api';
import ChatConnector from '../services/ChatConnector';
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import ChatBoxBase from './ChatBox/ChatBoxBase'
import { GlobalContext } from '../Global';
import { GenId } from '../services/Utils';

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

    return { id: GenId(), userName: null, time:msg.timeStamp, userId: msg.senderId, msgId: msg.messageId, success: true, msg:{text:msg.text, imgs:msg.images ?? []}}
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
                chatConnector.current.OnReceiveMessage((x) => { 

                    console.log(x);

                    const msg = ReceiveParse(x);
                    const name = userNamesDict.current.get(msg.userId);

                    if (name == null) {
                        
                        //pull username
                        GetUserInfo(msg.userId).then(y => {
                            
                            userNamesDict.current.set(msg.userId, y.name);
                            setMsgQueue({ type: 'modify', id: msg.id, newItem: { ...msg, userName: y.name } });
                        });

                    } else { 
                        msg.userName = name;
                    }


                    setMsgQueue({ type: 'add', item: msg });
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