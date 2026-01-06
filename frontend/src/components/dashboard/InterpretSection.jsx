import { motion } from 'framer-motion';

const InterpretSection = () => {
    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-4">
                            Intent-First Understanding
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 md:mb-8 leading-tight">
                            I Interpret,<br />You Decide
                        </h2>
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                            No scores, no red/green lists. Just honest explanations in plain language about what ingredients mean for you.
                        </p>
                    </motion.div>

                    {/* Right - Use Cases */}
                    <div className="lg:col-span-3 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                        >
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                    "Is this better for my diabetes?"
                                </h3>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                                    I'll look at sugar types, fiber content, and glycemic impact—then explain the tradeoffs in terms you understand.
                                </p>
                                <p className="text-xs md:text-sm text-teal-700">
                                    <strong>Not:</strong> "This has 15g carbs." <strong>But:</strong> "The fiber here slows sugar absorption. Better than white bread, but still watch portions."
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                        >
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                    "Is this additive safe?"
                                </h3>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                                    I'll translate the science and tell you what we know, what we don't, and who might want to avoid it.
                                </p>
                                <p className="text-xs md:text-sm text-amber-700">
                                    <strong>Honesty:</strong> "Carrageenan is approved, but some studies suggest gut inflammation. Limited data. Most people are fine, but skip if you have IBS."
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                        >
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                    "Should I pay more for organic?"
                                </h3>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    I'll compare ingredients between versions and explain if the premium actually matters for what you care about (pesticides? nutrition? taste?).
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InterpretSection;
