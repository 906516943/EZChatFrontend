import { CircularProgress } from "@mui/material";
import ChannelItem from "./ChannelListComponents/ChannelItem";

export default function ChannelList(props) { 

    if (props.groups == null) { 

        return (<div className="w-full flex p-4 justify-center">
            <CircularProgress />
        </div>)
    }

    return (<div className="w-full min-h-full bg-white flex flex-col p-2 gap-1 bg-gray-100">

        {
            props.groups.map((item) => (
                <div key={item.id} onClick={() => props.itemClicked(item)}>
                    <ChannelItem channelInfo={ props.channelsMsgInfo.get(item.id)} title={item.title ?? item.id} selected={ props.itemSelectFun(item) }></ChannelItem>
                </div>
            ))
        }
    </div>)
}