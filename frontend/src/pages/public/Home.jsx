import React from 'react'
import Hero from '../../components/home/Hero'
import NewsletterSignup from '../../components/home/NewsletterSignup'
import { useEffect } from 'react'
import CategoriesSection from '../../components/home/CategoriesSection'

const HomePage = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Hero/>

      <CategoriesSection/>
      <NewsletterSignup/>
    </div>
  )
}

export default HomePage
