import React from 'react';

function Button({ children, variant = 'primary', className = '', onClick }) {
  const baseStyles = "px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-primary-500/30",
    secondary: "bg-secondary-400 text-neutral-900 hover:bg-secondary-300 shadow-secondary-400/30",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20",
    ghost: "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800",
    white: "bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-lg"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
