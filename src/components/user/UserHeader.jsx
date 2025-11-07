import React, { useState } from 'react'
import { Button, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/slice/authSlice'
import companyLogo from '../../assets/CompanyLogo.jpg'
import userLogo from '../../assets/avatar.png'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

function UserHeader() {
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const doLogOut = () => {
    if (window.confirm("Are you sure to logout?")) {
      dispatch(logout())
      navigate('/')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <img src={companyLogo} alt="FitTrack logo" className="h-10 w-auto rounded-md" />
          <span className="text-2xl sm:text-3xl font-bold text-blue-900">FitTrack</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium bg-blue-900 text-white hover:bg-blue-800 transition"
          >
            Home
          </Link>

          <Menu as="div" className="relative">
            {!auth.isLoggedIn ? (
              <Link to="/login">
                <MenuButton className="px-3 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 transition">
                  Hello, Sign In
                </MenuButton>
              </Link>
            ) : (
              <>
                <MenuButton className="flex items-center gap-2 text-blue-800 font-medium hover:text-blue-900">
                  <span>{auth.userName}</span>
                  <img
                    src={userLogo}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full border border-gray-300"
                  />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                >
                  <MenuItem>
                    <Button
                      onClick={doLogOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </Button>
                  </MenuItem>
                </MenuItems>
              </>
            )}
          </Menu>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-blue-700 hover:bg-blue-100 focus:outline-none transition"
        >
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-200 px-4 py-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-blue-900 hover:bg-blue-100"
          >
            Home
          </Link>

          {!auth.isLoggedIn ? (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-900 hover:bg-blue-100"
            >
              Hello, Sign In
            </Link>
          ) : (
            <Button
              onClick={() => {
                doLogOut()
                setMenuOpen(false)
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-900 hover:bg-blue-100"
            >
              Sign out
            </Button>
          )}
        </div>
      )}
    </header>
  )
}

export default UserHeader
