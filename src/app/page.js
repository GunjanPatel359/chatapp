"use client"
import { createServerRole } from "@/actions/role";
import { createCategory } from "@/actions/category"
import { inviteServer } from "@/actions/invite"
import { useEffect } from "react";

export default function Home() {
  useEffect(()=>{
    const initiatePage=async()=>{
      try {
        // const res=await createServerRole("cm5v60skj0001v34k146dluul",{name:"my rola"})
        // console.log(res)
        // const res=await createCategory("cm5v60skj0001v34k146dluul",{name:"series"})
        // console.log(res)
        // const res=await inviteServer("cm5v60skj0001v34k146dluul","cm60wl0bw0000v3lgs3iu2ppl")
        // console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
    initiatePage()
  },[])
  return (
   <h1>Hello</h1>
  );
}
