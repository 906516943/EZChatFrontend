import Profile from "./LeftMenuComponents/Profile";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import ChannelList from "./LeftMenuComponents/ChannelList";
import { GlobalContext, VIEW_CHAT } from "../../Global";
import { GetGroupInfo } from "../../services/Api"


async function SetGroups(groups, updateFun) { 

    const newGroups = groups.map(x => { return { id: x, title: null }; });


    //pull group info
    newGroups.forEach(e => {
        
        if (GlobalContext.cache.groupsInfoMap.has(e.id))
            e.title = GlobalContext.cache.groupsInfoMap[e.id].name

    });

    updateFun(newGroups);


    //find and fetch missing infos
    for (const i of newGroups.filter(x => x.title == null)) { 
        const info = await GetGroupInfo(i.id);

        i.title = info.name;
        GlobalContext.cache.groupsInfoMap.set(i.id, info);
    }

    updateFun([...newGroups]);
}


export default function LeftMenuBase() { 

    const [currentSelected, setCurrentSelected] = useState("groups")
    const [userName, setUserName] = useState("Loading...")

    const [userGroups, setUserGroups] = useState(null)

    const channelsMsgInfoDict = useRef(new Map())
    const [channelsMsgInfo, setChannelsMsgInfo] = useState(new Map())
    const [selectedChatId, setSelectedChatId] = useState(null)



    const ItemClicked = (item) => {

        GlobalContext.user.selectedChatId.Set(item.id);
        GlobalContext.currentView.Set(VIEW_CHAT);

        setSelectedChatId(item.id)

        if (channelsMsgInfoDict.current.has(item.id)) { 
            const t = channelsMsgInfoDict.current.get(item.id);
            channelsMsgInfoDict.current.set(item.id, {count: 0, text: t.text });
        }
        
        setChannelsMsgInfo(new Map(channelsMsgInfoDict.current));
    };


    const content = (state) => {

        if (state == 'friends') {
            return (<><p>nothing is here</p></>)
        } else if (state == 'groups') {

            return (<>
                {
                    <ChannelList groups={userGroups}
                        channelsMsgInfo={channelsMsgInfo}
                        itemClicked={(x) => ItemClicked(x) }
                        itemSelectFun={(x) => x.id == selectedChatId}>
                    </ChannelList>
                }</>)
            
        } else if (state == 'me') { 
            return (<><p>nothing is here</p></>)
        }


    };

    useEffect(() => { 

        const selectedChatEventId = GlobalContext.user.selectedChatId.Subscribe(() => {
            setSelectedChatId(GlobalContext.user.selectedChatId.Get());
        });

        const nameId = GlobalContext.user.userInfo.Subscribe(() => { 
            const name = GlobalContext.user.userInfo.Get()?.name ?? "Loading...";
            setUserName(name);
        });

        const groupsId = GlobalContext.user.userGroups.Subscribe(() => {
            const groups = GlobalContext.user.userGroups.Get() ?? []
            SetGroups(groups, setUserGroups);
        });

        const groupsMsgId = GlobalContext.service.chatMessageDistributor.SubscribeAllChannels((msg) => { 

            let text = msg.text;

            if ((msg.imagesById.length != 0)) { 
                text = text + msg.imagesById.map(x => "[Image]").reduce((a, b) => a + b);
            }

            if (!channelsMsgInfoDict.current.has(msg.channelId))
                channelsMsgInfoDict.current.set(msg.channelId, { count: 0, text: text});

            
            if (msg.channelId == GlobalContext.user.selectedChatId.Get()) {
                channelsMsgInfoDict.current.set(msg.channelId, { count: 0, text: text});
            } else { 
                const t = channelsMsgInfoDict.current.get(msg.channelId);
                channelsMsgInfoDict.current.set(msg.channelId, { count: t.count + 1, text: text });
            }

            setChannelsMsgInfo(new Map(channelsMsgInfoDict.current));

        })

        return () => { 
            GlobalContext.user.userInfo.Unsubscribe(nameId);
            GlobalContext.user.userGroups.Unsubscribe(groupsId);
            GlobalContext.service.chatMessageDistributor.UnsubscribeAllChannels(groupsMsgId);
            GlobalContext.user.selectedChatId.Unsubscribe(selectedChatEventId);
        }
    }, [])


    return (
        <div className="w-full h-full p-2 flex flex-col gap-2">
            <div>
                <Profile name={userName}></Profile>
            </div>
            <div className="w-full h-full rounded-md overflow-hidden relative">
                <div className="w-full flex bg-black/5 absolute backdrop-blur-md">
                    <div className="h-12 w-full flex items-center justify-center" >
                        <IconButton onClick={() => setCurrentSelected('friends')}>
                            <PersonRoundedIcon sx={{ fontSize: 28, color: (currentSelected == 'friends') ? "#3498DB" : "initial" }}></PersonRoundedIcon>
                        </IconButton>
                    </div>
                    <div className="h-12 w-full flex items-center justify-center">
                        <IconButton onClick={() => setCurrentSelected('groups')}>
                            <PeopleAltRoundedIcon sx={{ fontSize: 28, color: (currentSelected == 'groups') ? "#3498DB" : "initial" }}></PeopleAltRoundedIcon>
                        </IconButton>
                    </div>
                    <div className="h-12 w-full flex items-center justify-center">
                        <IconButton onClick={() => setCurrentSelected('me')}>
                            <SettingsRoundedIcon sx={{ fontSize: 28, color: (currentSelected == 'me') ? "#3498DB" : "initial" }}></SettingsRoundedIcon>
                        </IconButton>
                    </div>
                </div>
                <div className="w-full h-full overflow-auto flex flex-col" style={{ scrollbarWidth: 'thin' }}>
                    <div className="w-full h-12 bg-white shrink-0"></div>
                    <div className="w-full bg-white grow">
                        { content(currentSelected)}
                    </div>
                </div>
            </div>
        </div>
    )
}