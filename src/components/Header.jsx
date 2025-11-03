import { Button, Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
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
        <Disclosure as="nav" className="relative ">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <div className='font-bold text-3xl text-center mr-2'>
                                FitTrack
                            </div>
                            <img
                                alt="Your Company"
                                src={companyLogo}
                                className="h-8 w-auto"
                            />
                        </div>
                        <div className="sm:ml-6 md:ml-10 flex">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        aria-current={item.current ? 'page' : undefined}
                                        className={classNames(
                                            item.current ? 'bg-blue-900 text-white' : 'text-blue-600 hover:bg-white/5 hover:text-blue-800',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                                {<Link className='text-sm font-medium py-2 px-3' to="/paymentplan">
                                    <span className='text-blue-600 hover:bg-white/5 hover:text-blue-800 rounded-md text-sm font-medium'
                                    >Payment Plans</span>
                                </Link>}
                                {auth.isLoggedIn &&
                                    <button onClick={goToDashboard} className='text-blue-600 hover:bg-white/5 hover:text-blue-800 rounded-md text-sm font-medium px-3 py-2'
                                    >Dashboard</button>}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
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
                                        <Button onClick={() => { if (window.confirm("Are you sure to logout?")) { dispatch(logout()) } }} className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden" >
                                            Sign out
                                        </Button>
                                    </MenuItem>
                                </MenuItems>}
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}

export default Header