import { FaHashtag } from "react-icons/fa";
import { FaMicrophoneSlash, FaThumbtack, FaCircle, FaUsers, FaQuestionCircle } from "react-icons/fa";
const ChannelHeader = ({ channel }) => {
    return (
        <div className="h-12 w-full bg-gray-50 px-2 shadow">
            <div
                className="flex items-center px-2 h-12 text-indigo-500 font-sans"
            >
                {/* Channel Name and Info */}
                <div className="flex items-center gap-2">
                    <FaHashtag />
                    <span className="text-lg font-semibold">{channel.name}</span>
                    <div className="text-2xl pl-1 my-auto translate-y-[-3px] text-indigo-300">|</div>
                </div>
                <div className="flex-1 flex pl-2 max-h-12 my-auto overflow-hidden text-ellipsis whitespace-nowrap text-indigo-300">
                    A space for open discussions about Neon and Postgres...
                </div>
                {/* Action Icons */}
                <div className="flex items-center gap-4">
                    <FaUsers className="my-auto text-indigo-200 cursor-pointer hover:text-indigo-400" size={25} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="px-2 py-1 rounded bg-white text-indigo-500 border border-indigo-300 outline-none placeholder:text-indigo-300"
                    />
                    <FaQuestionCircle className="w-5 h-5 text-indigo-200 cursor-pointer hover:text-indigo-400" />
                </div>

            </div>
        </div>
    )
}

export default ChannelHeader