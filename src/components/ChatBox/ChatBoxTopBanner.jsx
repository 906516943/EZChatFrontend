import { IconButton }  from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MenuIcon from '@mui/icons-material/Menu';
import { GlobalContext, VIEW_LANDING_PAGE } from '../../Global';

export default function ChatBoxTopBanner() { 

    const exitClicked = () => {
        GlobalContext.currentView.Set(VIEW_LANDING_PAGE);
        GlobalContext.user.selectedChatId.Set(null);
    };


    return (
        <div className="w-full h-full flex items-center">
            <div className='p-2'></div>
                <div>
                    <IconButton aria-label="Image" onClick={exitClicked}>
                        <ArrowBackIosIcon fontSize="medium" sx={{ color: "rgba(64, 64, 64)" }}></ArrowBackIosIcon>
                    </IconButton>   
                </div>
                <div className='grow'>
                    <p className={"w-full text-2xl text-ellipsis text-nowrap overflow-hidden text-center"}>TestTest</p>
                </div>
                <div>
                    <IconButton aria-label="Image" onClick={() => GlobalContext.currentView.Set(VIEW_LANDING_PAGE)}>
                        <MenuIcon fontSize="medium" sx={{ color: "rgba(64, 64, 64)" }}></MenuIcon>
                    </IconButton>   
                </div>
            <div className='p-2'></div>
        </div>
    )

}