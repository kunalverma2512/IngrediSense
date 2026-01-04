import { motion } from 'framer-motion';
import { FiUser, FiActivity } from 'react-icons/fi';
import HealthProfileForm from '../components/profile/HealthProfileForm';

const ProfilePage = () => {
    return (
        <div className="min-h-screen bg-gray-50/50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center gap-3">
                            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                                <FiUser className="text-3xl" />
                            </div>
                            Your Health Profile
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            This information helps IngrediSense understand <em>you</em>. We use this context to highlight what matters in your food (e.g., flagging allergens or suggary items if you're pre-diabetic).
                        </p>
                    </motion.div>
                </header>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <HealthProfileForm />
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
