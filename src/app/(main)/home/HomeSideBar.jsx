
import { FaPlus } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { BsBugFill } from "react-icons/bs";
import { HiShoppingCart } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";

const HomeSideBar = () => {
  const directMessages = [
    { name: "Mohammed Farhan", status: "online" },
    { name: "APULJO", status: "online" },
    { name: "elysennn_", status: "online" },
    { name: "Ninja", status: "online" },
    { name: "hrook", status: "offline" },
    { name: "ProBot", status: "playing", activity: "/help" },
    { name: "venkey", status: "online" },
    { name: "silentkiller24", status: "offline" },
    { name: "Carl-bot", status: "playing", activity: "/games | carl.gg" },
    { name: "Dyno", status: "online" },
  ];

  return (
    <div className="w-[300px] h-screen bg-gray-50 text-indigo-500 flex flex-col pt-2">
      <div className="overflow-y-scroll scrollbar-none">
        {/* Navigation */}
        <div className="flex flex-col space-y-1 px-4">
          <SidebarItem name="Friends" icon={FaUserFriends} />
          <SidebarItem name="Nitro" icon={BsBugFill} />
          <SidebarItem name="Shop" icon={HiShoppingCart} />
        </div>

        {/* Divider */}
        <div className="border-t border-indigo-400 my-2 mx-3"></div>

        {/* Direct Messages */}
        <div className="flex-1 scrollbar-none">
          <div className="flex justify-between px-4 mb-1">
            <h3 className=" text-sm my-auto font-semibold text-indigo-600 justify-center">
              DIRECT MESSAGES
            </h3>
            <span className="my-auto cursor-pointer">
              <FaPlus />
            </span>
          </div>
          <div className="p-2">
          {directMessages.map((dm, index) => (
            <DirectMessage
            key={index}
            name={dm.name}
            status={dm.status}
            activity={dm.activity}
            />
          ))}
          </div>
        </div>
      </div>
      {/* Bottom User Info */}
      <div className="p-1 space-x-2 border-t-2 border-indigo-200 shadow shadow-gray-100">
        <div className="hover:bg-gray-200 flex items-center p-2 rounded cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
          G
        </div>
        <div className="flex-1 ml-2">
          <h3 className="text-sm font-bold text-indigo-500">gunjanpatel</h3>
          <p className="text-xs text-gray-400">Idle</p>
        </div>
        <div className="flex space-x-2 text-gray-400">
          <button>
            <IoSettingsSharp size={22} className="text-indigo-500 transition-all duration-500 hover:rotate-90"/>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ name, icon:Icon }) => (
  <div className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md cursor-pointer">
    <Icon size={20} />
    <span className="text-sm">{name}</span>
  </div>
);

const DirectMessage = ({ name, status, activity }) => (
  <div className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md cursor-pointer">
    <div
      className={`w-10 h-10 rounded-full bg-gray-50 shadow flex items-center justify-center`}
    >
      {name[0].toUpperCase()}
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-indigo-500">{name}</h4>
      {activity ? (
        <p className="text-xs text-gray-400">Playing {activity}</p>
      ) : (
        <p className="text-xs text-gray-400">{status}</p>
      )}
    </div>
  </div>
);

export default HomeSideBar;