"use client"
import { useState } from "react"
import UserSettingSidebar from "./UserSettingSidebar"
import { FaArrowLeft } from "react-icons/fa"
import { useRouter } from "next/navigation"

const Layout = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    return (
        <div className="mx-auto h-screen">
            {/* Bigger back button with inverted colors */}
            <button
                onClick={() => router.push("/home")}
                className="absolute left-20 top-4 bg-white text-indigo-400 hover:text-indigo-600 text-sm flex items-center justify-center w-10 h-10 rounded-full border-2 border-indigo-400 hover:border-indigo-600 shadow-md hover:shadow-lg transition-all"
            >
                <FaArrowLeft className="text-xl" />
            </button>
            
            <div className="flex h-full shadow rounded-lg">
                {!loading ? (
                    <>
                        <div className="w-[80%] mx-auto flex">
                            <div className="w-[250px] bg-gray-100">
                                <UserSettingSidebar />
                            </div>
                            <div className="flex-1 bg-gray-50 overflow-y-scroll scrollbar-none">
                                {children}
                            </div>
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