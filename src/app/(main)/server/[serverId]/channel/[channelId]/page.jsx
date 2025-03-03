import ChannelHeader from "./ChannelHeader";
import ChatArea from "./ChatArea";

const ChannelPage = () => {
    const channelInfo = {
        name: "Channel1",
        description: "This is a channel page",
    };

    return (
        <div className="flex flex-col h-screen flex-1">
            {/* Header */}
            <ChannelHeader channel={channelInfo} />
            
            {/* Main Chat Section */}
            <div className="flex-1 flex">
                <ChatArea />
                {/* Sidebar (Optional) */}
                <div className="w-64 bg-indigo-500">reserved</div>
            </div>
        </div>
    );
};

export default ChannelPage;