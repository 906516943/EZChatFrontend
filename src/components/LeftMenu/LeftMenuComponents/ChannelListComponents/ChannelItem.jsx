import Avatar from "../../../Avatar";

export default function ChannelItem(props) { 

    const selected = props.selected ? 'bg-gray-300 shadow-inner' : 'hover:bg-gray-200'

    return (
        <div className={"p-2 transition duration-100 ease-in-out rounded-lg hover:cursor-pointer " + selected}>
            <div className="w-full h-14 flex gap-4">
                <div className="w-14 h-14">
                    <Avatar url="avatar.png"></Avatar>
                </div>
                <div className="h-full flex items-center">
                    <div>
                        <p style={{ width:"220px"}} className={"font-semibold text-md text-ellipsis text-nowrap md:max-w-72 max-w-52 overflow-hidden"}>World Channel World Channel World Channel</p>
                        <p style={{width:"220px"}} className={"text-slate-700 text-xs text-ellipsis text-nowrap md:max-w-72 max-w-52 overflow-hidden"}>Someone said: hello</p>
                    </div>
                </div>
            </div>
        </div>
        )
}