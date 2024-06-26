import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import { useContext } from 'react';
import { GlobalContext } from '../../../Global';
import Skeleton from '@mui/material/Skeleton'
import Avatar from '../../Avatar';

function convertDate(utcTime) {
    const timeZoneOffset = (new Date().getTimezoneOffset()) * 60000;
    const dDate = new Date(utcTime - timeZoneOffset)

    let str = dDate?.toISOString()?.substring(11, 19)?.replace('T', ' ') ?? "N/A";
    return str;
}

function messageStatus(st) { 
    return (<div>
        {st == null ? <DoneIcon style={{marginTop: '-6px'}} color="disabled" sx={{ fontSize: '20px' }} /> : <></>}
        {st == true ? <DoneIcon style={{marginTop: '-6px'}} color="primary" sx={{ fontSize: '20px' }} /> : <></>}
        {st == false ? <CloseIcon style={{marginTop: '-6px'}} color="disabled" sx={{ fontSize: '20px' }} /> : <></>}
    </div>)
}

function imgStatus(img) { 
    
    return (
        <div key={img.id}>
            {
                img.hash == 'loading' ? (
                    <div className="p-1 max-h-96">
                        <Skeleton variant="rectangular" className="rounded-lg" width={210} height={118} />
                    </div>
                ): (
                    <img className="rounded-lg max-h-96 p-1" key={img.id} src={GlobalContext.cache.imageMap.get(img.hash).url}></img>
                )
            }
        </div>
    )
}

export default function ChatMessageContainer(props)
{ 
    const bgColor = props.me ? "bg-gradient-to-br from-sky-300/70 to-indigo-300/70" : "bg-gradient-to-br from-white/70 bg-slate-200/70";
    const profileImgMg = props.me ? "ml-3" : "mr-3";

    const profileImg = (<>
        <div className={profileImgMg}>
            <div style={{ height: "55px", width: "55px" }}>
                <Avatar shadow={true} border={ true}></Avatar>
            </div>
        </div>
    </>)
    
    return (
        <div className="p-1 flex w-full items-start">

            {props.me ? <div className="flex-1"></div> : <></>}
            {!props.me ? profileImg : <></>}

            <div className={"flex flex-col gap-1"}>

                { /* user name */}
                <div className="flex">
                    { props.me ? <div className="grow"></div> : <></>}
                    <p className={"text-md font-medium text-white text-ellipsis text-nowrap md:max-w-72 max-w-52 overflow-hidden"}>{(props.userName ?? props.userId)}</p>
                    { !props.me ? <div className="grow"></div>: <></>}
                </div>

                {/*message body*/}
                <div className="flex">
                    { props.me ? <div className="grow"></div> : <></>}
                    
                    <div className={"backdrop-blur-md rounded-md shadow-md md:max-w-96 max-w-72 overflow-hidden " + bgColor}>
            
                        { /*time and status */}
                        <div className="flex p-1 pl-2 pr-2 items-center gap-7">
                            {props.me ? messageStatus(props.success) : <></> }
                            {props.me ? <div className="grow"></div> : <></>}
                            <p className={"text-sm font-medium "}>{convertDate(props.time)}</p>
                            {!props.me ? <div className="grow"></div> : <></>}
                        </div>

                        {/*content*/}
                        <div className="pb-1 pt-0 pl-2 pr-2">
                            <div className="whitespace-pre-wrap break-words">
                                {props.msg.text}
                            </div>
                            {
                                props.msg.imgs.map(x => imgStatus(x))
                            }
                        </div>        

                    </div>

                    { !props.me ? <div className="grow"></div>: <></>}
                </div>
                
            </div>

            

            {(!props.me) ? <div className="flex-1"></div> : <></>}
            {props.me ? profileImg : <></>}

        </div>
    )
}