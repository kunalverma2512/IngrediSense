import { motion } from 'framer-motion';
import HealthProfileForm from '../components/profile/HealthProfileForm';

const ProfilePage = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center pt-20">
                <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <p className="text-emerald-600 font-semibold text-lg mb-4 uppercase tracking-wider">
                            Your Health Profile
                        </p>
                        <h1 className="text-7xl md:text-8xl font-black text-gray-900 mb-8 leading-none">
                            Tell Me About You
                        </h1>
                        <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            I use your health context to give better recommendations. Everything here is optional—share what matters to you.
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <HealthProfileForm />
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;
