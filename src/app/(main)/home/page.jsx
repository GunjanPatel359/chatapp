import { isAuthUser } from "@/lib/authMiddleware"
import SideBar from "./SideBar"
import HomeSideBar from "./HomeSideBar"
import ServerSideBar from "./ServerSideBar"

const HomePage=async()=>{
    const userData=isAuthUser()
    const user=await Promise.all([userData])
    console.log(user)
    return (
        <div className="flex">
            <SideBar />
            <HomeSideBar />
            {/* <ServerSideBar /> */}
        </div>
    )
}

export default HomePage