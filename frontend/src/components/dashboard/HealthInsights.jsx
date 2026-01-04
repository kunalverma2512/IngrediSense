import { motion } from 'framer-motion';
import { FiCpu, FiActivity, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi';

const HealthInsights = () => {
    const insights = [
        {
            icon: FiCpu,
            title: 'AI Analysis Ready',
            description: 'Our AI is ready to analyze your food ingredients and provide personalized health insights.',
            color: 'emerald',
        },
        {
            icon: FiActivity,
            title: 'Track Your Progress',
            description: 'Start scanning products to build your health profile and track improvements over time.',
            color: 'teal',
        },
        {
            icon: FiAlertTriangle,
            title: 'Allergen Detection',
            description: 'We\'ll automatically flag potential allergens and concerning ingredients in your scans.',
            color: 'amber',
        },
        {
            icon: FiTrendingUp,
            title: 'Health Score Trends',
            description: 'Monitor your dietary choices and see how your health score improves as you make better decisions.',
            color: 'cyan',
        },
    ];

    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-600',
        teal: 'bg-teal-100 text-teal-600',
        amber: 'bg-amber-100 text-amber-600',
        cyan: 'bg-cyan-100 text-cyan-600',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiCpu className="text-cyan-600" />
                Health Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className={`w-12 h-12 rounded-lg ${colorClasses[insight.color]} flex items-center justify-center mb-3`}>
                            <insight.icon className="text-2xl" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-200">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h4>
                        <p className="text-sm text-gray-700">
                            Our advanced AI analyzes ingredient lists using natural language processing and nutritional databases
                            to provide accurate health scores and identify potential concerns. Start scanning to unlock personalized insights!
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HealthInsights;
