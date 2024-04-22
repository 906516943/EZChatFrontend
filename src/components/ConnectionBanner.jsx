import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../Global";
import { GenAccessToken, GetAuthInfo, GetUserGroups, GetUserInfo} from "../services/Api";

const LEVEL_SUCCESS = 0;
const LEVEL_WARN = 1;
const LEVEL_ERROR = 2;
const LEVEL_INFO = 3;

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
        <div className={'w-full '+ v + ' flex items-center transition-all overflow-hidden duration-150 box-border ' + color}>
            <p className='pl-4 text-lg'>{connectionStatus.msg}</p>
        </div>
    )
}


export default function ConnectionBanner() {
    
    const [connectionStatus, setConnectionStatus] = useState({ visible: true, level: LEVEL_INFO, msg: "Connecting..." })

    //init connections
    useEffect(() => { 

        (async () => { 

            try {
                //make new user token
                GlobalContext.user.authToken.Set(await GenAccessToken());

                //pull user info
                GlobalContext.user.authInfo.Set(await GetAuthInfo(GlobalContext.user.authToken.Get()));
                GlobalContext.user.userInfo.Set(await GetUserInfo(GlobalContext.user.authInfo.Get().userId));
                GlobalContext.user.userGroups.Set(await GetUserGroups(GlobalContext.user.authInfo.Get().userId));

                //connect to the server
                await GlobalContext.service.chatConnector.Connect(5, GlobalContext.user.authToken.Get());

                //handle reconnection
                GlobalContext.service.chatConnector.OnClose(() => setConnectionStatus({ visible: true, level: LEVEL_ERROR, msg: "Disconnected from the server" }));

                setConnectionStatus({ visible: true, level: LEVEL_SUCCESS, msg: "Connected" });
                setTimeout(() => setConnectionStatus({ visible: false, level: LEVEL_SUCCESS, msg: "Connected" }), 1000);
            } catch (err) { 
                setConnectionStatus({ visible: true, level: LEVEL_ERROR, msg: err.message });
            }


        })();
    }, [])

    return (<div className="size-full">
        { ConnectionStatusDOM(connectionStatus) }
    </div>)
 }