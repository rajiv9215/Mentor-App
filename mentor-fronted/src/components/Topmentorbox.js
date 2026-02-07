import React from "react";
import { FaStar } from "react-icons/fa";

function Topmentorbox({
  name = "Rajiv Ranjan",
  role = "Digital Marketer",
  company = "Google",
  rating = "4.9",
  reviews = "120",
  image = "https://imgcdn.stablediffusionweb.com/2024/4/8/e0fcdba9-057c-4abb-b08f-d2ee49e0de20.jpg"
}) {
  return (
    <div className="group bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full max-w-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <img
            className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-neutral-800 shadow-md group-hover:border-primary-500 transition-colors duration-300"
            src={image}
            alt={name}
          />
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-neutral-900 p-1 rounded-full shadow-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-white dark:border-neutral-900"></div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{name}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{role}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-1 text-yellow-400 text-sm mb-1">
          <FaStar />
          <span className="font-bold text-neutral-900 dark:text-white ml-1">{rating}</span>
          <span className="text-neutral-400 dark:text-neutral-500 font-normal">({reviews} reviews)</span>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">Ex- {company}</p>
      </div>

      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex gap-2">
        <span className="text-xs font-semibold px-2 py-1 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-md">Mentorship</span>
        <span className="text-xs font-semibold px-2 py-1 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-md">Career</span>
      </div>
    </div>
  );
}

export default Topmentorbox;
