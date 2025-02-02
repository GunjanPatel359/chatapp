import React from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";


const ChatArea = () => {
  const messages = [
    {
      author: "Mr.Random018",
      date: "11/24/2024 10:43 PM",
      message: "Hii\nCan anyone provide eg lab manual part 2 for sem 1?",
      highlight: false,
    },
    {
      author: "TYSON",
      date: "12/8/2024 9:04 AM",
      message: "Can anyone provide tomorrow mathematics important questions ❓",
      highlight: true,
    },
    {
      author: "Krushnaraj",
      date: "12/16/2024 6:31 PM",
      message: "Reddit community for GUNI students\nhttps://www.reddit.com/r/GanpatUniversity/s/wAw0SeUy6U",
      highlight: false,
    },
    {
      author: "Lucifer",
      date: "12/18/2024 8:36 PM",
      message: "EG MA ANY ONE SEND ME PROJECTION OF SOLID PPT",
      highlight: false,
    },
  ];

  return (
    <div className="h-full px-4 py-2 bg-white shadow-gray-300 shadow-inner flex flex-col">

      <div className="flex-1">


        {/* chat appear section */}
        <MessageDialogOther/>
        <MessageDialogOther/>
        <DateSeparator/>
        <MessageDialogOther/>


      </div>
      <div className="flex flex-col space-y-2">
        <div className=" h-[2px] bg-indigo-300 w-full shadow-md" />
        <div className="py-3 px-2 bg-gray-200 rounded-md flex">
          <AiFillPlusCircle className="text-indigo-500 my-auto mx-2 cursor-pointer" size={25} />
          <input className="flex-1 bg-transparent text-indigo-500 placeholder:text-indigo-400 outline-none resize-none my-auto" placeholder="Enter your message # | general" />
          <BsEmojiSmileFill className="text-indigo-500 my-auto mx-2 cursor-pointer" size={20} />
          <div className="my-auto text-indigo-400">|</div>
          <IoSend className="text-indigo-500 my-auto mx-2 cursor-pointer" size={20} />
        </div>
      </div>
    </div>
  );
};

const DateSeparator=()=>{
  return (
    <div className="text-gray-400 text-sm my-2 w-full flex">
      <div className="h-[2px] flex-1 bg-gray-300 my-auto ml-1"></div>
      <div className="mx-2">January 29,2025</div>
      <div className="flex-1 h-[2px] bg-gray-300 my-auto mr-1"></div>
    </div>
  )
}

const MessageDialogOther = () => {
  return (
    <div className="flex mb-2">
      <div className="rounded-full bg-red-300 w-12 h-12"></div>
      <div className="flex flex-col ml-2 flex-1">
        <div className="flex">
          <div className="font-bold">
            Krushnaraj
          </div>
          <div className="text-xs my-auto ml-2"> 11/13/2024 </div>
          <div className="text-xs my-auto ml-1">11:37 PM</div>
        </div>
        <div className="text-justify">Reddit comments are so underatted sjadngjbsdihfsh usahgihasibasiu iasd vhis vihhasihvhiasdhviubasdioy ihas iashviuasd hiuashiuas y</div>
      </div>
    </div>
  )
}

export default ChatArea;
