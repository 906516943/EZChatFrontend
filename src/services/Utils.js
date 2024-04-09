import { SHA256 } from "crypto-js";
import CryptoJS from "crypto-js";

export function GenId() { 
    return Date.now() + Math.floor(Math.random() * 1000000);
}

export function GenHash(arrayBuffer) { 
    return SHA256(CryptoJS.lib.WordArray.create(arrayBuffer)).toString(CryptoJS.enc.Base64url) + '-' + arrayBuffer.byteLength;
}