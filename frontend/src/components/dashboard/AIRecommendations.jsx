import { motion } from 'framer-motion';
import { FiZap, FiShoppingBag, FiBookOpen, FiHeart } from 'react-icons/fi';

const AIRecommendations = () => {
    const recommendations = [
        {
            icon: '🥗',
            title: 'Choose Whole Foods',
            description: 'Look for products with minimal processing and recognizable ingredients.',
            type: 'tip',
        },
        {
            icon: '🏷️',
            title: 'Read Labels Carefully',
            description: 'Ingredients are listed by quantity - avoid products where sugar or salt appears first.',
            type: 'tip',
        },
        {
            icon: '🎯',
            title: 'Watch for Hidden Additives',
            description: 'Be cautious of artificial colors (E numbers), preservatives, and flavor enhancers.',
            type: 'warning',
        },
        {
            icon: '✅',
            title: 'Prioritize Natural Ingredients',
            description: 'Products with shorter ingredient lists and natural components are generally healthier.',
            type: 'success',
        },
    ];

    const learningResources = [
        { icon: FiBookOpen, title: 'Ingredient Guide', link: '/guidelines' },
        { icon: FiZap, title: 'How It Works', link: '/how-it-works' },
        { icon: FiShoppingBag, title: 'Smart Shopping Tips', link: '/guidelines' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiZap className="text-emerald-600" />
                AI Recommendations
            </h2>

            <div className="space-y-4 mb-6">
                {recommendations.map((rec, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                    >
                        <div className="text-3xl flex-shrink-0">{rec.icon}</div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                            <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-5 border border-teal-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiHeart className="text-teal-600" />
                    Learn More
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {learningResources.map((resource, index) => (
                        <a
                            key={index}
                            href={resource.link}
                            className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg hover:shadow-md transition-all text-gray-700 hover:text-teal-600"
                        >
                            <resource.icon className="text-lg" />
                            <span className="text-sm font-medium">{resource.title}</span>
                        </a>
                    ))}
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">
                    💡 Personalized recommendations will appear after your first scan
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
                    Start Scanning →
                </button>
            </div>
        </motion.div>
    );
};

export default AIRecommendations;
