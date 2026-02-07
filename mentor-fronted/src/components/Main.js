import React from "react";
import Button from "./Btncomponent";
import { Link } from "react-router-dom";
import { FaArrowRight, FaLightbulb, FaHeart, FaRocket, FaBrain, FaChartLine, FaLaptopCode, FaUsers, FaMedal } from "react-icons/fa";

function Main() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-20">
      <div className="bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 rounded-[3rem] p-10 md:p-20 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-xl border border-white dark:border-neutral-800 transition-colors duration-300">

        {/* Decorative Background Blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl mix-blend-multiply filter opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl mix-blend-multiply filter opacity-50 animate-blob animation-delay-4000"></div>

        {/* Text Content */}
        <div className="md:w-1/2 z-10 text-center md:text-left order-2 md:order-1">
          <span className="text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase text-sm mb-2 block">
            Knowledge Hub
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
            Unlock the secrets of a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">successful life.</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-8">
            Access our curated library of articles, guides, and mentorship stories.
            Whether you're looking for career advice, personal growth tips, or technical skills, explore a universe of knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/blogs">
              <Button variant="primary" className="px-8 py-3 text-lg group">
                Start Reading <FaArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Bubble Cloud */}
        <div className="md:w-1/2 w-full h-[400px] relative z-10 order-1 md:order-2 flex items-center justify-center">

          {/* Center Core */}
          <div className="absolute bg-white dark:bg-neutral-800 p-6 rounded-full shadow-xl border border-neutral-100 dark:border-neutral-700 flex flex-col items-center justify-center z-20 animate-pulse">
            <FaBrain className="text-4xl text-primary-500 mb-2" />
            <span className="font-bold text-neutral-800 dark:text-neutral-200">Knowledge</span>
          </div>

          {/* Orbiting Bubbles - Hidden on mobile */}
          <div className="hidden md:flex absolute top-10 left-10 md:top-20 md:left-10 bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 items-center gap-3 animate-bounce duration-[3000ms]">
            <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 rounded-full"><FaLightbulb /></div>
            <span className="font-bold text-neutral-700 dark:text-neutral-300">Mindset</span>
          </div>

          <div className="hidden md:flex absolute bottom-20 right-10 bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 items-center gap-3 animate-bounce duration-[4000ms]">
            <div className="p-2 bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-full"><FaHeart /></div>
            <span className="font-bold text-neutral-700 dark:text-neutral-300">Health</span>
          </div>

          <div className="hidden md:flex absolute bottom-10 left-10 md:left-20 bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 items-center gap-3 animate-bounce duration-[3500ms]">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"><FaRocket /></div>
            <span className="font-bold text-neutral-700 dark:text-neutral-300">Growth</span>
          </div>

          <div className="hidden md:flex absolute top-10 right-10 md:right-20 bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 items-center gap-3 animate-bounce duration-[4500ms]">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"><FaChartLine /></div>
            <span className="font-bold text-neutral-700 dark:text-neutral-300">Strategy</span>
          </div>

          <div className="hidden md:flex absolute top-1/2 right-0 transform translate-x-4 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-3 rounded-2xl shadow-md border border-neutral-100 dark:border-neutral-700 items-center gap-2 animate-pulse delay-700">
            <div className="p-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"><FaLaptopCode /></div>
            <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Tech</span>
          </div>

          <div className="hidden md:flex absolute top-1/3 left-0 transform -translate-x-4 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-3 rounded-2xl shadow-md border border-neutral-100 dark:border-neutral-700 items-center gap-2 animate-pulse delay-1000">
            <div className="p-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 rounded-full"><FaUsers /></div>
            <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Community</span>
          </div>

          <div className="hidden md:flex absolute bottom-0 right-1/3 bg-white/90 dark:bg-neutral-800/90 p-3 rounded-2xl shadow-md border border-neutral-100 dark:border-neutral-700 items-center gap-2 animate-bounce duration-[5000ms]">
            <div className="p-1 bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-full"><FaMedal /></div>
            <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Success</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Main;
