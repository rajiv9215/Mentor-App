import React from "react";
import Button from "./Btncomponent";
import { FaArrowRight } from "react-icons/fa";

function CategoryBox({
  title = "Become a professional video editor",
  count = "140",
  variant = "default"
}) {
  return (
    <div className="group bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full min-h-[240px]">
      <div>
        <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="font-bold text-xl text-neutral-800 dark:text-white mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">
          {count} mentors availiable
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between">
        <span className="font-semibold text-primary-600 dark:text-primary-400 text-sm group-hover:underline">Explore</span>
        <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-700 flex items-center justify-center text-neutral-400 dark:text-neutral-500 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
          <FaArrowRight size={12} />
        </div>
      </div>
    </div>
  );
}

export default CategoryBox;
