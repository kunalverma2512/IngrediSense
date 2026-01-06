import { motion } from 'framer-motion';
import { FiArrowDown, FiMessageCircle, FiZap } from 'react-icons/fi';
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
            className="flex items-start justify-center relative pt-16 pb-32 bg-gradient-to-br from-gray-50 to-white"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Side - Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        {/* Tag */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-200 shadow-sm"
                        >
                            <FiZap className="text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-700 tracking-wide">
                                YOUR AI SHOPPING COMPANION
                            </span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight"
                        >
                            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                                Hey, {user?.name}!
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg md:text-xl text-gray-700 leading-relaxed"
                        >
                            I'm your AI co-pilot for making sense of ingredients while you shop.
                            <span className="font-semibold text-gray-900"> No jargon, no filters</span>—just honest answers about what you're about to eat.
                        </motion.p>

                        {/* How it works */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-sm"
                        >
                            <p className="text-sm font-bold text-emerald-700 mb-2">How it works:</p>
                            <p className="text-base text-gray-700 leading-relaxed">
                                Show me a product, tell me what you care about (staying energized? Avoiding sugar? Feeding kids?), and I'll explain what's really inside—with the tradeoffs.
                            </p>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Link to="/scan">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative flex items-center gap-3">
                                        <FiMessageCircle className="text-xl" />
                                        Ask About a Product
                                    </span>
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Interactive Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Example Conversation Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-emerald-200/50 shadow-xl"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                    Example Conversation
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* User Message */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-gray-600">
                                        U
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex-1 border border-gray-200">
                                        <p className="text-gray-800 text-sm md:text-base font-medium">
                                            "Is this granola bar okay for my kid's lunchbox?"
                                        </p>
                                    </div>
                                </motion.div>

                                {/* AI Response */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 }}
                                    className="flex gap-3 justify-end"
                                >
                                    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl rounded-tr-sm p-4 shadow-lg max-w-md hover:shadow-xl transition-shadow">
                                        <p className="text-sm md:text-base leading-relaxed">
                                            "It has 12g sugar—about 3 teaspoons. Good for quick energy but might cause a crash. The oats and nuts are solid. <strong className="font-bold">Tradeoff:</strong> Convenient but sweeter than ideal."
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold shadow-lg">
                                        AI
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Why AI Co-Pilot Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-br from-teal-50 to-cyan-50 backdrop-blur-xl rounded-3xl p-6 border border-teal-200/50 shadow-lg"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <FiZap className="text-teal-600" />
                                <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                                    Why AI Co-Pilot?
                                </p>
                            </div>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                                I understand your <span className="font-semibold text-teal-700">intent</span>, not just keywords. Instead of showing you a database of "bad" ingredients, I explain what they mean for <em className="font-semibold">your</em> situation.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.button
                onClick={handleScrollToNext}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
                aria-label="Scroll to next section"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-xs font-medium text-gray-500 group-hover:text-emerald-600 transition-colors">
                        Scroll to explore
                    </span>
                    <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center border border-emerald-200 group-hover:border-emerald-400 group-hover:bg-emerald-50 transition-all">
                        <FiArrowDown className="text-2xl text-gray-600 group-hover:text-emerald-600 transition-colors" />
                    </div>
                </motion.div>
            </motion.button>
        </section>
    );
};

export default HeroOverview;
