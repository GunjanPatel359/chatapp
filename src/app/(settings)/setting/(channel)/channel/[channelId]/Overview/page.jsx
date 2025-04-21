"use client"
import { getChannelData, updateChannel } from "@/actions/channel";
import { toast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const OverviewComponent = () => {
  const params = useParams()
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchChanData = async () => {
      try {
        const res = await getChannelData(params.channelId)
        if (res.success) {
          setChannelName(res.channel.name)
          setDescription(res.channel.description)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchChanData()
  }, [])

  const handleSave = async () => {
    if (!channelName && !description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
    }
    try {
      const res = await updateChannel(params.channelId, { name: channelName, description })
      if (res.success) {
        toast({
          title: "Channel Updated",
          description: "Channel updated successfully",
          variant: "success"
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      })
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-indigo-600 text-lg font-semibold mb-4">Overview</h2>
      <p className="text-indigo-500 text-sm font-medium mt-2">CHANNEL NAME</p>
      <input
        type="text"
        className="bg-white border border-gray-300 p-2 rounded mt-2 text-indigo-600 w-full"
        placeholder="Enter Channel name"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />
      <p className="text-indigo-500 text-sm font-medium mt-2">CHANNEL DESCRIPTION</p>
      <textarea
        type="text"
        className="bg-white border border-gray-300 p-2 rounded mt-2 text-indigo-600 w-full resize-none h-24"
        placeholder="Enter Channel description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default OverviewComponent;