import ChatConnector from "./services/ChatConnector"
import { EventVar } from "./services/Utils"

export const MESSENGER_SERVER = import.meta.env.VITE_MESSENGER_SERVER
export const AUTH_SERVER = import.meta.env.VITE_AUTH_SERVER
export const USER_SERVER = import.meta.env.VITE_USER_SERVER
export const IMAGE_SERVER = import.meta.env.VITE_IMAGE_SERVER


export const GlobalContext = {
        cache: {
            imageMap: new Map(),
            userNamesMap: new Map()
        },
        service: {
            chat: new ChatConnector()
        },
        user: {
            authToken: new EventVar(null),
            authInfo: new EventVar(null),
            userInfo: new EventVar(null),
            userGroups: new EventVar(null),
        }
    };