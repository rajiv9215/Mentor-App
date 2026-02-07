import React from 'react';
import { FaCheck } from "react-icons/fa";
import Button from "../../../components/Btncomponent";

const CardPricing = ({ title, price, period, features, isPopular = false }) => {
  return (
    <div className={`relative flex flex-col p-8 bg-white dark:bg-neutral-900 rounded-3xl border ${isPopular ? 'border-primary-500 shadow-xl scale-105 z-10' : 'border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg'} transition-all duration-300 w-full max-w-sm`}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-400 mb-2">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-neutral-900 dark:text-white">{price}</span>
          <span className="text-neutral-400 font-medium">{period}</span>
        </div>
      </div>

      <ul className="flex-grow space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-neutral-600 dark:text-neutral-400">
            <div className={`mt-1 p-0.5 rounded-full ${isPopular ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'}`}>
              <FaCheck size={10} />
            </div>
            <span className="text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={isPopular ? "primary" : "outline"}
        className="w-full justify-center py-3"
      >
        Choose Plan
      </Button>
    </div>
  );
};

export default CardPricing;