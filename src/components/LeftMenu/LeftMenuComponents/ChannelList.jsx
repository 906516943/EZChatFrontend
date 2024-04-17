import ChannelItem from "./ChannelListComponents/ChannelItem";

export default function ChannelList() { 

    return (<div className="w-full min-h-full bg-white flex flex-col p-2 gap-1 bg-gray-100">
        <ChannelItem selected="true"></ChannelItem>
        <ChannelItem></ChannelItem>
        <ChannelItem></ChannelItem>
        <ChannelItem></ChannelItem>
        <ChannelItem></ChannelItem>
    </div>)
}