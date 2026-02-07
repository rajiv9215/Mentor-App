import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CardPricing from './components/CardPricing';

const Pricing = () => {
  return (
    <section className="pb-20 pt-12 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase text-sm">Plans & Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mt-2">
            Invest in your future
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
            Choose the perfect mentorship plan to accelerate your career growth.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <CardPricing
            title="Basic"
            price="₹99"
            period="/month"
            features={[
              '1-hour monthly mentorship session',
              'Email support',
              'Access to community forum'
            ]}
          />
          <CardPricing
            title="Premium"
            price="₹299"
            period="/month"
            isPopular={true}
            features={[
              '2-hour monthly mentorship session',
              'Priority email support',
              'Quarterly progress review',
              'Resume review'
            ]}
          />
          <CardPricing
            title="Enterprise"
            price="₹499"
            period="/month"
            features={[
              'Customized mentorship program',
              'Dedicated support team',
              'Monthly progress review',
              'Mock interviews'
            ]}
          />
        </div>

        <div className='text-center'>
          <p className="text-neutral-600 font-medium">
            Need a custom plan? <Link to={"/contact-us"} className='text-primary-600 hover:text-primary-700 hover:underline font-bold transition-colors'>Contact us</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pricing
