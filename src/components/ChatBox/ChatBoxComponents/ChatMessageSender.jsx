import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

import { IconButton, TextField } from '@mui/material';
import { useState } from 'react';
import ChatBoxTextArea from './ChatBoxTextArea';
import ImageSelector from './ImageSelector';




export default function ChatMessageSender(props)
{ 
    const [imgSelector, setImageSelector] = useState(false);
    const [imgs, setImgs] = useState([]);
    const height = imgSelector ? "h-28" : "h-0";


    const enterPressed = (x) => {

        if ((x != "") || (imgs.length > 0)) { 
            props.newMsg(x, imgs);
            setImageSelector(false);
            setImgs([]);
        }
    };

    return (
        <div className="w-full flex flex-col backdrop-blur-md shadow-md bg-white/60">
            <div className={"ease-in-out duration-100 overflow-y-hidden overflow-x-auto w-full " + height}>
                <ImageSelector imgs={imgs} setImgs={setImgs}></ImageSelector>
            </div>
            <div className="p-2 flex items-start gap-2">
                <IconButton aria-label="Image" onClick={() => setImageSelector(!imgSelector)}>
                    <ImageOutlinedIcon fontSize="medium"></ImageOutlinedIcon>
                </IconButton>
                <ChatBoxTextArea enterPressed={(x) => enterPressed(x)}></ChatBoxTextArea>
            </div>

        </div>
    );
}