import React from 'react'
import WorkOutPlans from '../assets/WorkOutPlans.jpg'
import DietPlans from '../assets/DietPlans.jpg'
import ActivityTracker from '../assets/Activity Tracker.jpg'
import Targets from '../assets/Targets.jpg'
import TrainerSupport from '../assets/Trainer Support.jpg'
import IntegrationWearables from '../assets/IntegrationWearables.jpg'

const features = [
    { img: WorkOutPlans, title: 'Workout Plans', alt: 'Workout plans for fitness' },
    { img: DietPlans, title: 'Diet Plans', alt: 'Healthy diet and meal plans' },
    { img: ActivityTracker, title: 'Activity Tracker', alt: 'Track your daily activity' },
    { img: Targets, title: 'Targets & Achievements', alt: 'Set and achieve fitness targets' },
    { img: TrainerSupport, title: 'Trainer Support', alt: 'Personal trainer assistance' },
    { img: IntegrationWearables, title: 'Integration with Wearables', alt: 'Sync with wearable devices' },
];

function Features() {
    return (
        <div className="m-8">
            <h2 className="text-4xl sm:text-5xl text-center font-bold text-gray-800 mb-8">Features</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {features.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center group">
                        <div className="bg-black p-0.5 rounded-full w-56 h-56 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
                            <img
                                src={feature.img}
                                alt={feature.alt}
                                className="rounded-full h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <div className="font-semibold text-lg mt-4 text-center text-gray-700">
                            {feature.title}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Features
