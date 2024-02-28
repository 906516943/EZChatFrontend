function convertDate(date) {
    let str = date?.toISOString()?.substring(11, 19)?.replace('T', ' ') ?? "N/A";
    return str;
}

export default function ChatMessageContainer(props)
{ 
    let bgColor = props.Me ? "bg-blue-200/70" : "bg-white/70";
    
    return (
        <div className="p-1 flex w-full">
            {props.Me ? <div className="flex-1"></div> : <></>}

            <div className={"backdrop-blur-md rounded-md shadow-md p-1 pl-2 pr-2 " + bgColor} style={{maxWidth:'calc(100% - 50px)'}}>
            
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
        </div>
    )
}