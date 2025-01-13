import HomeSideBar from "./HomeSideBar"
const LayoutPage=({children})=>{
    return (
        <div className="flex">
            <HomeSideBar />
            {children}
        </div>
    )
}

export default LayoutPage