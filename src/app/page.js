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
  const videoRef = useRef(null); // Ref for the first video element
  const videoRef2 = useRef(null); // Ref for the second video element
  const welcomeRef = useRef(null); // Ref for the Welcome to ChatVerse section
  const textRef = useRef(null); // Ref for the new text content
  const buttonRef = useRef(null); // Ref for the Get Started button

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

    // Animation for the Welcome to ChatVerse section
    gsap.fromTo(
      welcomeRef.current,
      { opacity: 0, y: 20 }, // Start state: invisible and slightly below
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" } // End state: fully visible and in position
    );
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.3 }
    );
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.4 }
    );

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

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#1e1f22] text-white">
      {/* Animated gradient background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-r from-black to-[#4e2bb7] bg-[size:200%_200%] z-0"
      ></div>

      {/* Hero Section (Welcome to ChatVerse) */}
      <div className="text-center z-10 mb-12 pt-20">
        <h1 ref={welcomeRef} className="text-5xl md:text-6xl font-bold text-white">Welcome To ChatVerse</h1>
        <button
          ref={buttonRef}
          onClick={handleNavigateHome}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          Get Started
        </button>
      </div>

      {/* Feature Section 1: Make Group Chats Fun */}
      <div className="flex flex-col md:flex-row items-center justify-center z-10 p-8">
        {/* Video Preview */}
        <div className="bg-white bg-opacity-10 rounded-2xl p-6 shadow-lg max-w-lg mr-0 md:mr-8 mb-8 md:mb-0">
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
            MAKE YOUR GROUP CHATS 
          </h1>
          <p className="text-gray-200 text-lg">
            Use custom emoji, stickers, soundboard effects and more to add your
            personality to your voice, video, or text chat. Set your avatar and
            a custom status, and write your own profile to show up in chat your
            way.
          </p>
        </div>
      </div>

      {/* Feature Section 2: Stream and Video Chat */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-center z-10 p-8">
        {/* Video Preview */}
        <div className="bg-white bg-opacity-10 rounded-2xl p-6 shadow-lg max-w-lg ml-0 md:ml-8 mb-8 md:mb-0">
          <video
            ref={videoRef2}
            className="w-full h-auto rounded-lg"
            autoPlay
            muted
            loop
            onError={(e) => console.error("Video loading error:", e)}
          >
            <source src="/chatverse-2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Promotional Text */}
        <div className="text-center md:text-left max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            STREAM AND VIDEO CHAT EASILY
          </h1>
          <p className="text-gray-200 text-lg">
            Share your screen, stream your favorite parts of life, or video chat with friends in high quality. ChatVerse makes it simple to stay connected.
          </p>
        </div>
      </div>

      {/* Feature Section 3: Create Communities */}
      <div className="flex flex-col md:flex-row items-center justify-center z-10 p-8">
      {/* Image (replacing the placeholder) */}
      <div className="bg-white bg-opacity-10 rounded-2xl p-6 shadow-lg max-w-lg mr-0 md:mr-8 mb-8 md:mb-0">
        <img
          src="/welcome.png" // Replace with your actual image path
          alt="welcome chatverse"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Promotional Text */}
      <div className="text-center md:text-left max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          CREATE YOUR OWN COMMUNITIES
        </h1>
        <p className="text-gray-200 text-lg">
          Build servers, create channels, and invite friends to join your community. ChatVerse gives you the tools to bring people together.
        </p>
      </div>
    </div>

      {/* Footer Section */}
      <footer className="z-10 from-black to-[#4e2bb7] bg-[size:200%_200%]  p-8 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-white">ChatVerse</h2>
            <p className="text-gray-400">Your space to connect, create, and chat—seamlessly and beautifully.</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleScrollToTop}
              className="text-gray-400 hover:text-white transition duration-300"
            >
              About
            </button>
            <button
              onClick={handleScrollToTop}
              className="text-gray-400 hover:text-white transition duration-300"
            >
              Support
            </button>
            <button
              onClick={handleScrollToTop}
              className="text-gray-400 hover:text-white transition duration-300"
            >
              Terms
            </button>
            <button
              onClick={handleScrollToTop}
              className="text-gray-400 hover:text-white transition duration-300"
            >
              Privacy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}