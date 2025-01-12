import { BsPlus, BsFillLightningFill, BsGearFill } from 'react-icons/bs';
import { FaFire, FaPoo } from 'react-icons/fa';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const SideBar = () => {
    return (
        <div
            className="h-screen w-20 flex flex-col
      bg-white shadow-lg justify-between"
        >
            <div>
                <SideBarIcon icon={<FaFire size="28" />} text="Home" />
                <Divider />
            </div>
            <div className='flex-1 overflow-y-scroll scrollbar-none my-1'>
                <SideBarIcon icon={<BsFillLightningFill size="20" />} text="Tools" />
                <SideBarIcon icon={<BsFillLightningFill size="20" />} text="Tools" />
                <SideBarIcon icon={<BsFillLightningFill size="20" />} text="Tools" />
                <SideBarIcon icon={<BsFillLightningFill size="20" />} text="Tools" />
                <SideBarIcon icon={<BsFillLightningFill size="20" />} text="Tools" />
                <SideBarIcon icon={<BsFillLightningFill size="20" />} text="Tools" />
                <SideBarIcon icon={<BsFillLightningFill size="20" />} text="Tools" />
                <SideBarIcon icon={<BsFillLightningFill size="20" />} text="Tools" />
                <SideBarIcon icon={<BsFillLightningFill size="20" />} text="Tools" />
                <SideBarIcon icon={<FaPoo size="20" />} text="Fun" />
            </div>
            <div>
                <Divider />
                <SideBarIcon icon={<BsPlus size="32" />} text="Create server" />
                <SideBarIcon icon={<BsGearFill size="22" />} text="Settings" />
            </div>
        </div>
    );
};

const SideBarIcon = ({ icon, text = 'tooltip 💡' }) => (
    <div>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className="relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto 
                    bg-white border border-dashed border-indigo-500 hover:bg-indigo-600 text-indigo-500 hover:text-white
                    hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg group"
    >
                    <div className='absolute -translate-x-10 w-2 h-10 rounded bg-indigo-500'/>
                    {icon}
                </div>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={13}>
                <p>{text}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    </div>
);

const Divider = () => (
    <hr
        className="bg-indigo-500
    border border-indigo-500 rounded-full
    mx-4"
    />
);

export default SideBar;
