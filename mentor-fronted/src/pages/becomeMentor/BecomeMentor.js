import React, { useState } from 'react';
import Button from '../../components/Btncomponent';
import { FaUsers, FaMoneyBillWave, FaClock, FaGraduationCap, FaCheckCircle, FaRocket } from 'react-icons/fa';
import mentorService from '../../services/mentorService';

const BecomeMentor = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        expertise: '',
        experience: '',
        linkedin: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await mentorService.applyAsMentor(formData);

            if (response.success) {
                setSuccess(true);
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    expertise: '',
                    experience: '',
                    linkedin: '',
                    message: ''
                });

                // Scroll to top to show success message
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            console.error('Application error:', err);
            setError(err.message || 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        { icon: <FaMoneyBillWave />, title: 'Earn Extra Income', description: 'Set your own rates and earn money sharing your expertise' },
        { icon: <FaClock />, title: 'Flexible Schedule', description: 'Work on your own time, whenever and wherever you want' },
        { icon: <FaUsers />, title: 'Build Your Network', description: 'Connect with ambitious professionals and expand your network' },
        { icon: <FaGraduationCap />, title: 'Share Knowledge', description: 'Make a real impact by helping others achieve their goals' }
    ];

    const requirements = [
        '3+ years of professional experience in your field',
        'Strong communication and teaching skills',
        'Passion for helping others grow',
        'Available for at least 5 hours per week',
        'Professional LinkedIn profile'
    ];

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20 transition-colors duration-300">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-neutral-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Become a Mentor
                    </h1>
                    <p className="text-xl md:text-2xl text-primary-100 dark:text-neutral-300 max-w-3xl mx-auto mb-8">
                        Share your expertise, inspire the next generation, and earn money doing what you love
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#apply">
                            <Button variant="outline" className="bg-white text-primary-600 hover:bg-primary-50 border-white px-8 py-3 text-lg">
                                Apply Now
                            </Button>
                        </a>
                        <a href="#benefits">
                            <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
                                Learn More
                            </Button>
                        </a>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div id="benefits" className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                        Why Become a Mentor?
                    </h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Join our community of expert mentors and make a difference while growing your career
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-center hover:shadow-lg transition-all">
                            <div className="text-4xl text-primary-600 dark:text-primary-400 mb-4 flex justify-center">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Requirements Section */}
            <div className="bg-white dark:bg-neutral-900 py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                            Mentor Requirements
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400">
                            We're looking for experienced professionals who are passionate about teaching
                        </p>
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-8">
                        <ul className="space-y-4">
                            {requirements.map((req, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <FaCheckCircle className="text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" size={20} />
                                    <span className="text-neutral-700 dark:text-neutral-300 text-lg">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Application Form */}
            <div id="apply" className="max-w-4xl mx-auto px-6 py-20">
                <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl p-8 md:p-12 border border-neutral-100 dark:border-neutral-800">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/40 rounded-full mb-4">
                            <FaRocket className="text-primary-600 dark:text-primary-400 text-2xl" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                            Apply to Become a Mentor
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Fill out the form below and we'll get back to you within 48 hours
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-4 rounded-xl mb-6">
                            <div className="flex items-center gap-2">
                                <FaCheckCircle className="text-xl" />
                                <div>
                                    <p className="font-bold">Application Submitted Successfully!</p>
                                    <p className="text-sm">We'll review your application and get back to you within 48 hours.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6">
                            <p className="font-bold">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                                Area of Expertise *
                            </label>
                            <input
                                type="text"
                                name="expertise"
                                value={formData.expertise}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="e.g., Digital Marketing, Software Engineering, Product Management"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                                Years of Experience *
                            </label>
                            <select
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            >
                                <option value="">Select experience level</option>
                                <option value="3-5">3-5 years</option>
                                <option value="5-10">5-10 years</option>
                                <option value="10+">10+ years</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                                LinkedIn Profile URL
                            </label>
                            <input
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                                Why do you want to become a mentor? *
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                                placeholder="Tell us about your motivation and what you hope to achieve as a mentor..."
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                variant="primary"
                                className="w-full py-4 text-lg"
                                disabled={loading}
                            >
                                {loading ? 'Submitting Application...' : 'Submit Application'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BecomeMentor;
