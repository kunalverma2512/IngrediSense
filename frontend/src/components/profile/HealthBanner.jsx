import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiX, FiCheck, FiHeart, FiAlertCircle, FiActivity } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getHealthProfile } from '../../services/profile.service';
import { useAuth } from '../../context/AuthContext';

const HealthBanner = () => {
    const { isAuthenticated } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getHealthProfile();
                setProfile(response.data);
            } catch (error) {
                console.error('[HealthBanner] Error fetching profile:', error);
                // Set empty profile on error so banner still shows
                setProfile({
                    allergies: [],
                    conditions: [],
                    diets: [],
                    goals: [],
                    profileCompleted: false
                });
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    if (loading || !isVisible) return null;

    // Don't show banner if no profile data at all
    if (!profile) return null;

    // Calculate if profile has any data
    const hasAnyData =
        (profile.allergies?.length > 0) ||
        (profile.conditions?.length > 0) ||
        (profile.diets?.length > 0) ||
        (profile.goals?.length > 0);

    // Determine banner state and message
    let bannerMessage = "";
    let buttonText = "";

    if (!hasAnyData) {
        // State 1: Completely empty profile
        bannerMessage = "🏥 Help us personalize your experience! Share your health info for smarter ingredient analysis.";
        buttonText = "Fill Health Info";
    } else if (!profile.profileCompleted) {
        // State 2: Partial data (some fields filled)
        bannerMessage = "📋 Your profile is partially complete. Fill remaining details or modify existing info for better recommendations.";
        buttonText = "Complete Profile";
    } else {
        // State 3: Profile complete - show update reminder
        bannerMessage = "✅ Your health profile is complete! Keep it updated as your health conditions change.";
        buttonText = "Update Info";
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                >
                    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm shrink-0">
                                    <FiActivity className="text-lg sm:text-xl" />
                                </div>
                                <p className="text-sm sm:text-base font-medium leading-relaxed">
                                    {bannerMessage}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-end shrink-0">
                                <Link
                                    to="/profile"
                                    className="px-5 py-2.5 bg-white text-emerald-600 text-sm font-bold rounded-full hover:bg-emerald-50 transition-colors shadow-sm whitespace-nowrap"
                                >
                                    {buttonText}
                                </Link>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="text-white/80 hover:text-white transition-colors p-1.5"
                                    aria-label="Dismiss banner"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HealthBanner;
