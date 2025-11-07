import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline' // Heroicons built into Tailwind setup
import companyLogo from '../assets/CompanyLogo.jpg'

function LogInHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-2">
          <img
            src={companyLogo}
            alt="FitTrack logo"
            className="h-10 w-auto rounded-md"
          />
          <span className="text-2xl sm:text-3xl font-bold text-blue-900">
            FitTrack
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium bg-blue-900 text-white hover:bg-blue-800 transition"
          >
            Home
          </Link>
          <Link
            to="/paymentplan"
            className="rounded-md px-3 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 transition"
          >
            Payment Plans
          </Link>
        </nav>

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

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 px-4 py-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-blue-900 hover:bg-blue-100"
          >
            Home
          </Link>
          <Link
            to="/paymentplan"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-blue-900 hover:bg-blue-100"
          >
            Payment Plans
          </Link>
        </div>
      )}
    </header>
  )
}

export default LogInHeader
