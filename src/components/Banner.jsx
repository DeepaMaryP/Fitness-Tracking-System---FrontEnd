import React from 'react'
import HealthBanner from '../assets/HealthBanner.jpg'

function Banner() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-blue-200">
            {/* Image Section */}
            <div className="col-span-1">
                <img
                    src={HealthBanner}
                    alt="Health and fitness banner"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Text Section */}
            <div className="lg:col-span-2 flex items-center justify-center p-6 text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800">
                    Your Personal Fitness Dashboard
                </h1>
            </div>
        </div>
    )
}

export default Banner
