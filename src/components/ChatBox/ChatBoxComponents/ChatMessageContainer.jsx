function convertDate(timestamp) {

    const dDate = new Date(timestamp)
    let str = dDate?.toISOString()?.substring(11, 19)?.replace('T', ' ') ?? "N/A";
    return str;
}

export default function ChatMessageContainer(props)
{ 
    const bgColor = props.me ? "bg-blue-200/70" : "bg-white/70";
    const profileImgMg = props.me ? "ml-3" : "mr-3";

    const profileImg = (<>
        <div className={"shrink-0 grow-0 overflow-hidden border-2 rounded-full border-white shadow-md " + profileImgMg}>
            <img className="bg-white" src={ props.profileImg } width={"50px"} height={"50px"}></img>
        </div>
    </>)


    return (
        <div className="p-1 flex w-full items-start">

            {props.me ? <div className="flex-1"></div> : <></>}
            {!props.me ? profileImg : <></>}

            <div className={"backdrop-blur-md rounded-md shadow-md p-1 pl-2 pr-2 " + bgColor}>
            
                <div className="flex gap-10 items-center">
                    <p className="text-base font-medium">{props.user + ' :'}</p>
                    <div className="flex-1"></div>
                    <p className="text-sm font-medium">{ convertDate(props.msgId)}</p>
                </div>
                <div className="p-2 pl-4">
                    <span className="whitespace-pre-wrap">
                        {props.msg.text}
                    </span>
                    {
                        props.msg.imgs.map(x => (
                            <span>
                                <img className="rounded-lg max-h-96 sm:max-w-full md:max-w-96 p-1" key={x.url} src={x.url}></img>
                            </span>
                        ))
                    }
                </div>

            </div>

            {(!props.me) ? <div className="flex-1"></div> : <></>}
            {props.me ? profileImg : <></>}

        </div>
    )
}