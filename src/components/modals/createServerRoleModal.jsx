
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {createServerRole} from "@/actions/role"
import { toast } from "@/hooks/use-toast";

export const CreateServerRoleModal=({children,serverId,setReload})=>{
  const [roleName, setRoleName] = useState("");

  const handleSubmit = async() => {
    if(!roleName.trim()){
      return toast({
        title: "enter valid name",
        variant:"destructive"
    })
    }
    try {
      const res=await createServerRole(serverId,{ name:roleName.trim()});
      if(res.success){
        setRoleName("")
        toast({
            title: "Role created successfully",
            description: "Your new Server role has been created",
            variant:"success"
        })
        setReload(Date.now())
      }else{
        toast({
            title: "Error creating role",
            description: res.message,
            variant:"destructive"
        })
      }
    } catch (error) {
      console.error("Error creating Roles:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label htmlFor="role-name">Role Name</Label>
          <Input id="role-name" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="Enter role name" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
