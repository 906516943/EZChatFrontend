import { useEffect } from "react"
import { GlobalContext } from "../Global";

export default function MessageSaveService() { 

    useEffect(() => {

        const eventId = GlobalContext.service.chatMessageDistributor.SubscribeAllChannels((msg) => {

            console.log(msg);
            GlobalContext.dbService.AddNewMessage(msg);

        });

        return () => { 
            GlobalContext.service.chatMessageDistributor.UnsubscribeAllChannels(eventId);
        }
    }, []);


    return(<></>)
}