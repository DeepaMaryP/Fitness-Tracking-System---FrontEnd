import React from 'react'
import Banner from '../components/Banner'
import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Home() {
  return (
    <div>
    <Header />
      <div>      
      <Banner />
      </div>
      <Features />
      <Testimonials />
      <Footer/>
    </div>
  )
}

export default Home
