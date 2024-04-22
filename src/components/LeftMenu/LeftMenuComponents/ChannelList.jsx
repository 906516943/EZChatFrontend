import ChannelItem from "./ChannelListComponents/ChannelItem";

export default function ChannelList(props) { 

    if (props.groups == null) { 

        return (<>
        
        </>)
    }

    return (<div className="w-full min-h-full bg-white flex flex-col p-2 gap-1 bg-gray-100">

        {
            props.groups.map((item) => (
                <div key={item.id} onClick={() => props.itemClicked(item)}>
                    <ChannelItem title={item.title ?? item.id} subtitle={"nothing "} selected={ props.itemSelectFun(item) }></ChannelItem>
                </div>
            ))
        }
    </div>)
}