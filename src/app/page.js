"use client"
import { addCategoryRole, addChannelRole, addMemberToServerRole, createServerRole, editServerRole, removeCategoryRole, removeChannelRole, updateCategoryRole, updateChannelRole } from "@/actions/role";
import { createCategory } from "@/actions/category"
import { inviteServer } from "@/actions/invite"
import { useEffect } from "react";
import { createChannel } from "@/actions/channel";
import { toast } from "@/hooks/use-toast";
// import { socket } from "@/server";

export default function Home() {
  useEffect(()=>{
    const initiatePage=async()=>{
      try {
        const serverId="cm6ccn9qu000wv30g49e63gbk"
        const categoryId="cm6cdmog9000dv3u4oqjhkdob"
        const channelId="cm6da2m4a0007v37gwiea406z"
        // const res=await createCategory("cm6ccn9qu000wv30g49e63gbk",{name:"testing category"})
        // console.log(res)
        // const res=await createChannel(serverId,categoryId,{name:"test channel",description:"test data"})
        // console.log(res)
        // const res=await addMemberToServerRole(serverId,"cm6cd67d40009v3u46ky19dwb", "cm6f8symz0001v3xwmvd6kwj2")
        // console.log(res)
        // const res=await addMemberToServerRole("cm5v60skj0001v34k146dluul","cm6c81zd4000dv30gglzsw7ze", "cm5v60stk000ev34kvsoma1f7")
        // console.log(res)


        // const res=await createServerRole("cm6ccn9qu000wv30g49e63gbk",{name:"test two"})
        // console.log(res)
        // const res=await editServerRole("cm5utrqbg000av3h4rsr970ey","cm6c81zd4000dv30gglzsw7ze",{name:"Admin",adminPermission:true})
        // console.log(res)
        // const res=await addCategoryRole("cm6ccn9qu000wv30g49e63gbk","cm6cdmog9000dv3u4oqjhkdob","cm6dbqr450001v33g17dxe864")
        // console.log(res)
        // const res=await updateCategoryRole(serverId,categoryId,"cm6dd0f93000bv33ga7jbgsas",{manageChannels:"ALLOW"})
        // console.log(res)
        // const res=await removeCategoryRole(serverId,categoryId,"cm6dd0f93000bv33ga7jbgsas")
        // console.log(res)

        // const res=await addChannelRole(serverId,categoryId,channelId,"cm6dbqrnt0003v33g79r3tcdp")
        // console.log(res)
        // const res=await updateChannelRole(serverId,categoryId,channelId,"cm6dfcfgi000rv33gscx3d372",{viewChannel:"ALLOW"})
        // console.log(res)
        // const res=await removeChannelRole(serverId,categoryId,channelId,"cm6dqddpj0007v3js9vehti60")
        // console.log(res)
        


        // const res=await createServerRole("cm5v60skj0001v34k146dluul",{name:"my rola"})
        // console.log(res)
        // const res=await createCategory("cm6ccn9qu000wv30g49e63gbk",{name:"testing cate"})
        // console.log(res)
        // const res=await inviteServer(serverId,"cm6f7mwgx0000g4qg0mzevkvx")
        console.log(res)
        if(res){
          toast({
            title: "success",
            description: "logged",
            variant: "success"
        })
      }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
      })
      }
    }
    initiatePage()
  },[])

  // useEffect(()=>{
  //   if(socket.connected){
  //     socket.on("connection")
  //   }
  // })
  return (
   <h1>Hello</h1>
  );
}
