"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter,useParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { joinServer } from "@/actions/invite";

const JoinServerComponent = () => {
    const router = useRouter();
    const params=useParams()
    console.log(params.invitestring)

  const handleJoinServer = async () => {
    try {
        const res=await joinServer(params.invitestring)
        console.log(res)
        if(res.success){
          toast({
            title: "Server Joined Successfully",
            description: "You have successfully joined the server",
            variant: "success",
          })
        }
    } catch (error) {
      console.error("Error joining server:", error);
      toast({
        title: "Error",
        description: "Something went wrong while trying to join the server.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
    <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleJoinServer}
        >
          "Join Server"
        </Button>
    </>
  );
};


export default JoinServerComponent