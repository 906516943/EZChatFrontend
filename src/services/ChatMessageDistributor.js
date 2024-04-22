import { EventVar } from "./Utils";

export default class ChatMessageDistributor { 

    #chatConnector
    #channelMessageEvents = new Map();
    #allMessageEvent = new EventVar();
    #channelIdLookup = new Map();

    constructor(chatConnector) { 
        this.#chatConnector = chatConnector;
        this.#chatConnector.OnReceiveMessage((x) => this.#DistributeMessage(x));
    }

    GetConnector() { 
        return this.chatConnector;
    }


    #DistributeMessage(msg) { 

        if (this.#channelMessageEvents.has(msg.channelId)) {
            this.#channelMessageEvents.get(msg.channelId).Set(msg);
        }

        this.#allMessageEvent.Set(msg);
    }

    SubscribeMessageChannel(channelId, fun) { 

        if (!this.#channelMessageEvents.has(channelId))
            this.#channelMessageEvents.set(channelId, new EventVar());
        
        const eventId = this.#channelMessageEvents.get(channelId).Subscribe(() => {
            fun(this.#channelMessageEvents.get(channelId).Get());
        });

        this.#channelIdLookup.set(eventId, channelId);
        return eventId;
    }

    SubscribeAllChannels(fun) { 
        return this.#allMessageEvent.Subscribe(() => { 
            fun(this.#allMessageEvent.Get());
        })
    }

    UnsubscribeMessageChannel(eventId) { 

        if (!this.#channelIdLookup.has(eventId))
            return;

        const channelId = this.#channelIdLookup.get(eventId);
        if (!this.#channelMessageEvents.has(channelId))
            return;

        this.#channelMessageEvents.get(channelId).Unsubscribe(eventId);
        this.#channelIdLookup.delete(eventId);
    }

    UnsubscribeAllChannels(eventId) { 
        this.#allMessageEvent.Unsubscribe(eventId);
    }
}