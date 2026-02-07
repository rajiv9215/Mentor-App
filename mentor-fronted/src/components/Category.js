import React from 'react';
import CategoryBox from './CategoryBox';

const MOCK_DATA = [
  { title: "Digital Marketing Expert", count: "120" },
  { title: "Cyber Security Analyst", count: "85" },
  { title: "Full Stack Developer", count: "240" },
  { title: "UI/UX Designer", count: "180" },
  { title: "Physics Professor", count: "60" },
  { title: "Biology Expert", count: "90" },
];

function Category() {
  return (
    <div className='py-20 bg-white dark:bg-neutral-900 relative transition-colors duration-300'>
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-neutral-50 dark:from-neutral-900/50 to-transparent pointer-events-none" />

      <div className='max-w-7xl mx-auto px-6 relative z-10'>
        <div className="text-center mb-16">
          <span className="text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase text-sm">Discover</span>
          <h2 className='text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mt-2'>Explore by Category</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
            Find the perfect mentor from our diverse range of expertises to help you achieve your goals.
          </p>
        </div>

        {/* Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {MOCK_DATA.map((item, index) => (
            <CategoryBox key={index} title={item.title} count={item.count} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Category;
