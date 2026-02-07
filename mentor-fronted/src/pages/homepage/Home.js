import React from "react";
import Hero from "../../components/Hero.js";
import InitiateBox from "../../components/InitiateBox.js";
// import Category from "../../components/Category.js"; // Removed for redundancy
import Topmentor from "../../components/Topmentor.js";
import Appdownload from "../../components/Appdownload.js";
import Main from "../../components/Main.js"; // Blog Promo
import Testimonials from "../../components/Testimonials.js"; // New Section
import WhyMentorship from "../../components/WhyMentorship.js"; // Mission Section

function Home() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 overflow-hidden transition-colors duration-300">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Top Mentors (Includes Category Filters now) */}
      <Topmentor />

      {/* 3. How It Works */}
      <div className="py-20 bg-white dark:bg-neutral-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase text-sm">Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mt-2">How it works?</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
              Your journey to success is just three steps away.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            <InitiateBox
              title={"Registration"}
              paragraph={"Sign up in seconds. Create your profile and tell us about your goals and interests."}
            />
            <InitiateBox
              title={"Collaborate"}
              paragraph={"Connect with mentors, schedule sessions, and collaborate on your own timing."}
            />
            <InitiateBox
              title={"Improve & Grow"}
              paragraph={"Gain new skills, receive feedback, and maybe even become a mentor yourself someday."}
            />
          </div>
        </div>
      </div>

      {/* 4. Why Mentorship (Mission) */}
      <WhyMentorship />

      {/* 5. Testimonials (Replaces Categories) */}
      <Testimonials />

      {/* 5. Blog Feature */}
      <Main />

      {/* 6. Mobile App CTA */}
      <Appdownload />
    </div>
  );
}

export default Home;
