import React from 'react';
import { FaArrowRight, FaCalendarAlt, FaUser } from "react-icons/fa";

const BlogCard = ({
  title,
  description,
  image,
  date = "Oct 24, 2024",
  author = "Mentor Team",
  category = "Growth",
  link = "#"
}) => {
  return (
    <div className='group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col'>
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
          {category}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-neutral-400 mb-3">
          <div className="flex items-center gap-1">
            <FaCalendarAlt />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaUser />
            <span>{author}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h2>

        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
          {description}
        </p>

        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-auto">
          <a href={link} className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 group-hover:gap-3 transition-all">
            Read Article <FaArrowRight />
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
