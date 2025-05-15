
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createInvite } from "@/actions/invite";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { CopyIcon } from "lucide-react";
import { serverLink } from "@/server";

export const CreateInviteModal = ({ children, setReload }) => {
  const params = useParams();
  const [expireAfter, setExpireAfter] = useState("7d");
  const [maxUses, setMaxUses] = useState("no-limit");
  const [generatedInviteLink, setGeneratedInviteLink] = useState("");

  const handleGenerateLink = async () => {
    try {
      const res = await createInvite(params?.serverId, expireAfter, maxUses);
      if (res.success) {
        const link = `${serverLink}/invite/${res.invite?.inviteString}`;
        setGeneratedInviteLink(link);
        toast({
          title: "Invite created",
          description: "You can now copy the invite link",
        });
        setReload(Date.now())
      } else {
        toast({
          title: "Failed to create invite",
          description: res.message,
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to generate invite link",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedInviteLink);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white text-black rounded-xl shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Server Invite Link</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {generatedInviteLink
              ? "Share this invite link with others"
              : "Customize your invite link before generating it"}
          </DialogDescription>
        </DialogHeader>

        {generatedInviteLink ? (
          <div className="space-y-4">
            <Input readOnly value={generatedInviteLink} className="font-mono text-sm" />
            <Button onClick={handleCopy} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <CopyIcon size={16} />
              Copy Invite Link
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Expire After */}
            <div className="space-y-2">
              <Label htmlFor="expire-after" className="block text-sm font-medium">
                Expire After
              </Label>
              <Select value={expireAfter} onValueChange={setExpireAfter}>
                <SelectTrigger className="w-full bg-gray-100">
                  <SelectValue placeholder="Select expiry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="6h">6 hours</SelectItem>
                  <SelectItem value="12h">12 hours</SelectItem>
                  <SelectItem value="1d">1 day</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Max Uses */}
            <div className="space-y-2">
              <Label htmlFor="max-uses" className="block text-sm font-medium">
                Max Number Of Uses
              </Label>
              <Select value={maxUses} onValueChange={setMaxUses}>
                <SelectTrigger className="w-full bg-gray-100">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-limit">No limit</SelectItem>
                  <SelectItem value="1">1 use</SelectItem>
                  <SelectItem value="5">5 uses</SelectItem>
                  <SelectItem value="10">10 uses</SelectItem>
                  <SelectItem value="25">25 uses</SelectItem>
                  <SelectItem value="50">50 uses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4 flex justify-between">
          {!generatedInviteLink ? (
            <>
              <Button variant="ghost" className="text-gray-600">
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleGenerateLink}>
                Generate a New Link
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setGeneratedInviteLink("")}>
              Generate Another
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
