import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createCategory } from "@/actions/category.js";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const CreateCategoryModal = ({ children, serverId }) => {
  const [name, setName] = useState("");

  const handleCreateCategory = async () => {
    if (!name.trim()) return; // Prevent empty submissions
    try {
      const res=await createCategory(serverId, { name });
      if(res.success){
        toast({
          title: "Category created successfully",
          description: "Your new category has been created",
          variant:"success"
        })
        setName(""); // Clear input after creation
      }else{
        toast({
          title: "Error creating category",
          description: res.message,
          variant:"destructive"
        })
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create Category</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add a new category to your server
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Category Name
            </Label>
            <Input
              id="name"
              placeholder="Enter category name"
              className="w-full uppercase"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={handleCreateCategory} className="w-full">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
