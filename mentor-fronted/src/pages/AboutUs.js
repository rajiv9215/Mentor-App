import React from 'react';
import { FaRocket, FaUsers, FaHeart, FaLightbulb, FaHandshake, FaTrophy } from 'react-icons/fa';
import Button from '../components/Btncomponent';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    const stats = [
        { number: '10,000+', label: 'Active Users' },
        { number: '500+', label: 'Expert Mentors' },
        { number: '50,000+', label: 'Sessions Completed' },
        { number: '95%', label: 'Satisfaction Rate' }
    ];

    const values = [
        {
            icon: <FaLightbulb className="text-4xl text-yellow-500" />,
            title: 'Innovation',
            description: 'We constantly evolve our platform to provide the best mentorship experience.'
        },
        {
            icon: <FaHeart className="text-4xl text-red-500" />,
            title: 'Passion',
            description: 'We are passionate about connecting learners with the right mentors.'
        },
        {
            icon: <FaHandshake className="text-4xl text-blue-500" />,
            title: 'Trust',
            description: 'Building trust between mentors and mentees is at our core.'
        },
        {
            icon: <FaTrophy className="text-4xl text-green-500" />,
            title: 'Excellence',
            description: 'We strive for excellence in every interaction and outcome.'
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-6">About MentorHub</h1>
                    <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                        Empowering growth through meaningful mentorship connections. We bridge the gap between aspiring learners and experienced professionals.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-6">Our Mission</h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4">
                            At MentorHub, we believe that everyone deserves access to quality mentorship. Our mission is to democratize learning by connecting passionate individuals with experienced mentors who can guide them on their journey.
                        </p>
                        <p className="text-lg text-neutral-600 dark:text-neutral-300">
                            Whether you're looking to advance your career, learn a new skill, or prepare for competitive exams, we provide a platform where knowledge meets opportunity.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="bg-primary-100 dark:bg-primary-900/30 rounded-2xl p-8 text-center">
                            <FaRocket className="text-8xl text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Accelerate Your Growth</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">Learn from the best, achieve your goals faster</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white dark:bg-neutral-900 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">{stat.number}</div>
                                <div className="text-neutral-600 dark:text-neutral-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-4xl font-bold text-center text-neutral-900 dark:text-white mb-12">Our Core Values</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <div key={index} className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all text-center">
                            <div className="mb-4 flex justify-center">{value.icon}</div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">{value.title}</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-neutral-100 dark:bg-neutral-900 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-neutral-900 dark:text-white mb-6">Why Choose Us?</h2>
                    <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12 max-w-3xl mx-auto">
                        We're not just a platform—we're a community dedicated to fostering growth, learning, and success.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl">
                            <FaUsers className="text-5xl text-primary-600 mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Verified Mentors</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">All our mentors are carefully vetted professionals with proven expertise in their fields.</p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl">
                            <FaLightbulb className="text-5xl text-yellow-500 mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Flexible Learning</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">Choose from chat, call, or video sessions that fit your schedule and learning style.</p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl">
                            <FaTrophy className="text-5xl text-green-500 mb-4" />
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Proven Results</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">Join thousands of successful learners who've achieved their goals with our mentors.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-6">Ready to Start Your Journey?</h2>
                <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
                    Connect with expert mentors today and take the first step towards achieving your goals.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link to="/find-mentor">
                        <Button variant="primary" className="text-lg px-8 py-3">Find a Mentor</Button>
                    </Link>
                    <Link to="/become-mentor">
                        <Button variant="outline" className="text-lg px-8 py-3">Become a Mentor</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
