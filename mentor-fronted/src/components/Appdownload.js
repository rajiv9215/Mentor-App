import React from 'react';
import { FaApple, FaGooglePlay, FaRocket, FaBell, FaStar } from "react-icons/fa";

function Appdownload() {
  return (
    <div className='py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 overflow-hidden transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-6'>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-[3rem] p-8 md:p-16 shadow-2xl border border-neutral-100 dark:border-neutral-700 relative overflow-hidden">

          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200/30 dark:bg-accent-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/40 rounded-full text-primary-600 dark:text-primary-400 text-sm font-bold uppercase tracking-wide mb-6">
              <FaRocket className="animate-pulse" />
              Launching Soon
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
              Take Your Mentorship
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">
                On The Go
              </span>
            </h2>

            {/* Description */}
            <p className="text-neutral-600 dark:text-neutral-300 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
              Connect with mentors anytime, anywhere. Our mobile app brings personalized guidance right to your fingertips.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaBell className="text-primary-600 dark:text-primary-400 text-xl" />
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-2">Instant Notifications</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Get real-time updates on sessions and messages</p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/40 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-accent-600 dark:text-accent-400 text-xl" />
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-2">Seamless Experience</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Native mobile design for smooth interactions</p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/40 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaRocket className="text-secondary-600 dark:text-secondary-400 text-xl" />
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-2">Always Connected</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Stay in touch with your mentors 24/7</p>
              </div>
            </div>

            {/* Email Signup */}
            <div className="max-w-md mx-auto mb-8">
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Be the first to know when we launch!</p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-full border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-lg shadow-primary-500/30">
                  Notify Me
                </button>
              </div>
            </div>

            {/* Platform Icons */}
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-3 text-neutral-400 dark:text-neutral-500">
                <FaApple size={32} />
                <div className="text-left">
                  <p className="text-xs">Download on the</p>
                  <p className="font-bold text-sm text-neutral-900 dark:text-white">App Store</p>
                </div>
              </div>

              <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-700"></div>

              <div className="flex items-center gap-3 text-neutral-400 dark:text-neutral-500">
                <FaGooglePlay size={28} />
                <div className="text-left">
                  <p className="text-xs">Get it on</p>
                  <p className="font-bold text-sm text-neutral-900 dark:text-white">Google Play</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Appdownload;
