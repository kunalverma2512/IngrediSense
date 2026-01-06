import { motion } from 'framer-motion';
import { FiArrowDown, FiMessageCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HeroOverview = () => {
    const { user } = useAuth();

    const handleScrollToNext = () => {
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
            const nextSection = heroSection.nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <section
            id="hero-section"
            className="min-h-screen flex items-center justify-center relative bg-white"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-emerald-600 font-semibold text-base md:text-lg mb-4 tracking-wide">
                            YOUR AI SHOPPING COMPANION
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                            Hey, {user?.name}!
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                            I'm your AI co-pilot for making sense of ingredients while you shop. No jargon, no filters—just honest answers about what you're about to eat.
                        </p>
                        <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
                            <strong className="text-emerald-700">How it works:</strong> Show me a product, tell me what you care about (staying energized? Avoiding sugar? Feeding kids?), and I'll explain what's really inside—with the tradeoffs.
                        </p>
                        <Link to="/scan">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                            >
                                <FiMessageCircle className="text-xl" />
                                Ask About a Product
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Right Side - Real Examples */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 md:p-8 border border-emerald-200 shadow-sm">
                            <p className="text-xs md:text-sm text-emerald-700 font-semibold mb-3 tracking-wide">
                                EXAMPLE CONVERSATION
                            </p>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                                    <div className="bg-white rounded-xl rounded-tl-none p-4 shadow-sm flex-1">
                                        <p className="text-gray-800 text-sm md:text-base">
                                            "Is this granola bar okay for my kid's lunchbox?"
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <div className="bg-emerald-600 text-white rounded-xl rounded-tr-none p-4 shadow-sm max-w-md">
                                        <p className="text-sm md:text-base">
                                            "It has 12g sugar—about 3 teaspoons. Good for quick energy but might cause a crash. The oats and nuts are solid. <strong>Tradeoff:</strong> Convenient but sweeter than ideal."
                                        </p>
                                    </div>
                                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex-shrink-0"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 md:p-6 border border-teal-200 shadow-sm">
                            <p className="text-xs md:text-sm text-teal-700 font-semibold mb-2 tracking-wide">
                                WHY AI CO-PILOT?
                            </p>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                                I understand your intent, not just keywords. Instead of showing you a database of "bad" ingredients, I explain what they mean for <em>your</em> situation.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Down Arrow */}
            <motion.button
                onClick={handleScrollToNext}
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer hover:text-emerald-600 transition-colors"
                aria-label="Scroll to next section"
            >
                <FiArrowDown className="text-3xl md:text-4xl text-gray-400" />
            </motion.button>
        </section>
    );
};

export default HeroOverview;
