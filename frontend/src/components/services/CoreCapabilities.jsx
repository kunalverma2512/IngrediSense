import { motion } from 'framer-motion';
import { FiMessageCircle, FiSearch, FiLayers, FiShield } from 'react-icons/fi';

const CoreCapabilities = () => {
    const services = [
        {
            icon: <FiMessageCircle className="text-3xl" />,
            title: "Intent Understanding",
            description: "Tell me your goal—managing diabetes, building muscle, feeding kids—and I analyze ingredients through your specific lens. Not generic advice, but personalized insight."
        },
        {
            icon: <FiSearch className="text-3xl" />,
            title: "Ingredient Translation",
            description: "I decode confusing chemical names into plain language. Pyridoxine Hydrochloride becomes Vitamin B6. No more guessing what's actually in your food."
        },
        {
            icon: <FiLayers className="text-3xl" />,
            title: "Tradeoff Analysis",
            description: "No food is perfect. I explain the complete picture: high protein but also high sodium, good fiber but added sugars. You get facts, you make choices."
        },
        {
            icon: <FiShield className="text-3xl" />,
            title: "Health-Aware Screening",
            description: "Based on your health profile, I flag ingredients that may conflict with your conditions or allergies. Personalized alerts, not generic warnings."
        }
    ];

    return (
        <section className="py-32 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                        Core Capabilities
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Real features, not marketing fluff. Here's exactly what our AI can do for you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {services.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-12 bg-white hover:bg-gray-50 transition-colors border-t border-l border-gray-200 first:border-t-0 md:first:border-t md:even:border-l md:odd:border-l-0 md:[&:nth-child(-n+2)]:border-t-0"
                        >
                            <div className="text-emerald-600 mb-6">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreCapabilities;
