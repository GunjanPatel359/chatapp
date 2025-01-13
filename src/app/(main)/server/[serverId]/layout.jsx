import ServerSideBar from "./ServerSideBar"

const LayoutPage=({children})=>{
    return (
        <div className="flex">
            <ServerSideBar />
            {children}
        </div>
    )
}

export default LayoutPage