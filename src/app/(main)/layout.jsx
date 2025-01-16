import SideBar from "./SideBar"

const LayoutPage=({children})=>{
    return (
        <div className="flex h-full w-full">
            <SideBar />
            <div className="flex-1">
            {children}
            </div>
        </div>
    )
}

export default LayoutPage