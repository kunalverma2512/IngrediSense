import { motion } from 'framer-motion';

const LimitationsSection = () => {
    return (
        <section className="py-32 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
                            What We<br />Don't Do
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Honesty means being upfront about limitations too.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-start gap-6">
                            <span className="text-3xl text-gray-300">01</span>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Medical Diagnoses</h3>
                                <p className="text-gray-600">We flag concerns, we don't prescribe. Always consult professionals.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-6">
                            <span className="text-3xl text-gray-300">02</span>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Buy/Don't Buy Labels</h3>
                                <p className="text-gray-600">We explain tradeoffs. The final decision is always yours.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-6">
                            <span className="text-3xl text-gray-300">03</span>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No False Certainty</h3>
                                <p className="text-gray-600">When science is unclear, we say so. No pretending to know everything.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LimitationsSection;
