import React, { useState } from 'react'
import Testimonial1 from '../assets/Testimonial1.jpg'
import Testimonial2 from '../assets/Testimonial2.jpg'
import Testimonial3 from '../assets/Testimonial3.jpg'

function Testimonials() {

    const samples = [
        {
            id: "0",
            description: "This app completely changed the way I track my workouts and meals. The trainer support keeps me motivated every single day!",
            name: "Rahul Mehta, Marketing Manager (1 year experience with the app)",
            photo: Testimonial1
        },
        {
            id: "1",
            description: "The personalized workout plans and diet tracking have made fitness simple and enjoyable. Highly recommend to anyone serious about health!",
            name: "Priya Nair, College Student (8 months experience with the app)",
            photo: Testimonial2
        },
        {
            id: "2",
            description: "I love the progress analytics. It’s so easy to see how far I’ve come, and the reminders keep me consistent with my fitness goals.",
            name: "Anand Sharma, Software Engineer (6 months experience with the app)",
            photo: Testimonial3
        }
    ]

    const [current, setCurrent] = useState(0);

    const prevSlide = () => {
        setCurrent(current === 0 ? samples.length - 1 : current - 1);
    };

    const nextSlide = () => {
        setCurrent(current === samples.length - 1 ? 0 : current + 1);
    };

    return (
        <div className="relative w-11/12 mx-auto py-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-10 text-gray-800">Testimonials</h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-center items-center w-full md:w-1/2">
                    <img
                        src={samples[current].photo}
                        alt={`Photo of ${samples[current].name}`}
                        className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-lg"
                    />
                </div>

                <div className="flex flex-col justify-center items-center text-center px-4 md:w-1/2">
                    <p className="text-lg italic text-gray-700 mb-6">
                        "{samples[current].description}"
                    </p>
                    <p className="text-xl font-semibold text-gray-900">
                        {samples[current].name}
                    </p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-blue-200 hover:bg-blue-400 text-white font-bold h-10 w-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
            >
                &lt;
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-200 hover:bg-blue-400 text-white font-bold h-10 w-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
            >
                &gt;
            </button>
        </div>
    )
}

export default Testimonials
