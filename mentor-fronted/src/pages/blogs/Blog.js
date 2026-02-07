import React from 'react';
import ScrollableButtonGroup from './components/ScrollableBtn';
import SearchBar from '../../components/SearchBar';
import BlogCard from './components/BlogCard';

const BLOG_POSTS = [
  {
    title: "The Benefits of Mentorship in 2024",
    description: "Discover why having a mentor is crucial for your career growth in the rapidly evolving tech landscape. Learn how to leverage mentorship for success.",
    image: "https://media.istockphoto.com/id/1334472503/photo/indian-ceo-mentor-leader-talking-to-female-trainee-using-laptop-at-meeting.jpg?s=612x612&w=0&k=20&c=RypRc4QwkdD-ke1kY5dpBfiGpD2mQNFrXwNJj1W-wEo=",
    category: "Career",
    date: "Feb 10, 2024"
  },
  {
    title: "Mastering React: A Comprehensive Guide",
    description: "Deep dive into advanced React patterns, hooks, and performance optimization techniques used by top engineering teams.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
    category: "Tech",
    date: "Feb 08, 2024"
  },
  {
    title: "How to Ace Your System Design Interview",
    description: "Practical strategies and frameworks to tackle complex system design problems during your next big tech interview.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
    category: "Interview",
    date: "Feb 05, 2024"
  },
  {
    title: "Balancing Work and Learning",
    description: "Tips for students and professionals on effective time management and maintaining productivity while upskilling.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
    category: "Productivity",
    date: "Jan 30, 2024"
  },
  {
    title: "The Future of AI in Education",
    description: "Exploring how Artificial Intelligence is transforming personalized learning and mentorship accessibility globally.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
    category: "Trends",
    date: "Jan 25, 2024"
  },
  {
    title: "Networking 101 for Introverts",
    description: "Actionable advice for building meaningful professional connections without feeling overwhelmed or inauthentic.",
    image: "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?q=80&w=1000&auto=format&fit=crop",
    category: "Soft Skills",
    date: "Jan 20, 2024"
  }
];

const Blog = () => {
  return (
    <div className='min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20 transition-colors duration-300'>
      {/* Header Section */}
      <div className="bg-primary-600 pt-20 pb-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Insights & Resources
        </h1>
        <p className="text-primary-100 text-lg md:text-xl max-w-2xl mx-auto">
          Expert articles, guides, and tips to help you navigate your career and education journey.
        </p>
      </div>

      <div className="-mt-8">
        <SearchBar />
      </div>

      <ScrollableButtonGroup />

      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {BLOG_POSTS.map((post, index) => (
            <BlogCard key={index} {...post} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-white font-bold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
            Load More Articles
          </button>
        </div>
      </div>
    </div>
  )
}

export default Blog;
