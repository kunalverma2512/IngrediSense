import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const DocsCTA = () => {
    return (
        <section className="py-32 bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                        Try It Now
                    </h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        The best way to understand IngrediSense is to use it.
                        Scan a product and see the AI analysis in action.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/scan">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-emerald-600 text-white text-base md:text-lg font-bold hover:bg-emerald-700 transition-colors w-full sm:w-auto justify-center"
                            >
                                Scan a Product
                                <FiArrowRight />
                            </motion.button>
                        </Link>
                        <Link to="/dashboard">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-transparent text-white text-base md:text-lg font-bold border border-gray-700 hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center"
                            >
                                Go to Dashboard
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DocsCTA;
