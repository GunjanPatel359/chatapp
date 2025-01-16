import ChannelHeader from "./ChannelHeader"
import ChatArea from "./ChatArea"
const ChannelPage = () => {
    const channelInfo = {
        name: "Channel1",
        description: "This is a channel page",
    }
    return (
        <div className="flex flex-col h-screen">
            <div>
                <ChannelHeader channel={channelInfo} />
            </div>
            <div className="flex h-full">
                <div className="flex-1">
                    <ChatArea/>
                </div>
                <div className="w-64 bg-indigo-500">
                    reserved
                </div>
            </div>
        </div>
    )
}

export default ChannelPage