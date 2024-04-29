import React, { useEffect } from "react";
import ChatMessageContainer from "./ChatBoxComponents/ChatMessageContainer";
import ChatMessageSender from "./ChatBoxComponents/ChatMessageSender";
function ChatBoxBase(props) { 
    
    useEffect(() => { 
        const element = document.getElementById("message-end-flag");
        element?.scrollIntoView({behavior: "smooth", block: "start"});

    }, [props.msgQueue])

    return (
            <div className="flex flex-col size-full overflow-auto bg-black bg-opacity-50">
                <div id="chatbox" className="flex grow shrink min-h-0 flex-col size-full gap-2 box-border p-2 gap-4 overflow-y-scroll " style={{scrollbarWidth: 'thin'}}>
                    {
                        props.msgQueue.map((x) => (
                            <ChatMessageContainer
                                key={x.id}
                                userName={x.userName}
                                userId={x.userId}
                                msg={x.msg}
                                msgId={x.msgId}
                                time={x.time}
                                success={x.success}
                                me={props.userId == x.userId}></ChatMessageContainer>
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




export default ChatBoxBase;