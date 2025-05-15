"use client";
import { useEffect, useState } from "react";
import CategorySettingSidebar from "./CategorySettingSidebar";
import { basicCategoryDetails } from "@/actions/category";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const CategorySettingLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [serverId, setServerId] = useState(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const initiateName = async () => {
      try {
        const res = await basicCategoryDetails(params.categoryId);
        console.log("API Response:", res); // Debug log
        
        if (res?.success) {
          setCategory(res.category);
          // Check where serverId actually exists in the response
          const id = res.category?.serverId || res.category?.server?.id;
          if (id) {
            setServerId(id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading category:", error);
        router.push("/home"); // Fallback on error
      }
    };
    initiateName();
  }, [params.categoryId]);

  const handleBack = () => {
    if (serverId) {
      router.push(`/server/${serverId}`);
    } else {
      console.warn("No serverId available, redirecting to home");
      router.push("/home");
    }
  };

  return (
    <div className="h-screen">
      {/* Back button container */}
      <div className="lg:w-[1040px] mx-auto relative">
        <button
          onClick={handleBack}
          className="absolute left-0 top-8 -translate-x-full bg-white text-indigo-400 hover:text-indigo-600 text-sm flex items-center justify-center w-10 h-10 rounded-full border-2 border-indigo-400 hover:border-indigo-600 shadow-md hover:shadow-lg transition-all"
        >
          <FaArrowLeft className="text-xl" />
        </button>
      </div>

      {/* Main content container */}
      <div className="bg-white lg:w-[980px] mx-auto h-full py-4">
        <div className="flex h-full shadow rounded-lg">
          {!loading ? (
            <>
              <div className="w-[250px] bg-gray-100 rounded-s-lg">
                <CategorySettingSidebar category={category} />
              </div>
              <div className="flex-1 bg-gray-200 rounded-e-lg overflow-scroll scrollbar-none">
                {children}
              </div>
            </>
          ) : (
            <div>Loading</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySettingLayout;