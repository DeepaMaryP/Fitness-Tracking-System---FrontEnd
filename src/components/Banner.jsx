import React from 'react'
import HealthBanner from '../assets/HealthBanner.jpg'

function Banner() {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-blue-200'>
            <div className='col-span-1'>
                <img src={HealthBanner} alt="" className='' />
            </div>
            <div className='lg:col-span-2 p-5 m-5 lg:p-0 lg:m-0 text-4xl sm:text-5xl md:text-7xl flex items-center justify-center'>
                Your Personal Fitness Dashboard
            </div>
        </div>
    )
}

export default Banner
