import SideBar from "./SideBar"

const LayoutPage=({children})=>{
    return (
        <div className="flex max-h-screen w-full">
            <SideBar />
            <div className="flex-1">
            {children}
            </div>
        </div>
    )
}

export default LayoutPage