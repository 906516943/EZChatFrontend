import React from "react";
import ChatMessageContainer from "./ChatBoxComponents/ChatMessageContainer";
import ChatMessageSender from "./ChatBoxComponents/ChatMessageSender";
class ChatBox extends React.Component
{ 
    
    constructor()
    { 
        super();
        this.state = { msgQueue: [] }
    }

    componentDidMount()
    { 
        this.setState({msgQueue:["User0", "User1", "User3", "User4", "User2", "User2", "User2", "User2", "User2", "User2", "User2", "User2"]})
    }

    render()
    { 
        return (
            <div className="flex flex-col size-full overflow-auto" style={{background: 'url("m42.jpg")'}}>
                <div className="flex grow shrink flex-col size-full gap-2 box-border p-2 overflow-y-scroll">
                {
                    this.state.msgQueue.map((x, i) => (
                        <ChatMessageContainer Key={i} User={x} Text={"消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息"} Date={new Date()} Me={i==1 }></ChatMessageContainer>
                    ))
                }
                </div>

                <div className="flex grow-0 shrink-0 flex-col">
                    <ChatMessageSender></ChatMessageSender>
                </div>
            </div>
        )
    }
}




export default ChatBox;