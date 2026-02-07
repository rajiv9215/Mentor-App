import React from 'react';
import Button from "../../components/Btncomponent";

const ContactPage = () => {
  return (
    <div className="min-h-screen pb-20 pt-4 px-4 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center transition-colors duration-300">
      <div className="max-w-6xl w-full bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-neutral-100 dark:border-neutral-800">

        {/* Left Side: Image/Info - Hidden on mobile */}
        <div className="hidden md:flex md:w-1/2 bg-primary-50 dark:bg-neutral-800 p-8 lg:p-12 flex-col justify-center items-center text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">Get in Touch</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
            Have questions about our mentorship programs? We're here to help you finding the right path.
          </p>
          <img src={contact} alt="Contact Us" className="w-full max-w-sm lg:max-w-md object-contain mix-blend-multiply dark:mix-blend-normal" />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-16">
          <form className="flex flex-col space-y-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2" htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2" htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="How can we help you?"
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <Button variant="primary" type="submit" className="w-full py-4 text-lg">
              Send Message
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;