import Profile from "./LeftMenuComponents/Profile";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import ChannelList from "./LeftMenuComponents/ChannelList";
import { GlobalContext } from "../../Global";
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

    const [selectedChatId, setSelectedChatId] = useState(null)

    const content = (state) => {

        if (state == 'friends') {
            return (<><p>nothing is here</p></>)
        } else if (state == 'groups') {

            return (<>
                {
                    <ChannelList groups={userGroups}
                        itemClicked={(x) => { setSelectedChatId(x.id); GlobalContext.user.selectedChatId.Set(x.id) }}
                        itemSelectFun={(x) => x.id == selectedChatId}>
                    </ChannelList>
                }</>)
            
        } else if (state == 'me') { 
            return (<><p>nothing is here</p></>)
        }


    };

    useEffect(() => { 

        const nameId = GlobalContext.user.userInfo.Subscribe(() => { 
            const name = GlobalContext.user.userInfo.Get()?.name ?? "Loading...";
            setUserName(name);
        });

        const groupsId = GlobalContext.user.userGroups.Subscribe(() => {
            const groups = GlobalContext.user.userGroups.Get() ?? []
            SetGroups(groups, setUserGroups);
        });

        
        return () => { 
            GlobalContext.user.userInfo.Unsubscribe(nameId);
            GlobalContext.user.userGroups.Unsubscribe(groupsId);
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