import { MESSENGER_SERVER } from '../Global'
import { useEffect, useRef, useState } from 'react'
import ChatBoxBase from './ChatBox/ChatBoxBase'

const LEVEL_SUCCESS = 0;
const LEVEL_WARN = 1;
const LEVEL_ERROR = 2;
const LEVEL_INFO = 3;

function ConnectionNotification(connectionStatus) { 
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

async function ConnectToServer(retry, setConnectionStatus) { 
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(MESSENGER_SERVER, {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets})
        .build();
    
    const connect = async () => { 
        console.log("connecting...");

        try {
            await connection.start();

            console.log("connected");
            return true

        } catch (err) { 
            console.log(err);
        }
        
        return false;
    }


    for (let r = 0; r <= retry; r++) { 

        //connected successfully, return connection instance
        if (await connect()) { 
            setConnectionStatus({ visible: true, level: LEVEL_SUCCESS, msg: "Connected" });
            setTimeout(() => setConnectionStatus({ visible: false, level: LEVEL_SUCCESS, msg: "Connected" }), 1000);
            return connection;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        setConnectionStatus({ visible: true, level: LEVEL_WARN, msg: "Retrying... " + (r + 1) });
    }

    setConnectionStatus({ visible: true, level: LEVEL_ERROR, msg: "Failed to connect to the server" });
    return null;
}

export default function ChatBox(props) { 
    const [mQueue, setmQueue] = useState([])
    const [connectionStatus, setConnectionStatus] = useState({ visible: true, level: LEVEL_INFO, msg: "Connecting..." })
    const connection = useRef(null);
    const user = useRef(Math.round(Math.random() * 10000000))
    const [newMessage, setNewMessage] = useState(null);
    
    const handleNewMsg = (x, imgs) => { 
        const data = { id: Date.now(), user: user.current , msg: { text: x, imgs: imgs }};
        connection.current.invoke("SendMessage", data);
        
        setmQueue(mQueue.concat(data))
    }

    useEffect(() => { 
        if(newMessage != null)
        setmQueue(mQueue.concat(newMessage))
    }, [newMessage])

    useEffect(() => { 
        (async () => {
            //connect server
            connection.current = await ConnectToServer(5, setConnectionStatus);

            //handle reconnection
            connection.current.onclose(() => setConnectionStatus({ visible: true, level: LEVEL_ERROR, msg: "Disconnected from the server" }));

            connection.current.on("ReceiveMessage", (x) => { 

                if (x.user != user.current) { 
                    setNewMessage(x);
                }
            });
        })();
    },[])





    return (
        <div className='size-full relative'>
            { ConnectionNotification(connectionStatus)}
            <ChatBoxBase msgQueue={mQueue} user={user.current} newMsg={ handleNewMsg}></ChatBoxBase>
        </div>
    )

}