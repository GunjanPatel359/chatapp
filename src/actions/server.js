"use server"

import { isAuthUser } from "@/lib/authMiddleware"

export const createServer=async(name,description,categories)=>{
    try {
        if(!name && !description){
            throw new Error("name and description is required")
        }
        const user=await isAuthUser()
        if(!user) return console.log('no user')
    } catch (error) {
        throw new Error(error)
    }
}

