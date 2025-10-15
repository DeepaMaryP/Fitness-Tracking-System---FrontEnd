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
      <div id="banner">
        <Banner />
      </div>

      <div id="features">
        <Features />
      </div>

      <div id="testimonials">
        <Testimonials />
      </div>

      <div>
        <Footer />
      </div>

    </div>
  )
}

export default Home
