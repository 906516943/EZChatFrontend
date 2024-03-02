import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

import { IconButton, TextField } from '@mui/material';
import { useState } from 'react';
import ChatBoxTextArea from './ChatBoxTextArea';




export default function ChatMessageSender(props)
{ 
    const [imgSelector, setImageSelector] = useState(false);
    const height = imgSelector ? "h-28" : "h-0";

    return (
        <div className="w-full flex flex-col backdrop-blur-md shadow-md bg-white/85">
            <div className={"ease-in-out duration-100 overflow-hidden w-full " + height}>
                <div className='h-28 p-4 flex gap-4 w-full overflow-x-auto overflow-y-hidden'>
                    <div className='h-20 w-20 rounded-lg shrink-0 shadow-xl bg-cover' style={{backgroundImage: 'url("m42.jpg")'}}>

                    </div>
                    <div className='h-20 w-20 rounded-lg shrink-0 shadow-xl bg-cover' style={{backgroundImage: 'url("m42.jpg")'}}>

                    </div>
                    <div className='h-20 w-20 rounded-lg shrink-0 shadow-xl bg-cover' style={{backgroundImage: 'url("m42.jpg")'}}>

                    </div>

                    <div className='h-20 w-20 rounded-lg shrink-0 shadow-xl bg-cover' style={{backgroundImage: 'url("m42.jpg")'}}>

                    </div>

                    <div className='h-20 w-20 rounded-lg shrink-0 shadow-xl bg-cover' style={{backgroundImage: 'url("m42.jpg")'}}>

                    </div>

                    <div className='h-20 w-20 rounded-lg shrink-0 shadow-xl bg-cover' style={{backgroundImage: 'url("m42.jpg")'}}>

                    </div>

                </div>
            </div>
            <div className="p-2 flex items-start gap-2">
                <IconButton aria-label="Image" onClick={() => setImageSelector(!imgSelector)}>
                    <ImageOutlinedIcon fontSize="medium"></ImageOutlinedIcon>
                </IconButton>
                <ChatBoxTextArea enterPressed={(x) => props.textEntered(x)}></ChatBoxTextArea>
            </div>

        </div>
    );
}