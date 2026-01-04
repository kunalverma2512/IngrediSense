import { motion } from 'framer-motion';
import { FiCamera, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const HeroOverview = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Scans Today', value: '0', icon: FiCamera, color: 'emerald' },
        { label: 'Total Ingredients', value: '0', icon: FiTrendingUp, color: 'teal' },
        { label: 'Health Score', value: 'N/A', icon: FiCheckCircle, color: 'cyan' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl mb-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-white/90 text-lg">
                        Your AI-powered ingredient analysis dashboard
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 md:mt-0 px-8 py-3 bg-white text-emerald-700 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    📸 Scan Product
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className="text-3xl" />
                            <span className="text-3xl font-bold">{stat.value}</span>
                        </div>
                        <p className="text-white/80">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default HeroOverview;
