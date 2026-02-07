import React from 'react';
import { RiTwitterXLine } from "react-icons/ri";
import { FaDiscord, FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 font-sans transition-colors duration-300'>
      <div className='max-w-7xl mx-auto grid md:grid-flow-col gap-8 py-16 px-10 md:px-20'>
        <div className='col-span-4 md:col-span-1 cursor-pointer text-4xl font-bold text-primary-600 dark:text-primary-400'>
          logo
        </div>
        <div className='col-span-4 md:col-span-1 leading-loose'>
          <ul className="text-neutral-600 dark:text-neutral-400">
            <li className='font-bold text-neutral-900 dark:text-white mb-4'>PLATFORM</li>
            <li> <Link to={"/find-mentor"} className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer'>Find a mentor</Link></li>
            <li> <Link to={"/become-mentor"} className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer'>Become a mentor</Link></li>
            <li> <Link to={"/blogs"} className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer'>Blog</Link></li>
            <li><Link to={"/about"} className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer'>About us</Link></li>
          </ul>
        </div>
        <div className='col-span-4 md:col-span-1 leading-loose'>
          <ul className="text-neutral-600 dark:text-neutral-400">
            <li className='font-bold text-neutral-900 dark:text-white mb-4'>LEGAL</li>
            <li className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer'>Terms and conditions</li>
            <li className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer'>Privacy policy</li>
            <li className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer'>Arts</li>
          </ul>
        </div>
        <div className='col-span-4 md:col-span-1 pb-10 md:pb-0'>
          <p className='font-bold text-neutral-900 dark:text-white mb-4'>Community</p>
          <div className='flex text-2xl gap-6 text-neutral-500 dark:text-neutral-400'>
            <RiTwitterXLine className='hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110 transition-all cursor-pointer' />
            <FaInstagramSquare className='hover:text-accent-500 hover:scale-110 transition-all cursor-pointer' />
            <FaLinkedin className='hover:text-primary-700 hover:scale-110 transition-all cursor-pointer' />
            <FaDiscord className='hover:text-primary-500 hover:scale-110 transition-all cursor-pointer' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
