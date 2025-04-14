"use client"
import { useState } from "react"
import UserSettingSidebar from "./UserSettingSidebar"

const Layout = ({ children }) => {
    const [loading, setLoading] = useState(false)
    return (
        <div className="mx-auto h-screen">
            <div className="flex h-full shadow rounded-lg">
                {!loading ? (
                    <>
                        <div className="w-[80%] mx-auto flex">
                            <div className="w-[250px] bg-gray-100">
                                <UserSettingSidebar />
                            </div>
                            <div className="flex-1 bg-gray-50 overflow-y-scroll scrollbar-none">{children}</div>
                        </div>
                    </>
                ) : (
                    <div>
                        Loading
                    </div>
                )}
            </div>
        </div>
    )
}

export default Layout