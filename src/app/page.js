"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { addCategoryRole, addChannelRole, addMemberToServerRole, createServerRole, editServerRole, removeCategoryRole, removeChannelRole, updateCategoryRole, updateChannelRole } from "@/actions/role";
import { createCategory } from "@/actions/category";
import { inviteServer } from "@/actions/invite";
import { createChannel } from "@/actions/channel";
// import { socket } from "@/server";

export default function Home() {
  const router = useRouter();
  const backgroundRef = useRef(null);
  const videoRef = useRef(null); // Ref for the video element

  useEffect(() => {
    // Set the initial background gradient
    gsap.set(backgroundRef.current, {
      backgroundImage: "linear-gradient(135deg, black, #4e2bb7)",
      backgroundPosition: "0% 0%",
      backgroundSize: "200% 200%",
    });

    // GSAP animation for circular gradient movement
    const animateCircularGradient = () => {
      gsap.to(backgroundRef.current, {
        backgroundPosition: "100% 100%", // Move to the bottom-right corner
        duration: 5, // Animation duration
        ease: "power2.inOut",
        repeat: -1, // Loop indefinitely
        yoyo: true, // Reverse the animation
      });
    };

    // Start the circular gradient animation
    animateCircularGradient();

    // Your existing logic
    const initiatePage = async () => {
      try {
        const serverId = "cm6osb11r0001v3wwy2gln52q";
        const categoryId = "cm6osb11s0008v3ww1ltqclks";
        const channelId = "cm6osb11s0003v3ww2arswwkl";
        const serverRoleId = "cm6ovgmap0001v3fksmzhs8kb";

        // Example: Uncomment and use any of your existing functions
        // const res = await createCategory("cm6ccn9qu000wv30g49e63gbk", { name: "testing category" });
        // console.log(res);
        // const res = await createChannel(serverId, categoryId, { name: "channel 1", description: "test data" });
        // console.log(res);
        // const res = await addMemberToServerRole(serverId, "cm6cd67d40009v3u46ky19dwb", "cm6f8symz0001v3xwmvd6kwj2");
        // console.log(res);
        // const res = await addMemberToServerRole("cm5v60skj0001v34k146dluul", "cm6c81zd4000dv30gglzsw7ze", "cm5v60stk000ev34kvsoma1f7");
        // console.log(res);

        // const res = await createServerRole(serverId, { name: "teniis" });
        // console.log(res);
        // const res = await editServerRole("cm5utrqbg000av3h4rsr970ey", "cm6c81zd4000dv30gglzsw7ze", { name: "Admin", adminPermission: true });
        // console.log(res);
        // const res = await addCategoryRole("cm6ccn9qu000wv30g49e63gbk", "cm6cdmog9000dv3u4oqjhkdob", "cm6dbqr450001v33g17dxe864");
        // console.log(res);
        // const res = await updateCategoryRole(serverId, categoryId, "cm6dd0f93000bv33ga7jbgsas", { manageChannels: "ALLOW" });
        // console.log(res);
        // const res = await removeCategoryRole(serverId, categoryId, "cm6dd0f93000bv33ga7jbgsas");
        // console.log(res);

        // const res = await addChannelRole(serverId, categoryId, channelId, "cm6dbqrnt0003v33g79r3tcdp");
        // console.log(res);
        // const res = await updateChannelRole(serverId, categoryId, channelId, "cm6dfcfgi000rv33gscx3d372", { viewChannel: "ALLOW" });
        // console.log(res);
        // const res = await removeChannelRole(serverId, categoryId, channelId, "cm6dqddpj0007v3js9vehti60");
        // console.log(res);

        // const res = await createServerRole("cm5v60skj0001v34k146dluul", { name: "my rola" });
        // console.log(res);
        // const res = await createCategory("cm6ccn9qu000wv30g49e63gbk", { name: "testing cate" });
        // console.log(res);
        // const res = await inviteServer(serverId, "cm6f7mwgx0000g4qg0mzevkvx");
        // console.log(res);

        if (res) {
          toast({
            title: "Success",
            description: "Logged",
            variant: "success",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    initiatePage();
  }, []);

  // useEffect(() => {
  //   if (socket.connected) {
  //     socket.on("connection");
  //   }
  // });

  const handleNavigateHome = () => {
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-r from-black to-[#4e2bb7] bg-[size:200%_200%] z-0"
      ></div>

      {/* Welcome to ChatVerse Section */}
      <div className="text-center z-10 mb-12">
        <h1 className="text-6xl font-bold text-white">Welcome To ChatVerse</h1>
        <button
            onClick={handleNavigateHome}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            Get Started
          </button>
      </div>

      {/* Main content container */}
      <div className="flex flex-col md:flex-row items-center justify-center z-10 p-8">
        {/* Video Preview */}
        <div className="bg-white bg-opacity-10 rounded-2xl p-6 shadow-lg max-w-sm mr-0 md:mr-8 mb-8 md:mb-0">
          <video
            ref={videoRef}
            className="w-full h-auto rounded-lg"
            autoPlay
            muted
            loop
            onError={(e) => console.error("Video loading error:", e)}
          >
            <source src="/chatverse-1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Promotional Text */}
        <div className="text-center md:text-left max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            MAKE YOUR GROUP CHATS MORE FUN
          </h1>
          <p className="text-gray-200 text-lg">
            Use custom emoji, stickers, soundboard effects and more to add your
            personality to your voice, video, or text chat. Set your avatar and
            a custom status, and write your own profile to show up in chat your
            way.
          </p>
        </div>
      </div>
    </div>
  );
}