import React from "react";
import Button from "./Btncomponent";
import { Link } from "react-router-dom";
import {
  FaLaptopCode, FaChartLine, FaPython, FaReact, FaFigma,
  FaGraduationCap, FaBook, FaBriefcase, FaUserTie, FaStethoscope, FaAtom
} from "react-icons/fa";

function Hero() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 pt-8 md:pt-12">
      <div className="bg-primary-50 dark:bg-neutral-900 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden transition-colors duration-300">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100 dark:bg-primary-900/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-100 dark:bg-secondary-900/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-50"></div>

        {/* Orbit Visual - Order 1 on mobile, Order 2 on desktop */}
        <div className="md:w-1/2 z-10 flex justify-center items-center h-[250px] md:h-[500px] w-full relative order-1 md:order-2">

          {/* Center Core */}
          <div className="relative z-20 w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-xl border-4 border-primary-100 dark:border-primary-900 animate-pulse">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-center p-2 shadow-inner">
              <FaUserTie className="text-2xl md:text-4xl mb-1" />
            </div>
          </div>

          {/* Inner Ring (Academic/Foundation) - Hidden on mobile */}
          <div className="hidden md:block absolute w-[280px] h-[280px] border border-dashed border-primary-200 dark:border-primary-800 rounded-full animate-[spin_12s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-md text-accent-500 dark:text-accent-400"><FaAtom size={20} /></div>
            <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-md text-primary-500 dark:text-primary-400"><FaBook size={20} /></div>
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-md text-primary-500 dark:text-primary-400"><FaStethoscope size={20} /></div>
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-md text-secondary-500 dark:text-secondary-400"><FaGraduationCap size={20} /></div>
          </div>

          {/* Outer Ring (Industry/Tech) - Hidden on mobile */}
          <div className="hidden lg:block absolute w-[450px] h-[450px] border border-primary-100 dark:border-primary-900 rounded-full animate-[spin_20s_linear_infinite_reverse]">
            {/* Mentors */}
            <img src="https://i.pravatar.cc/150?u=1" className="absolute top-10 right-20 w-14 h-14 rounded-full border-2 border-white dark:border-neutral-700 shadow-lg animate-[spin_20s_linear_infinite]" alt="Mentor" />
            <img src="https://i.pravatar.cc/150?u=4" className="absolute bottom-20 left-10 w-12 h-12 rounded-full border-2 border-white dark:border-neutral-700 shadow-lg animate-[spin_20s_linear_infinite]" alt="Mentor" />

            {/* Industry Tools */}
            <div className="absolute bottom-10 right-20 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-lg text-primary-400 dark:text-primary-300 animate-[spin_20s_linear_infinite]"><FaReact size={24} /></div>
            <div className="absolute top-20 left-10 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-lg text-primary-600 dark:text-primary-400 animate-[spin_20s_linear_infinite]"><FaBriefcase size={24} /></div>
            <div className="absolute top-1/2 right-0 translate-x-1/2 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-lg text-secondary-500 dark:text-secondary-400 animate-[spin_20s_linear_infinite]"><FaPython size={24} /></div>

            {/* Floating Badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-800 px-3 py-1 rounded-full shadow-lg border border-neutral-100 dark:border-neutral-700 flex items-center gap-1 animate-[spin_20s_linear_infinite]">
              <FaChartLine className="text-primary-500 dark:text-primary-400" /> <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Career Growth</span>
            </div>
          </div>

          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[350px] md:h-[350px] bg-primary-200/20 dark:bg-primary-900/20 rounded-full blur-[80px]"></div>

        </div>

        {/* Text Content - Order 2 on mobile, Order 1 on desktop */}
        <div className="md:w-1/2 text-center md:text-left z-10 w-full order-2 md:order-1">
          <span className="inline-block px-4 py-2 bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 rounded-full text-sm font-bold shadow-sm mb-6">
            From Classroom to Boardroom
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
            Master your Future with <br />
            <span className="text-primary-600 dark:text-primary-400">Expert Mentors.</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto md:mx-0">
            Bridging the gap between academic learning and industry success.
            Whether you're preparing for <strong>IIT-JEE/NEET</strong> or aiming for a <strong>Tech/MBA</strong> career, find the right guide today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/find-mentor">
              <Button variant="primary" className="px-8 py-3 text-lg">
                Find a Mentor
              </Button>
            </Link>
            <Link to="/about-us">
              <Button variant="outline" className="px-8 py-3 text-lg bg-white">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
