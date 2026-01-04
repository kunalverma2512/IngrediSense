import { motion } from 'framer-motion';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiAward } from 'react-icons/fi';

const QuickStats = () => {
    const activityData = [
        { day: 'Mon', scans: 0 },
        { day: 'Tue', scans: 0 },
        { day: 'Wed', scans: 0 },
        { day: 'Thu', scans: 0 },
        { day: 'Fri', scans: 0 },
        { day: 'Sat', scans: 0 },
        { day: 'Sun', scans: 0 },
    ];

    const categories = [
        { name: 'Snacks', count: 0, color: 'bg-emerald-500' },
        { name: 'Beverages', count: 0, color: 'bg-teal-500' },
        { name: 'Packaged Foods', count: 0, color: 'bg-cyan-500' },
        { name: 'Others', count: 0, color: 'bg-blue-500' },
    ];

    const achievements = [
        { icon: '🎯', title: 'First Scan', locked: true },
        { icon: '🌟', title: '10 Scans', locked: true },
        { icon: '🏆', title: 'Health Champion', locked: true },
        { icon: '💎', title: '100 Scans', locked: true },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiBarChart2 className="text-cyan-600" />
                Quick Stats
            </h2>

            {/* Weekly Activity */}
            <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiTrendingUp className="text-emerald-600" />
                    Weekly Scans
                </h3>
                <div className="flex items-end justify-between gap-2 h-32">
                    {activityData.map((day, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                            <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: `${(day.scans / 10) * 100 || 10}%` }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 to-teal-500"></div>
                            </div>
                            <span className="text-xs text-gray-600 mt-2">{day.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiPieChart className="text-teal-600" />
                    Top Categories
                </h3>
                <div className="space-y-3">
                    {categories.map((category, index) => (
                        <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-700">{category.name}</span>
                                <span className="text-gray-600">{category.count}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`${category.color} h-full rounded-full transition-all duration-500`}
                                    style={{ width: `${(category.count / 50) * 100 || 5}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievements */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiAward className="text-amber-600" />
                    Achievements
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {achievements.map((achievement, index) => (
                        <div
                            key={index}
                            className={`text-center p-4 rounded-lg border-2 ${achievement.locked
                                    ? 'border-gray-200 bg-gray-50 opacity-50'
                                    : 'border-emerald-300 bg-emerald-50'
                                }`}
                        >
                            <div className="text-3xl mb-2">{achievement.icon}</div>
                            <p className="text-xs font-medium text-gray-700">{achievement.title}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">
                    📊 Start scanning to unlock detailed analytics and insights!
                </p>
            </div>
        </motion.div>
    );
};

export default QuickStats;
