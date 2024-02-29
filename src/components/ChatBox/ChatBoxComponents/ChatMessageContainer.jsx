function convertDate(date) {
    let str = date?.toISOString()?.substring(11, 19)?.replace('T', ' ') ?? "N/A";
    return str;
}

export default function ChatMessageContainer(props)
{ 
    const bgColor = props.Me ? "bg-blue-200/70" : "bg-white/70";
    const profileImgMg = props.Me ? "ml-3" : "mr-3";

    const profileImg = (<>
        <div className={"shrink-0 grow-0 overflow-hidden border-2 rounded-full border-white shadow-md " + profileImgMg}>
            <img className="bg-white" src={ props.ProfileImg } width={"50px"} height={"50px"}></img>
        </div>
    </>)


    return (
        <div className="p-1 flex w-full items-start">

            {props.Me ? <div className="flex-1"></div> : <></>}
            {!props.Me ? profileImg : <></>}

            <div className={"backdrop-blur-md rounded-md shadow-md p-1 pl-2 pr-2 " + bgColor}>
            
                <div className="flex gap-4">
                    <p className="text-base font-medium">{props.User + ' :'}</p>
                    <div className="flex-1"></div>
                    <p className="text-sm font-medium">{ convertDate(props.Date)}</p>
                </div>
                <div className="p-2 pl-4">
                    <span>{props.Text}</span>
                </div>

            </div>

            {(!props.Me) ? <div className="flex-1"></div> : <></>}
            {props.Me ? profileImg : <></>}

        </div>
    )
}