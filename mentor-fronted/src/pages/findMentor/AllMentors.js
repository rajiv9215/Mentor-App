import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaMagic } from "react-icons/fa";
import Topmentorbox from '../../components/Topmentorbox';
import Button from "../../components/Btncomponent";
import mentorService from '../../services/mentorService';

const CATEGORIES = ["All", "Digital Marketing", "Web Developer", "UI Designer", "IT Security", "Data Science", "IIT-JEE", "NEET"];

const AllMentors = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch mentors from backend
    useEffect(() => {
        fetchMentors();
    }, [activeCategory, searchQuery]);

    const fetchMentors = async () => {
        try {
            setLoading(true);
            setError(null);

            const filters = {
                search: searchQuery,
                category: activeCategory
            };

            const response = await mentorService.getAllMentors(filters);

            if (response.success) {
                setMentors(response.data);
            }
        } catch (err) {
            console.error('Error fetching mentors:', err);
            setError(err.message || 'Failed to load mentors');
        } finally {
            setLoading(false);
        }
    };

    // Map mentor data to match Topmentorbox component props
    const getMentorDisplayData = (mentor) => ({
        name: mentor.name,
        role: mentor.jobTitle || mentor.category,
        company: mentor.company,
        category: mentor.category,
        bg: getBgColor(mentor.category)
    });

    const getBgColor = (category) => {
        const colors = {
            "Digital Marketing": "bg-blue-100",
            "UI Designer": "bg-pink-100",
            "Web Developer": "bg-red-100",
            "Management": "bg-green-100",
            "Data Science": "bg-yellow-100",
            "IT Security": "bg-gray-100",
            "IIT-JEE": "bg-purple-100",
            "NEET": "bg-teal-100"
        };
        return colors[category] || "bg-indigo-100";
    };

    return (
        <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pt-12 pb-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">

                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                        Find your perfect <span className="text-primary-600 dark:text-primary-400">Mentor</span>
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg mb-8">
                        Browse through our network of expert mentors from top companies and institutes.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative mb-6">
                        <input
                            type="text"
                            placeholder="Search by name, role, or company..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-neutral-400"
                        />
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    </div>

                    {/* AI Match CTA */}
                    <Link to="/match">
                        <div className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 bg-primary-50 dark:bg-primary-900/30 px-4 py-2 rounded-full cursor-pointer transition-colors border border-primary-100 dark:border-primary-800">
                            <FaMagic /> Not sure? Let AI match you with a mentor
                        </div>
                    </Link>
                </div>

                {/* Filter Pills */}
                <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar justify-start md:justify-center mb-10">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300 text-sm ${activeCategory === cat
                                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                                : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        <p className="text-neutral-400 mt-4">Loading mentors...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-20">
                        <p className="text-red-500 text-xl font-bold mb-4">{error}</p>
                        <button
                            onClick={fetchMentors}
                            className="text-primary-600 hover:underline font-bold"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && !error && mentors.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {mentors.map((mentor) => (
                            <Link to={`/mentor/${mentor._id}`} key={mentor._id} className="block h-full group">
                                <Topmentorbox {...getMentorDisplayData(mentor)} />
                            </Link>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && mentors.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-neutral-400 text-xl font-bold">No mentors found matching your criteria.</p>
                        <button
                            onClick={() => { setActiveCategory("All"); setSearchQuery("") }}
                            className="text-primary-600 mt-2 hover:underline font-bold"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AllMentors;
