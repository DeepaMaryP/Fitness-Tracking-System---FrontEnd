import { Button, Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import userLogo from '../assets/avatar.png'
import companyLogo from '../assets/CompanyLogo.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slice/authSlice'

const navigation = [
    { name: 'Home', href: '#', current: true },
    { name: 'Features', href: '#features', current: false },
    { name: 'Testimonials', href: '#testimonials', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Header() {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    const goToDashboard = () => {
        switch (auth.role) {
            case "Admin":
                navigate("/admin");
                break;
            case "Trainer":
                navigate("/trainer");
                break;
            default:
                navigate("/user");
        }
    }

    return (
        <Disclosure as="nav" className="bg-white/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">

                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="block h-6 w-6 data-[open]:hidden" />
                            <XMarkIcon className="hidden h-6 w-6 data-[open]:block" />
                        </DisclosureButton>
                    </div>

                    {/* Logo + Title */}
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex items-center space-x-2">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 tracking-tight">FitTrack</h1>
                            <img src={companyLogo} alt="Company Logo" className="h-6 sm:h-8 w-auto rounded-md" />
                        </div>

                        {/* Navigation links (hidden on mobile) */}
                        <div className="hidden sm:flex sm:ml-8 space-x-2 md:space-x-4">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        item.current
                                            ? 'text-blue-900 border-b-2 border-blue-900'
                                            : 'text-blue-600 hover:text-blue-800 hover:border-blue-800 hover:border-b-2',
                                        'px-3 py-2 text-sm font-medium transition-all duration-200'
                                    )}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <Link to="/paymentplan" className="text-blue-600 hover:text-blue-800 px-3 py-2 text-sm font-medium">
                                Payment Plans
                            </Link>
                            {auth.isLoggedIn && (
                                <button
                                    onClick={goToDashboard}
                                    className="text-blue-600 hover:text-blue-800 px-3 py-2 text-sm font-medium"
                                >
                                    Dashboard
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right side - Login / Profile */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-4">
                        <Menu as="div" className="relative">
                            {!auth.isLoggedIn && (
                                <Link to="/login" className="text-blue-700 font-medium hover:text-blue-900">
                                    Hello, Sign In
                                </Link>
                            )}

                            {auth.isLoggedIn && (
                                <>
                                    <MenuButton className="flex items-center focus:outline-none">
                                        <span className="hidden sm:inline font-medium text-md">{auth.userName}</span>
                                        <img
                                            src={userLogo}
                                            alt="User"
                                            className="ml-2 h-8 w-8 rounded-full bg-gray-200 border border-gray-300"
                                        />
                                    </MenuButton>

                                    <MenuItems className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                                        <MenuItem>
                                            <Button
                                                onClick={() => {
                                                    if (window.confirm("Are you sure to logout?")) dispatch(logout());
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Sign out
                                            </Button>
                                        </MenuItem>
                                    </MenuItems>
                                </>
                            )}
                        </Menu>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <DisclosurePanel className="sm:hidden bg-white shadow-md border-t">
                <div className="space-y-1 px-4 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            className={classNames(
                                item.current
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-800',
                                'block rounded-md px-3 py-2 text-base font-medium'
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}

                    <Link
                        to="/paymentplan"
                        className="block text-gray-700 hover:bg-blue-50 hover:text-blue-800 rounded-md px-3 py-2 text-base font-medium"
                    >
                        Payment Plans
                    </Link>

                    {auth.isLoggedIn && (
                        <button
                            onClick={goToDashboard}
                            className="block w-full text-left text-gray-700 hover:bg-blue-50 hover:text-blue-800 rounded-md px-3 py-2 text-base font-medium"
                        >
                            Dashboard
                        </button>
                    )}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}

export default Header;
