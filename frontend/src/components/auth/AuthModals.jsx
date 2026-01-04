import { useState } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const AuthModals = ({ initialModal = null }) => {
    const [showLogin, setShowLogin] = useState(initialModal === 'login');
    const [showSignup, setShowSignup] = useState(initialModal === 'signup');

    const openLogin = () => {
        setShowSignup(false);
        setShowLogin(true);
    };

    const openSignup = () => {
        setShowLogin(false);
        setShowSignup(true);
    };

    const closeAll = () => {
        setShowLogin(false);
        setShowSignup(false);
    };

    return (
        <>
            <LoginModal
                isOpen={showLogin}
                onClose={closeAll}
                onSwitchToSignup={openSignup}
            />
            <SignupModal
                isOpen={showSignup}
                onClose={closeAll}
                onSwitchToLogin={openLogin}
            />
        </>
    );
};

export default AuthModals;
export { AuthModals };
