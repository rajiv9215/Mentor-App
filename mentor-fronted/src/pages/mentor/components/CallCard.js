import React from 'react';
import { FaVideo, FaCalendarCheck, FaPhone, FaComments } from "react-icons/fa";
import Button from "../../../components/Btncomponent";

const CallCard = ({
  title = "1:1 Mentorship Session",
  duration = "45 mins",
  price = "₹50",
  icon = "video" // video, phone, chat
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'chat':
        return <FaComments size={20} />;
      case 'phone':
        return <FaPhone size={20} />;
      case 'video':
      default:
        return <FaVideo size={20} />;
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-xl">
          {getIcon()}
        </div>
        <div>
          <h3 className="font-bold text-neutral-900 dark:text-white">{title}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{duration}</p>
        </div>
      </div>

      <div className="flex-grow mb-6">
        <ul className="text-sm text-neutral-600 dark:text-neutral-300 space-y-2">
          <li className="flex items-center gap-2">
            <FaCalendarCheck className="text-primary-500" /> Instant unlock
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div> 1-on-1 session
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div> Personalized guidance
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4">
        <span className="text-2xl font-bold text-neutral-900 dark:text-white">{price}</span>
        <Button variant="primary" size="sm">
          Unlock Now
        </Button>
      </div>
    </div>
  );
};

export default CallCard;
