import React from "react";
import ChatMessageContainer from "./ChatBoxComponents/ChatMessageContainer";
class ChatBox extends React.Component
{ 
    
    constructor()
    { 
        super();
        this.state = { msgQueue: [] }
    }

    componentDidMount()
    { 
        this.setState({msgQueue:["User0", "User1", "User2"]})
    }

    render()
    { 
        return (
            <div className="flex flex-col size-full gap-2 box-border p-10" style={{background: 'url("m42.jpg")'}}>
                {
                    this.state.msgQueue.map((x, i) => (
                        <ChatMessageContainer Key={i} User={x} Text={"消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息"} Date={new Date()} Me={i==1 }></ChatMessageContainer>
                    ))
                }
            </div>
        )
    }
}




export default ChatBox;