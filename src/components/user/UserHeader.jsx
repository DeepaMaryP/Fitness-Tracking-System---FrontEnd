import React from 'react'
import companyLogo from '../../assets/CompanyLogo.jpg'
import { Link } from 'react-router-dom'

function UserHeader() {
  return (
    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start mt-5 ml-2">
        <div className="flex shrink-0 items-center">
          <div className='font-bold text-3xl text-center mr-2'>
            FitTrack
          </div>
          <img alt="Your Company"  src={companyLogo} className="h-8 w-auto"  />
        </div>

        <div className="sm:ml-6 md:ml-10 sm:block">
          <div className="flex space-x-4">
             <Link to='/'>
              <span className='rounded-md px-3 py-2 text-sm font-medium bg-blue-900 text-white'>Home</span></Link>
          </div>
        </div>        
      </div>
  )
}

export default UserHeader
