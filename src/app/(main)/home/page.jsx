import { isAuthUser } from "@/lib/authMiddleware"
import SideBar from "./SideBar"

const HomePage=async()=>{
    const userData=isAuthUser()
    const user=await Promise.all([userData])
    console.log(user)
    return (
        <div>
            <SideBar />
        </div>
    )
}

export default HomePage