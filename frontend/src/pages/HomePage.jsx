import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/home/HeroSection'
import FeaturesSection from '../components/home/FeaturesSection'
import AboutSection from '../components/home/AboutSection'
import CTASection from '../components/home/CTASection'

const HomePage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div>
            <HeroSection />
            <FeaturesSection />
            <AboutSection />
            <CTASection />
        </div>
    )
}

export default HomePage
