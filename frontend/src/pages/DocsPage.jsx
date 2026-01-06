import { useEffect } from 'react';
import DocsHero from '../components/docs/DocsHero';
import ArchitectureSection from '../components/docs/ArchitectureSection';
import AIWorkflowSection from '../components/docs/AIWorkflowSection';
import TechStackSection from '../components/docs/TechStackSection';
import FeaturesSection from '../components/docs/FeaturesSection';
import DocsCTA from '../components/docs/DocsCTA';

const DocsPage = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <DocsHero />
            <ArchitectureSection />
            <AIWorkflowSection />
            <FeaturesSection />
            <TechStackSection />
            <DocsCTA />
        </div>
    );
};

export default DocsPage;
