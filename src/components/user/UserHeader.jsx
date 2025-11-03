import React from 'react'
import { Button, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import companyLogo from '../../assets/CompanyLogo.jpg'
import userLogo from '../../assets/avatar.png'
import { logout } from '../../redux/slice/authSlice';

function UserHeader() {
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doLogOut = () => {
    if (window.confirm("Are you sure to logout?")) {
      dispatch(logout())
      navigate('/')
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start mt-5 ml-2">
      <div className="flex shrink-0 items-center">
        <div className='font-bold text-3xl text-center mr-2'>
          FitTrack
        </div>
        <img alt="Your Company" src={companyLogo} className="h-8 w-auto" />
      </div>

      <div className="sm:ml-6 md:ml-10 sm:block">
        <div className="flex space-x-4">
          <Link to='/'>
            <span className='rounded-md px-3 py-2 text-sm font-medium bg-blue-900 text-white'>Home</span></Link>
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center mr-10 sm:static sm:ml-auto sm:pr-0">
        {/* Profile dropdown */}
        <Menu as="div" className="relative ml-3">

          {!auth.isLoggedIn &&
            <Link to="/login">
              <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <span >Hello, Sign In</span>
              </MenuButton></Link>}

          {auth.isLoggedIn &&
            <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Open user menu</span>
              <span className='font-medium text-md'>{auth.userName}</span>
              <img alt="" src={userLogo} className="ml-2  size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10" />
            </MenuButton>}
          {auth.isLoggedIn &&

            <MenuItems transition className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 
                                                                    transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
              <MenuItem>
                <Button onClick={doLogOut} className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden" >
                  Sign out
                </Button>
              </MenuItem>
            </MenuItems>}
        </Menu>
      </div>
    </div>
  )
}

export default UserHeader
