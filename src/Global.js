import ChatConnector from "./services/ChatConnector"
import ChatMessageDistributor from "./services/ChatMessageDistributor"
import { EventVar } from "./services/Utils"

export const MESSENGER_SERVER = import.meta.env.VITE_MESSENGER_SERVER
export const AUTH_SERVER = import.meta.env.VITE_AUTH_SERVER
export const USER_SERVER = import.meta.env.VITE_USER_SERVER
export const IMAGE_SERVER = import.meta.env.VITE_IMAGE_SERVER



const chatConnector = new ChatConnector();

export const GlobalContext = {
        cache: {
            imageMap: new Map(),
            userNamesMap: new Map(),
            groupsInfoMap: new Map()
        },
        service: {
            chatConnector: chatConnector,
            chatMessageDistributor: new ChatMessageDistributor(chatConnector)
        },
        user: {
            authToken: new EventVar(),
            authInfo: new EventVar(),
            userInfo: new EventVar(),
            userGroups: new EventVar(),
            selectedChatId: new EventVar()
        }
    };