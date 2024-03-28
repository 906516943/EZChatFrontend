import { MESSENGER_SERVER, AUTH_SERVER } from '../Global'
import { useEffect, useRef, useState } from 'react'
import ChatBoxBase from './ChatBox/ChatBoxBase'

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

async function AuthUser(connection, token) { 
    const res = await connection.invoke("SendAuthUser", token);

    if (!res) throw new Error("Login failed");
}

async function GetToken() { 

    const response = await fetch(AUTH_SERVER + 'MakeGuestAuthToken', {method: 'PUT'});
    
    if (response.status != 200)
        throw new Error("Request access token failed");

    return response.text();
}


/* 
    Connect to Chat endpoint with SignlR
*/
async function Connect(retry, setConnectionStatus) { 
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
            return connection;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        setConnectionStatus({ visible: true, level: LEVEL_WARN, msg: "Retrying... " + (r + 1) });
    }

    throw new Error("Connect failed");
}

function SendParse(msg){ 
    return msg;
}

function ReceiveParse(msg) { 
    return msg;
}

export default function ChatBox(props) { 
    const [msgQueue, setMsgQueue] = useState([])
    const [connectionStatus, setConnectionStatus] = useState({ visible: true, level: LEVEL_INFO, msg: "Connecting..." })
    const [newMessage, appendNewMessage] = useState(null);

    const connection = useRef(null);
    const token = useRef(null);
    const user = useRef(Math.round(Math.random() * 10000000))
    

    const SendNewMsg = (x, imgs) => { 
        const msg = { id: Date.now(), user: user.current, msg: { text: x, imgs: imgs } };
        
        //append message to the message queue locally
        appendNewMessage(msg);

        //send to the server
        connection.current.invoke("SendMessage", SendParse(msg));
    }

    
    useEffect(() => { 

        (async () => {

            try {
                token.current = await GetToken(setConnectionStatus);
                
                //connect to the server
                connection.current = await Connect(5, setConnectionStatus);

                //auth user
                await AuthUser(connection.current, token.current);

                setConnectionStatus({ visible: true, level: LEVEL_SUCCESS, msg: "Connected" });
                setTimeout(() => setConnectionStatus({ visible: false, level: LEVEL_SUCCESS, msg: "Connected" }), 1000);

                //handle reconnection
                connection.current.onclose(() => setConnectionStatus({ visible: true, level: LEVEL_ERROR, msg: "Disconnected from the server" }));

                //handle new message
                connection.current.on("ReceiveMessage", (x) => { 
                
                    if (x.user != user.current) { 
                        appendNewMessage(x);
                    }
                });

            } catch (err){ 
                setConnectionStatus({ visible: true, level: LEVEL_ERROR, msg: err.message})
            }
        })();
        
    },[])


    useEffect(() => { 
        if (newMessage != null) { 
            console.log(newMessage);
            setMsgQueue(msgQueue.concat(newMessage))
        }
    }, [newMessage])


    return (
        <div className='size-full relative'>
            { ConnectionStatusDOM(connectionStatus)}
            <ChatBoxBase msgQueue={msgQueue} user={user.current} newMsg={SendNewMsg}></ChatBoxBase>
        </div>
    )

}