import React from 'react'
import WorkOutPlans from '../assets/WorkOutPlans.jpg'
import DietPlans from '../assets/DietPlans.jpg'
import ActivityTracker from '../assets/Activity Tracker.jpg'
import Targets from '../assets/Targets.jpg'
import TrainerSupport from '../assets/Trainer Support.jpg'
import IntegrationWearables from '../assets/IntegrationWearables.jpg'

function Features() {
    return (
        <div className='m-8'>
            <div className='text-4xl sm:text-5xl text-center'>Features</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-5'>
                <div className='flex flex-col items-center mt-10'>
                    <div className="bg-black p-0.5 rounded-full w-56 h-56 flex items-center justify-center">
                        <img src={WorkOutPlans} className='rounded-full h-full w-full' alt="" />
                    </div>
                    <div className='font-bold'>WorkOut Plans</div>
                </div>
                <div className='flex flex-col items-center mt-10'>
                    <div className="bg-black p-0.5 rounded-full w-56 h-56 flex items-center justify-center">
                        <img src={DietPlans} className='rounded-full h-full w-full' alt="" />
                    </div>
                    <div className='font-bold'>Diet Plans</div>
                </div>
                <div className='flex flex-col items-center mt-10'>
                    <div className="bg-black p-0.5 rounded-full w-56 h-56 flex items-center justify-center">
                        <img src={ActivityTracker} className='rounded-full h-full w-full' alt="" />
                    </div>
                    <div className='font-bold'>Activity Tracker</div>
                </div>
        
                <div className='flex flex-col items-center mt-10'>
                    <div className="bg-black p-0.5 rounded-full w-56 h-56 flex items-center justify-center">
                        <img src={Targets} className='rounded-full h-full w-full' alt="" />
                    </div>
                    <div className='font-bold'>Targets and Achievements</div>
                </div>
                <div className='flex flex-col items-center mt-10'>
                    <div className="bg-black p-0.5 rounded-full w-56 h-56 flex items-center justify-center">
                        <img src={TrainerSupport} className='rounded-full h-full w-full' alt="" />
                    </div>
                    <div className='font-bold'>Trainer Support</div>
                </div>
                <div className='flex flex-col items-center mt-10'>
                    <div className="bg-black p-0.5 rounded-full w-56 h-56 flex items-center justify-center">
                        <img src={IntegrationWearables} className='rounded-full h-full w-full' alt="" />
                    </div>
                    <div className='font-bold'>Integration with Wearables</div>
                </div>
            </div>
         </div>
    )
}

export default Features
