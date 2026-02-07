import React from 'react';
import { Link } from 'react-router-dom';

const HeroBlog = () => {
  return (
    <div className='max-w-7xl mx-auto px-6 my-12'>
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(https://thumbs.dreamstime.com/z/mentoring-concept-illustration-mentoring-concept-illustration-idea-coaching-studying-117144897.jpg?w=992)' }}></div>
        <div className="relative z-10 p-8 md:p-16 lg:p-24">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight mb-4">
              Unlock Your Potential
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 font-medium mb-8 max-w-2xl">
              Mentorship that empowers you to succeed
            </p>
            <Link to="/blogs" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/30">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBlog
