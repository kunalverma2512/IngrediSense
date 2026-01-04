import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import LoginModal from '../auth/LoginModal'
import SignupModal from '../auth/SignupModal'

const Navbar = ({ onOpenLogin, onOpenSignup }) => {
    const { user, isAuthenticated, logout } = useAuth()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showResourcesMenu, setShowResourcesMenu] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = isAuthenticated
        ? [
            { name: 'About', path: '/about' },
            { name: 'Services', path: '/services' },
            { name: 'Contact', path: '/contact' },
        ]
        : [
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Services', path: '/services' },
            { name: 'Contact', path: '/contact' },
        ];

    const resourcesLinks = [
        { name: 'Guidelines', path: '/guidelines' },
        { name: 'Documentation', path: '/docs' },
        { name: 'FAQ', path: '/faq' },
    ]

    const handleLogout = () => {
        logout()
        setShowUserMenu(false)
        window.location.href = '/'
    }

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/90 backdrop-blur-lg shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2 group">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent"
                            >
                                🧬 IngrediSense
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            {/* Resources Dropdown */}
                            <div className="relative"
                                onMouseEnter={() => setShowResourcesMenu(true)}
                                onMouseLeave={() => setShowResourcesMenu(false)}
                            >
                                <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 flex items-center gap-1">
                                    Resources
                                    <FiChevronDown className={`transition-transform ${showResourcesMenu ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showResourcesMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200"
                                        >
                                            {resourcesLinks.map((link) => (
                                                <Link
                                                    key={link.path}
                                                    to={link.path}
                                                    className="block px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700"
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {isAuthenticated && (
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            )}
                        </div>

                        {/* Auth Buttons / User Menu - Desktop */}
                        <div className="hidden md:flex items-center space-x-3">
                            {isAuthenticated ? (
                                <div className="relative"
                                    onMouseEnter={() => setShowUserMenu(true)}
                                    onMouseLeave={() => setShowUserMenu(false)}
                                >
                                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-gray-700 font-medium">{user?.name}</span>
                                        <FiChevronDown className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showUserMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200"
                                            >
                                                <Link
                                                    to="/dashboard"
                                                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700"
                                                >
                                                    <FiUser size={16} />
                                                    <span>Dashboard</span>
                                                </Link>
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700"
                                                >
                                                    <FiUser size={16} />
                                                    <span>Health Profile</span>
                                                </Link>
                                                <hr className="my-2" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors text-red-600 w-full text-left"
                                                >
                                                    <FiLogOut size={16} />
                                                    <span>Logout</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={onOpenLogin}
                                        className="px-5 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={onOpenSignup}
                                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <FiX className="w-6 h-6 text-gray-700" />
                            ) : (
                                <FiMenu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`
                                        }
                                    >
                                        {link.name}
                                    </NavLink>
                                ))}

                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Resources</p>
                                    {resourcesLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>

                                {isAuthenticated ? (
                                    <>
                                        <NavLink
                                            to="/dashboard"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`
                                            }
                                        >
                                            Dashboard
                                        </NavLink>
                                        <NavLink
                                            to="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`
                                            }
                                        >
                                            Health Profile
                                        </NavLink>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-all duration-200"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                onOpenLogin()
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="block w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-center transition-all duration-200"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => {
                                                onOpenSignup()
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium text-center hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                                        >
                                            Sign Up
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>


        </>
    )
}

export default Navbar
