import React, { useState } from 'react';

const CATEGORIES = [
  "All Topics",
  "Mentorship",
  "Career Growth",
  "Interview Prep",
  "Productivity",
  "Technology",
  "Leadership",
  "Startups",
  "Student Life",
  "Success Stories"
];

const ScrollableButtonGroup = () => {
  const [active, setActive] = useState("All Topics");

  return (
    <div className="max-w-7xl mx-auto px-6 mt-8 mb-12">
      <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${active === cat
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScrollableButtonGroup;