import React from "react";
import { FaUserPlus, FaHandshake, FaChartLine } from "react-icons/fa";

function InitiateBox({ title, paragraph }) {
  // Determine icon based on title (simple logic for now, could be prop-driven in future)
  let Icon = FaUserPlus;
  if (title.toLowerCase().includes("collaborate")) Icon = FaHandshake;
  if (title.toLowerCase().includes("improve")) Icon = FaChartLine;

  return (
    <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-100 dark:border-neutral-800 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl w-full max-w-sm">
      <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6 text-2xl">
        <Icon />
      </div>
      <h3 className="font-bold text-xl text-neutral-900 dark:text-white mb-4">{title}</h3>
      <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
        {paragraph}
      </p>
    </div>
  );
}

export default InitiateBox;
