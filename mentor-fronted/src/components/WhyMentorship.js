import React from 'react';
import { FaUserGraduate, FaHandshake, FaGlobeAsia, FaLightbulb } from "react-icons/fa";

const STATS = [
    { label: "Active Mentors", value: "500+", icon: <FaUserGraduate /> },
    { label: "Sessions Completed", value: "10k+", icon: <FaHandshake /> },
    { label: "Countries Reached", value: "25+", icon: <FaGlobeAsia /> },
    { label: "Career Swapped", value: "95%", icon: <FaLightbulb /> },
];

const WhyMentorship = () => {
    return (
        <section className="py-20 bg-neutral-900 dark:bg-black text-white relative overflow-hidden transition-colors duration-300">

            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Left: Text Content */}
                    <div className="lg:w-1/2">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary-900/50 border border-primary-700 text-primary-300 text-xs font-bold uppercase tracking-wider mb-6">
                            Our Mission
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Talent is universal,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Opportunity is not.</span>
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                            We started this journey because we believe advice shouldn't be a privilege.
                            Whether you're a student in a remote town or a professional looking to pivot,
                            the right guidance can change your trajectory forever.
                        </p>
                        <div className="pl-6 border-l-4 border-primary-500">
                            <p className="text-xl italic text-neutral-300">
                                "Mentorship is the shortcut to experience. It turns decades into days."
                            </p>
                        </div>
                    </div>

                    {/* Right: Stats Grid */}
                    <div className="lg:w-1/2 w-full">
                        <div className="grid grid-cols-2 gap-6">
                            {STATS.map((stat, index) => (
                                <div key={index} className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 p-6 rounded-2xl hover:bg-neutral-800 transition-colors group">
                                    <div className="text-primary-400 text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">
                                        {stat.icon}
                                    </div>
                                    <h3 className="text-4xl font-bold text-white mb-1">{stat.value}</h3>
                                    <p className="text-neutral-500 font-medium text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WhyMentorship;
