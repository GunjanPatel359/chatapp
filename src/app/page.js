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

  useEffect(() => {
    // GSAP animation for random gradient movement
    const animateBackground = () => {
      const randomX = gsap.utils.random(-100, 100, 1); // Random X position (-100% to 100%)
      const randomY = gsap.utils.random(-100, 100, 1); // Random Y position (-100% to 100%)

      gsap.to(backgroundRef.current, {
        backgroundPosition: `${randomX}% ${randomY}%`,
        duration: gsap.utils.random(5, 8, 1), // Random duration between 5 and 10 seconds
        ease: "power2.inOut",
        onComplete: animateBackground, // Loop the animation
      });
    };

    // Start the animation
    animateBackground();

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
        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-white bg-[size:400%_400%] z-0"
      ></div>

      {/* Welcome message */}
      <h1 className="text-6xl font-bold text-black z-10">Welcome To ChatVerse</h1>

      {/* Button to navigate to home */}
      <button
        onClick={handleNavigateHome}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 z-10"
      >
        Go to Home
      </button>
    </div>
  );
}