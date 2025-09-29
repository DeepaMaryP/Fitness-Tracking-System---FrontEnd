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
        <div className="relative w-11/12 mx-auto py-8">
            <div>
                <div className="flex flex-col md:flex-row">
                    <div className=" flex justify-center items-center rounded-lg shadow-lg">
                        <img
                            src={samples[current].photo}
                            alt=""
                            className=" h-3/4"
                        />
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        <p className="text-lg md:text-lg italic text-center pt-5 pb-8">
                            "{samples[current].description}"
                        </p>
                        <p className='text-xl font-bold'>
                           {samples[current].name}
                        </p>
                    </div>

                </div>

            </div>


            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 font-bold h-12 w-12 text-blue-300 text-3xl rounded-full shadow hover:bg-blue-700"
            >
                &lt;
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2  h-12 w-12 font-bold text-blue-300 text-3xl rounded-full shadow hover:bg-blue-700"
            >
                &gt;
            </button>
        </div>
    )
}

export default Testimonials
