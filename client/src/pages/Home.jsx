import React from 'react';
import Hero from '../components/hero.jsx';
import FeaturedSection from '../components/FeaturedSection.jsx';
import Banner from '../components/Banner';
import Testimonial from '../components/Testimonial';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedSection/>
      <Banner/>
      <Testimonial/>
      <Newsletter/>
    </>
  );
};

export default Home; // ✅ Required
