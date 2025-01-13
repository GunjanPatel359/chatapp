import SideBar from "./SideBar"

const LayoutPage=({children})=>{
    return (
        <div className="flex h-full w-full">
            <SideBar />
            {children}
        </div>
    )
}

export default LayoutPage