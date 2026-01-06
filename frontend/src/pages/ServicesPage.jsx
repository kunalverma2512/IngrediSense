import { useEffect } from 'react';
import ServicesHero from '../components/services/ServicesHero';
import CoreCapabilities from '../components/services/CoreCapabilities';
import PhilosophySection from '../components/services/PhilosophySection';
import LimitationsSection from '../components/services/LimitationsSection';
import ServicesCTA from '../components/services/ServicesCTA';

const ServicesPage = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <ServicesHero />
            <CoreCapabilities />
            <PhilosophySection />
            <LimitationsSection />
            <ServicesCTA />
        </div>
    );
};

export default ServicesPage;
