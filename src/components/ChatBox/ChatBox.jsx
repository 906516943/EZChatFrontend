import React, { useEffect } from "react";
import ChatMessageContainer from "./ChatBoxComponents/ChatMessageContainer";
import ChatMessageSender from "./ChatBoxComponents/ChatMessageSender";
function ChatBox(props) { 
    
    useEffect(() => { 
        const element = document.getElementById("message-end-flag");
        element?.scrollIntoView({behavior: "smooth", block: "start"});

    }, [props.msgQueue])

    return (
            <div className="flex flex-col size-full overflow-auto" style={{background: 'url("m42.jpg")'}}>
                <div id="chatbox" className="flex grow shrink flex-col size-full gap-2 box-border p-2 overflow-y-scroll">
                    {
                        props.msgQueue.map((x) => (
                            <ChatMessageContainer
                                key={x.id}
                                user={x.user}
                                msg={x.msg}
                                date={x.date}
                                me={props.user == x.user}></ChatMessageContainer>
                        ))
                    }
                    <div id="message-end-flag"></div>
                </div>

                <div className="flex grow-0 shrink-0 flex-col">
                    <ChatMessageSender newMsg={props.newMsg}></ChatMessageSender>
                </div>
            </div>
        )
}




export default ChatBox;