import ServerSettingSideBar from "./ServerSettingSidebar"

const ServerSettingLayout=({children})=>{
    return (
        <div className="bg-white lg:w-[980px] mx-auto h-screen py-4">
            <div className="flex h-full shadow rounded-lg">
            <div className="w-[250px] bg-gray-100 rounded-s-lg">
                <ServerSettingSideBar/>
            </div>
            <div className="flex-1 bg-gray-200 rounded-e-lg">
            {children}
            </div>
                </div>
        </div>
    )
}

export default ServerSettingLayout