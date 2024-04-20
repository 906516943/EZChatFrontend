import { MESSENGER_SERVER } from '../Global'

export default class ChatConnector { 

    #connection = new signalR.HubConnectionBuilder()
        .withUrl(MESSENGER_SERVER, {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets})
        .build();

    #isConnected = false;
    
    async Connect(retry = 0, token) { 

        //if already connected, disconnect first
        try {
            await this.#connection.stop();
        } catch { };

        let connected = false;
        for (let r = 0; r <= retry; r++) { 

            try {

                await this.#connection.start();
                connected = true;

                break;
            } catch { }
        }

        if(!connected)
            throw new Error('Failed to connect to the server');

        //auth user
        const res = await this.#connection.invoke("SendAuthUser", token);

        if (!res) { 
            throw new Error("Login failed");
        }

        this.#isConnected = true;
    }


    OnReceiveMessage(fun) { 
        this.#connection.on("ReceiveMessage", fun);
    }

    OnClose(fun) { 
        this.#connection.onclose(() => { 
            this.#isConnected = false;
            fun();
        });
    }

    IsConnected() { 
        return this.#isConnected;
    }

    async SendMessage(msg) { 
        return await this.#connection.invoke("SendMessage", msg);
    }

}