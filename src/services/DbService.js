export class DbService { 

    #userId

    Init(id) { 
        this.#userId = id
    }

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
        const openReq = database.open("ezchat-" + this.#userId, 1);

        openReq.onupgradeneeded = (e) => {

            const db = e.target.result;

            //delete all chat history
            if(db.objectStoreNames.contains("chat-history"))
                db.deleteObjectStore("chat-history");
            
            const chatHistoryStore = db.createObjectStore("chat-history", { keyPath: "messageId" });
            
            chatHistoryStore.createIndex("channelId", "channelId", { unique: false });
            chatHistoryStore.createIndex("timeStamp", "timeStamp", { unique: true });
        };

        openReq.onsuccess = (e) => onSuccess(e.target.result);
        openReq.onerror = (e) => onError(e.target.error);
    }


    AddNewMessage(msg) { 
        
        return new Promise((resolve, reject) => {
            this.#GetDatabase((db) => {

                const transaction = db.transaction(["chat-history"], "readwrite");
                transaction.onerror = (e) => reject(e.target.error);
                
                const store = transaction.objectStore("chat-history");
                const addRequest = store.add(msg);

                addRequest.onsuccess = (_) => resolve()
                addRequest.onerror = (e) => reject(e.target.error);

            }, (r) => reject(r));
        });
    }

    GetMessages(count, channel) { 
        const ret = [];
        let current = 0;

        return new Promise((resolve, reject) => {

            this.#GetDatabase((db) => {

                const transaction = db.transaction(["chat-history"], "readonly");
                transaction.onerror = (e) => reject(e.target.error);

                const store = transaction.objectStore("chat-history").index("channelId");
                const cursorRequest = store.openCursor(IDBKeyRange.only(channel), "prev");

                cursorRequest.onsuccess = (e) => {
                    const cursor = e.target.result;

                    if (cursor && (current < count))
                    { 
                        ret.push(cursor.value)

                        current++;
                        cursor.continue();
                    }

                };
                transaction.oncomplete = (_) => resolve(ret.reverse());
                cursorRequest.onerror = (e) => reject(e.target.error);

            }, (r) => reject(r));

        });
    }
    

}