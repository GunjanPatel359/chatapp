"use client"
import { getCategoryData, updateCategory } from "@/actions/category";
import { toast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const OverviewComponent = () => {
  const params = useParams()
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCatedata = async () => {
      try {
        const res = await getCategoryData(params.categoryId)
        if (res.success) {
          setCategoryName(res.category.name)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchCatedata()
  })

  const handleSave = async () => {
    try {
      const res = await updateCategory(params.categoryId, { name: categoryName })
      if (res.success) {
        toast({
          title: "Category Updated",
          description: "Category updated successfully",
          variant: "success"
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      })
    }
    console.log("Saved category name:", categoryName);
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-indigo-600 text-lg font-semibold mb-4">Overview</h2>
      <p className="text-indigo-500 text-sm font-medium mt-2">CATEGORY NAME</p>
      <input
        type="text"
        className="bg-white border border-gray-300 p-2 rounded mt-2 text-indigo-600 w-full"
        placeholder="Enter category name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default OverviewComponent;