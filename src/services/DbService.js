export class DbService { 

    Check() { 
        if (!this.#GetIndexedDb())
            return false;

        return true;
    }

    #GetIndexedDb() { 
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    }

    #GetDatabase(onSuccess, onError) { 
        const database = this.#GetIndexedDb();
        const openReq = database.open("ezchat", 1);

        openReq.onupgradeneeded = (e) => {

            const db = e.target.result;

            //delete all chat history
            db.deleteObjectStore("chat-history");
            const chatHistoryStore = db.createObjectStore("chat-history", { keyPath: "messageId" });
            
            chatHistoryStore.createIndex("channelId", "channelId", { unique: true });
            chatHistoryStore.createIndex("timeStamp", "timeStamp", { unique: true });
        };

        openReq.onsuccess = (e) => onSuccess(e.target.result);
        openReq.onerror = (e) => onError(e.target.name);
    }


    AddNewMessage(msg) { 
        
        return new Promise((resolve, reject) => {
            this.#GetDatabase((db) => {

                const transaction = db.transaction(["chat-history"], "readwrite");
                transaction.onerror = (e) => reject(e.target.name);
                
                const store = transaction.objectStore("chat-history");
                const addRequest = store.add(msg);

                addRequest.onsuccess = (_) => resolve()
                addRequest.onerror = (e) => reject(e.target.name);

            }, (r) => reject(r));
        });
    }

}