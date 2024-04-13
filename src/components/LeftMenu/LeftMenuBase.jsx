import Profile from "./LeftMenuComponents/Profile";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

export default function LeftMenuBase() { 


    return (
        <div className="w-full h-full p-2 flex flex-col gap-2">
            <div>
                <Profile name="Example user"></Profile>
            </div>
            <div className="w-full h-full rounded-md overflow-hidden relative">
                <div className="w-full flex bg-white/20 absolute backdrop-blur-md">
                        <div className="h-10 w-full flex items-center justify-center" >
                            <PersonRoundedIcon sx={{ fontSize: 28, color: "blue" }}></PersonRoundedIcon>
                        </div>
                        <div className="h-10 w-full flex items-center justify-center">
                            <PeopleAltRoundedIcon sx={{ fontSize: 28 }}></PeopleAltRoundedIcon>
                        </div>
                        <div className="h-10 w-full flex items-center justify-center">
                            <SettingsRoundedIcon sx={{ fontSize: 28 }}></SettingsRoundedIcon>
                        </div>
                    </div>
                <div className="w-full h-full overflow-auto" style={{scrollbarWidth: 'thin'}}>

                    <div className="w-full bg-gradient-to-b from-white to-black" style={{height:'3000px'}}></div>
                </div>
            </div>
        </div>
    )
}