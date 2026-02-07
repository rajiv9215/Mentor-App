import React from 'react';
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const TESTIMONIALS = [
    {
        name: "Priya Sharma",
        role: "Product Designer",
        company: "Zomato",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        content: "The mentorship I received was a game-changer. My mentor helped me navigate complex design challenges and land my dream job.",
        rating: 5
    },
    {
        name: "Rahul वर्मा",
        role: "Frontend Developer",
        company: "Swiggy",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        content: "I was stuck in a tutorial hell. Connecting with a senior dev gave me the roadmap I needed to actually build projects and get hired.",
        rating: 5
    },
    {
        name: "Ananya Gupta",
        role: "Data Scientist",
        company: "Fractal",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        content: "The 1:1 sessions were incredibly valuable. We focused on real-world case studies that prepared me for my interviews.",
        rating: 5
    }
];

const TestimonialCard = ({ name, role, company, image, content, rating }) => (
    <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-100 dark:border-neutral-800 flex flex-col relative hover:-translate-y-2 transition-all duration-300">
        <div className="absolute top-8 right-8 text-primary-100 dark:text-primary-900/50 text-6xl font-serif leading-none -z-0 select-none">
            <FaQuoteLeft />
        </div>

        <div className="flex gap-1 mb-6 text-yellow-400 z-10">
            {[...Array(rating)].map((_, i) => <FaStar key={i} />)}
        </div>

        <p className="text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed z-10 font-medium italic">
            "{content}"
        </p>

        <div className="mt-auto flex items-center gap-4 z-10">
            <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-primary-100 dark:border-primary-900" />
            <div>
                <h4 className="font-bold text-neutral-900 dark:text-white">{name}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold">{role} at {company}</p>
            </div>
        </div>
    </div>
);

function Testimonials() {
    return (
        <div className="py-20 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden transition-colors duration-300">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200/20 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-200/20 dark:bg-accent-900/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase text-sm">Success Stories</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mt-2">Loved by Learners</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
                        See how our mentorship program has transformed careers and lives.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, i) => (
                        <TestimonialCard key={i} {...t} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Testimonials;
