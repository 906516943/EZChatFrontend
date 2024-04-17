import Avatar from "../../Avatar";

export default function Profile(props) { 


    return (
        <div className="flex gap-4 w-full h-20">
            <div className="h-full w-20">
                <Avatar url={props.url} border={true }></Avatar>
            </div>
            <div className="h-full grow flex items-center">
                <div>
                    <p style={{ width: "230px" }} className={"font-semibold text-2xl text-ellipsis text-nowrap md:max-w-72 max-w-52 overflow-hidden"}>{props.name}</p>
                    <p style={{width:"230px"}} className={"text-slate-700 font-semibold text-md text-ellipsis text-nowrap md:max-w-72 max-w-52 overflow-hidden"}>empty</p>
                </div>
            </div>
        </div>
    )

}