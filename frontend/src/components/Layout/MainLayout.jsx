import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import LoginModal from '../auth/LoginModal'
import SignupModal from '../auth/SignupModal'

const MainLayout = () => {
    const { pathname } = useLocation()
    const [showLogin, setShowLogin] = useState(false)
    const [showSignup, setShowSignup] = useState(false)

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    const openLogin = () => setShowLogin(true)
    const openSignup = () => setShowSignup(true)

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            <Navbar
                onOpenLogin={openLogin}
                onOpenSignup={openSignup}
            />
            <main className="flex-grow">
                <Outlet context={{ openLogin, openSignup }} />
            </main>
            <Footer />

            {/* Auth Modals - Rendered globally to handle animations internally */}
            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToSignup={() => {
                    setShowLogin(false)
                    setShowSignup(true)
                }}
            />
            <SignupModal
                isOpen={showSignup}
                onClose={() => setShowSignup(false)}
                onSwitchToLogin={() => {
                    setShowSignup(false)
                    setShowLogin(true)
                }}
            />
        </div>
    )
}

export default MainLayout
