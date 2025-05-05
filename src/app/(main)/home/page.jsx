'use client';

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
<<<<<<< HEAD
      delayChildren: 0.2,
=======
      delayChildren: 0.2
>>>>>>> 30dd673cc28b4969c29e606f48751c9e3077233f
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
<<<<<<< HEAD
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
=======
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
>>>>>>> 30dd673cc28b4969c29e606f48751c9e3077233f
};

const HomePage = () => {
  return (
<<<<<<< HEAD
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* Glowing Background */}
      <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-[80vw] max-w-[500px] h-[80vw] max-h-[500px] bg-indigo-300 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-white z-0" />
=======
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* Glowing Background */}
      <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-indigo-300 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-white z-0"></div>
>>>>>>> 30dd673cc28b4969c29e606f48751c9e3077233f

      {/* Animated Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
<<<<<<< HEAD
        className="relative z-10 bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-6 sm:p-10 max-w-sm sm:max-w-md text-center hover:shadow-2xl transition-shadow duration-300"
=======
        className="relative z-10 bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-10 max-w-md text-center hover:shadow-2xl transition-shadow duration-300"
>>>>>>> 30dd673cc28b4969c29e606f48751c9e3077233f
      >
        <motion.div
          variants={childVariants}
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-6 flex justify-center"
        >
<<<<<<< HEAD
          <img
            src="/chatverse.svg"
            alt="Chatverse Logo"
            className="w-20 h-20 sm:w-28 sm:h-28"
          />
=======
          <img src="/chatverse.svg" alt="Chatverse Logo" className="w-28 h-28" />
>>>>>>> 30dd673cc28b4969c29e606f48751c9e3077233f
        </motion.div>

        <motion.h1
          variants={childVariants}
          className="text-3xl font-bold text-indigo-500"
        >
          Welcome to Chatverse
        </motion.h1>

        <motion.p
          variants={childVariants}
          className="mt-4 text-gray-600"
        >
          Your space to connect, create, and chat — seamlessly and beautifully.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default HomePage;
