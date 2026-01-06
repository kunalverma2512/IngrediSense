import DashboardBanner from '../components/dashboard/DashboardBanner';
import HeroOverview from '../components/dashboard/HeroOverview';
import InterpretSection from '../components/dashboard/InterpretSection';
import HowItWorks from '../components/dashboard/HowItWorks';
import CTASection from '../components/dashboard/CTASection';

const DashboardPage = () => {
    return (
        <div className="bg-white">
            {/* Banner comes after Navbar (Navbar is in MainLayout with pt-16/pt-20) */}
            <div className="pt-16 md:pt-20">
                <DashboardBanner />
            </div>

            {/* All dashboard sections */}
            <HeroOverview />
            <InterpretSection />
            <HowItWorks />
            <CTASection />
        </div>
    );
};

export default DashboardPage;

