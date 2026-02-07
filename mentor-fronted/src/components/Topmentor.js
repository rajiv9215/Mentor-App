import React, { useState, useEffect } from 'react';
import Topmentorbox from './Topmentorbox';
import { Link } from 'react-router-dom';
import Button from './Btncomponent';
import mentorService from '../services/mentorService';

const CATEGORIES = [
  "All",
  "Digital Marketing",
  "IT Security",
  "Web Developer",
  "UI Designer",
  "Data Science",
  "IIT-JEE",
  "NEET"
];

function Topmentor() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMentors();
  }, [activeCategory]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        category: activeCategory
      };

      const response = await mentorService.getAllMentors(filters);

      if (response.success) {
        setMentors(response.data);
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError('Failed to load mentors');
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
    <div className='py-20 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div className='text-center md:text-left'>
            <span className="text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase text-sm">Expertise</span>
            <h2 className='text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mt-2'>Top Rated Mentors</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-xl">
              Learn from the best in the industry. Our mentors are experienced professionals ready to guide you.
            </p>
          </div>
          <Link to="/find-mentor">
            <Button variant="outline" className="hidden md:block">View All Mentors</Button>
          </Link>
        </div>

        {/* Categories Filter */}
        <div className='flex overflow-x-auto pb-8 gap-3 no-scrollbar justify-start md:justify-start mb-8 flex-nowrap'>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${activeCategory === cat
                ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105"
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
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={fetchMentors}
              className="text-primary-600 hover:underline font-bold"
            >
              Try again
            </button>
          </div>
        )}

        {/* Mentors Grid */}
        {!loading && !error && mentors.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
            {mentors.slice(0, 8).map((mentor) => (
              <Link to={`/mentor/${mentor._id}`} key={mentor._id} className="block h-full">
                <Topmentorbox {...getMentorDisplayData(mentor)} />
              </Link>
            ))}
          </div>
        )}

        {/* No Mentors */}
        {!loading && !error && mentors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">No mentors found in this category.</p>
          </div>
        )}

        <div className="text-center md:hidden">
          <Link to="/find-mentor">
            <Button variant="outline">View All Mentors</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Topmentor;
