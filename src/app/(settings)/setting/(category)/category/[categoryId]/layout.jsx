"use client";
import { useState } from "react";
import CategorySettingSidebar from "./CategorySettingSidebar"

const CategorySettingLayout = ({ children }) => {
const [loading, setLoading] = useState(false);
  return (
        <div className="bg-white lg:w-[980px] mx-auto h-screen py-4">
          <div className="flex h-full shadow rounded-lg">
            {!loading?(
                <>
                <div className="w-[250px] bg-gray-100 rounded-s-lg">
                  <CategorySettingSidebar/>
                </div>
                <div className="flex-1 bg-gray-200 rounded-e-lg overflow-scroll scrollbar-none">{children}</div>
                </>
            ):(
        <div>
            Loading
        </div>
            )}
          </div>
        </div>
  );
};

export default CategorySettingLayout;
