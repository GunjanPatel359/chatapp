import ServerSideBar from "./ServerSideBar"

const LayoutPage=({children})=>{
    return (
        <div className="flex">
            <ServerSideBar />
            <div className="flex-1">
            {children}
                </div>
        </div>
    )
}

export default LayoutPage