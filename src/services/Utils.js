import { SHA256 } from "crypto-js";
import CryptoJS from "crypto-js";

export function GenId() { 
    return Date.now() + Math.floor(Math.random() * 1000000);
}

export function GenHash(arrayBuffer) { 
    return SHA256(CryptoJS.lib.WordArray.create(arrayBuffer)).toString(CryptoJS.enc.Base64url) + '-' + arrayBuffer.byteLength;
}


export class EventVar{

    #val = null
    #functions = new Map();

    constructor(val = null) { 
        this.#val = val;
    }

    Get() { 
        return this.#val;
    }

    Set(newVal) { 
        this.#val = newVal;

        for (const [_, val] of this.#functions.entries()) { 
            val();
        }
    }

    Subscribe(fun) { 
        const newId = GenId();

        this.#functions.set(newId, fun);
        return newId;
    }

    Unsubscribe(id) { 
        this.#functions.delete(id);
    }
};