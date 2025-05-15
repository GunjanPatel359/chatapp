
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

import { FaHashtag } from "react-icons/fa6";
import { HiSpeakerWave } from "react-icons/hi2";

import { createChannel } from "@/actions/channel";

export const CreateChannelModal = ({ children,categoryId, categoryName, serverId, setReload }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [typed, setTyped] = useState("TEXT"); // Default to TEXT channel

  const handleCreateChannel = async () => {
    if (!name.trim() || !description.trim()) {
      return toast({
        title: "Alert",
        description: "name and description is required",
        variant: "destructive"
      })
    };

    try {
        console.log(typed)
      const res=await createChannel(serverId,categoryId,{ name, description, type:typed });
      if(res.success){
          setName("");
          setDescription("");
          setTyped("TEXT");
        toast({
            title: "Channel created successfully",
            description: "Your new channel has been created",
            variant:"success"
        })
        setReload(Date.now())
      }else{
        toast({
            title: "Error creating channel",
            description: res.message,
            variant:"destructive"
        })
      }
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create Channel</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            The channel will be created under <span className="font-semibold underline">{categoryName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Channel Name */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">Channel Name</Label>
            <Input
              id="name"
              placeholder="Enter channel name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Channel Description */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none min-h-8"
            />
          </div>

          {/* Channel Type Selection */}
          <div className="grid gap-2">
            <Label htmlFor="type" className="text-sm font-medium">Channel Type</Label>
            <Select value={typed} onValueChange={setTyped}>
              <SelectTrigger>
                <SelectValue placeholder="Select channel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT"><FaHashtag size={15} className="inline my-auto"/> TEXT</SelectItem>
                <SelectItem value="VOICE"><HiSpeakerWave size={15} className="inline mr-1 my-auto" />VOICE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleCreateChannel} className="w-full">
            Create Channel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

