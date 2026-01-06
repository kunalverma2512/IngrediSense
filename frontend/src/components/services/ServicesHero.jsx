import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import Typewriter from './Typewriter';

const ServicesHero = () => {
    const handleScrollToNext = () => {
        const heroSection = document.getElementById('services-hero');
        if (heroSection) {
            const nextSection = heroSection.nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <section
            id="services-hero"
            className="min-h-screen flex items-center justify-center relative pt-20 bg-gradient-to-br from-gray-50 to-white"
        >
            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-6">
                            Our Services
                        </p>
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-none">
                            What<br />We Do
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                            We help you understand what's really in your food. No confusing labels, no hidden meanings.
                        </p>
                        <div className="border-l-4 border-emerald-500 pl-6">
                            <Typewriter
                                texts={[
                                    "Translating confusing ingredients into plain language.",
                                    "Analyzing products based on YOUR health goals.",
                                    "Explaining tradeoffs honestly—no scores, no labels.",
                                    "Helping you decide, not deciding for you."
                                ]}
                                className="text-lg text-gray-500 font-medium"
                            />
                        </div>
                    </motion.div>

                    {/* Right Side - Stats/Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-5xl font-black text-emerald-600 mb-2">AI-Powered</p>
                            <p className="text-gray-600 text-lg">Instant ingredient analysis using advanced AI models</p>
                        </div>
                        <div className="p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-5xl font-black text-gray-900 mb-2">Personalized</p>
                            <p className="text-gray-600 text-lg">Tailored to your health conditions, allergies & goals</p>
                        </div>
                        <div className="p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-5xl font-black text-gray-900 mb-2">Honest</p>
                            <p className="text-gray-600 text-lg">We show tradeoffs, not simplified scores</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.button
                onClick={handleScrollToNext}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-xs font-medium text-gray-500 group-hover:text-emerald-600 transition-colors">
                        Explore our services
                    </span>
                    <div className="w-12 h-12 bg-white shadow-md flex items-center justify-center group-hover:bg-emerald-50 transition-all">
                        <FiArrowDown className="text-2xl text-gray-600 group-hover:text-emerald-600 transition-colors" />
                    </div>
                </motion.div>
            </motion.button>
        </section>
    );
};

export default ServicesHero;
