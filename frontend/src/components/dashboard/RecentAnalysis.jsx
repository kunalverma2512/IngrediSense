import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const RecentAnalysis = () => {
    // Placeholder data
    const analyses = [
        {
            id: 1,
            productName: 'Sample Product 1',
            date: '2024-01-02',
            healthScore: 85,
            concerns: ['High Sodium'],
            status: 'healthy',
        },
        {
            id: 2,
            productName: 'Sample Product 2',
            date: '2024-01-01',
            healthScore: 60,
            concerns: ['Artificial Colors', 'Preservatives'],
            status: 'moderate',
        },
    ];

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-100';
        if (score >= 60) return 'text-amber-600 bg-amber-100';
        return 'text-red-600 bg-red-100';
    };

    const getStatusIcon = (status) => {
        if (status === 'healthy') return <FiCheckCircle className="text-green-600" />;
        return <FiAlertCircle className="text-amber-600" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FiClock className="text-teal-600" />
                    Recent Analysis
                </h2>
                <button className="text-teal-600 hover:text-teal-700 font-medium text-sm">
                    View All →
                </button>
            </div>

            {analyses.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FiClock className="text-3xl text-gray-400" />
                    </div>
                    <p className="text-gray-600">No analyses yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Start by scanning your first product!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {analyses.map((analysis, index) => (
                        <motion.div
                            key={analysis.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{analysis.productName}</h3>
                                    <p className="text-sm text-gray-500">{analysis.date}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(analysis.status)}
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(analysis.healthScore)}`}>
                                        {analysis.healthScore}
                                    </span>
                                </div>
                            </div>

                            {analysis.concerns.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-600 mb-1">Key Concerns:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.concerns.map((concern, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full"
                                            >
                                                {concern}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="mt-6 text-center">
                <button className="text-sm text-gray-600 hover:text-emerald-600">
                    📊 View Detailed Reports
                </button>
            </div>
        </motion.div>
    );
};

export default RecentAnalysis;
