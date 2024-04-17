import Profile from "./LeftMenuComponents/Profile";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useState } from "react";
import { IconButton } from "@mui/material";
import ChannelList from "./LeftMenuComponents/ChannelList";

export default function LeftMenuBase() { 

    const [currentSelected, setCurrentSelected] = useState("friends")

    const content = (state) => {

        if (state == 'friends') {
            return (<>{<ChannelList></ChannelList> }</>)
        } else if (state == 'groups') {
            return (<>{<ChannelList></ChannelList> }</>)
        } else if (state == 'me') { 
            return (<><p>nothing is here</p></>)
        }


    };


    return (
        <div className="w-full h-full p-2 flex flex-col gap-2">
            <div>
                <Profile name="Example user"></Profile>
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
                    { content(currentSelected)}
                </div>
            </div>
        </div>
    )
}