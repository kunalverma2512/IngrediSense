import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';

const HowItWorks = () => {
    return (
        <section className="min-h-screen bg-white flex items-center py-20">
            <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-4">
                        Decision-Time AI
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 md:mb-12">
                        How I Help
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 md:mb-16">
                        You're standing in the aisle, phone in hand. Here's what happens:
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12 md:mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-lg">
                            <span className="text-4xl md:text-5xl font-black text-white">1</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Show Me</h3>
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                            Snap the ingredients list or barcode. I'll read it instantly.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-lg">
                            <span className="text-4xl md:text-5xl font-black text-white">2</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Tell Me Why</h3>
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                            "Trying to cut sugar" or "Need protein for gym"—I adapt to your goal.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-lg">
                            <span className="text-4xl md:text-5xl font-black text-white">3</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Get the Truth</h3>
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                            Plain language answer with tradeoffs, not a score. You decide.
                        </p>
                    </motion.div>
                </div>

                <div className="mt-12 md:mt-16 bg-gray-50 rounded-xl p-6 md:p-8 max-w-3xl mx-auto text-left">
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                        <FiZap className="inline text-emerald-600" /> <strong>Why this works:</strong>
                    </p>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        I reduce cognitive load by interpreting ingredients based on your situation. No database browsing, no endless scrolling. Just: "Here's what matters, here's the tradeoff, your call."
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
