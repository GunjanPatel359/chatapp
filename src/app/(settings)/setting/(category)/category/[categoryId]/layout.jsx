"use client";
import { useEffect, useState } from "react";
import CategorySettingSidebar from "./CategorySettingSidebar"

import {basicCategoryDetails} from "@/actions/category"
import { useParams } from "next/navigation";

const CategorySettingLayout = ({ children }) => {
const [loading, setLoading] = useState(true);
const [category,setCategory]=useState()
const params=useParams()

useEffect(()=>{
  const initiateName=async()=>{
    try {
      const res=await basicCategoryDetails(params.categoryId)
      if(res.success){
        setCategory(res.category)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  initiateName()
},[params.categoryId])

  return (
        <div className="bg-white lg:w-[980px] mx-auto h-screen py-4">
          <div className="flex h-full shadow rounded-lg">
            {!loading?(
                <>
                <div className="w-[250px] bg-gray-100 rounded-s-lg">
                  <CategorySettingSidebar category={category}/>
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
