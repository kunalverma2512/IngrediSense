import { motion } from 'framer-motion';
import Typewriter from './Typewriter';

const PhilosophySection = () => {
    return (
        <section className="py-32 bg-gray-900 text-white">
            <div className="max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl md:text-7xl font-black mb-8">
                        Our Philosophy
                    </h2>
                    <div className="h-16 flex items-center justify-center mb-12">
                        <Typewriter
                            texts={[
                                "Information over instruction.",
                                "Context over scores.",
                                "Honesty over certainty.",
                                "You decide, we support."
                            ]}
                            className="text-2xl md:text-3xl text-emerald-400 font-semibold"
                        />
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        We believe you're smart enough to make your own food choices.
                        You just need the right information, presented clearly,
                        filtered through what actually matters to you.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default PhilosophySection;
