import React from "react";

const AppTitle: React.FC = () => {
  return (
    <header className="text-center space-y-6 py-10 relative">
      <div className="flex items-center justify-center gap-3">
        <img
          src="/cold.png"
          alt="ColdConnect Icon"
          className="w-10 sm:w-12 md:w-14 lg:w-16 xl:w-20"
        />
        <h1 className="text-2xl sm:text-lg md:text-4xl lg:text-5xl xl:text-7xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 hover:from-teal-500 hover:via-indigo-500 hover:to-pink-500 transition-transform transform duration-500 ease-in-out hover:scale-105">
          Cold Connect: Cold Mail Generator
        </h1>
      </div>

      {/* Enhanced Animated Underline with Vibrant Mixture */}
      <div className="relative w-full h-1 mx-auto max-w-lg mt-2">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-pink-300 to-indigo-500 rounded-full animate-gradient-move" />
      </div>

      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 opacity-90 px-4 md:px-12 lg:px-24 leading-relaxed font-mono">
        Effortlessly create professional cold emails tailored to your job
        applications.
      </p>
    </header>
  );
};

export default AppTitle;
