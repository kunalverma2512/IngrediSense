import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiArrowDown, FiMessageCircle, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import HealthBanner from '../components/profile/HealthBanner';

const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className="bg-white pt-16">
            <HealthBanner />
            {/* Section 1: Hero - Your AI Shopping Companion */}
            <section className="min-h-screen flex items-center justify-center relative pt-12"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <p className="text-emerald-600 font-semibold text-lg mb-4">YOUR AI SHOPPING COMPANION</p>
                            <h1 className="text-7xl md:text-8xl font-black text-gray-900 mb-6 leading-none">
                                Hey, {user?.name}!
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                                I'm your AI co-pilot for making sense of ingredients while you shop. No jargon, no filters—just honest answers about what you're about to eat.
                            </p>
                            <p className="text-lg text-gray-700 mb-12 leading-relaxed">
                                <strong className="text-emerald-700">How it works:</strong> Show me a product, tell me what you care about (staying energized? Avoiding sugar? Feeding kids?), and I'll explain what's really inside—with the tradeoffs.
                            </p>
                            <Link to="/scan">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3"
                                >
                                    <FiMessageCircle className="text-2xl" />
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
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-200">
                                <p className="text-sm text-emerald-700 font-semibold mb-3">EXAMPLE CONVERSATION</p>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                                        <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
                                            <p className="text-gray-800">"Is this granola bar okay for my kid's lunchbox?"</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                        <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-none p-4 shadow-sm max-w-md">
                                            <p>"It has 12g sugar—about 3 teaspoons. Good for quick energy but might cause a crash. The oats and nuts are solid. <strong>Tradeoff:</strong> Convenient but sweeter than ideal."</p>
                                        </div>
                                        <div className="w-8 h-8 bg-emerald-600 rounded-full flex-shrink-0"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-6 border border-teal-200">
                                <p className="text-sm text-teal-700 font-semibold mb-2">WHY AI CO-PILOT?</p>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    I understand your intent, not just keywords. Instead of showing you a database of "bad" ingredients, I explain what they mean for <em>your</em> situation.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <FiArrowDown className="text-4xl text-gray-400" />
                </motion.div>
            </section>

            {/* Section 2: What I Help With */}
            <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
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
                            <h2 className="text-6xl font-black text-gray-900 mb-8 leading-tight">
                                I Interpret,<br />You Decide
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
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
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                            >
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">"Is this better for my diabetes?"</h3>
                                    <p className="text-gray-600 leading-relaxed mb-3">
                                        I'll look at sugar types, fiber content, and glycemic impact—then explain the tradeoffs in terms you understand.
                                    </p>
                                    <p className="text-sm text-teal-700">
                                        <strong>Not:</strong> "This has 15g carbs." <strong>But:</strong> "The fiber here slows sugar absorption. Better than white bread, but still watch portions."
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                            >
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">"Is this additive safe?"</h3>
                                    <p className="text-gray-600 leading-relaxed mb-3">
                                        I'll translate the science and tell you what we know, what we don't, and who might want to avoid it.
                                    </p>
                                    <p className="text-sm text-amber-700">
                                        <strong>Honesty:</strong> "Carrageenan is approved, but some studies suggest gut inflammation. Limited data. Most people are fine, but skip if you have IBS."
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                            >
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">"Should I pay more for organic?"</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        I'll compare ingredients between versions and explain if the premium actually matters for what you care about (pesticides? nutrition? taste?).
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: How I Work */}
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
                        <h2 className="text-7xl font-black text-gray-900 mb-12">
                            How I Help
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
                            You're standing in the aisle, phone in hand. Here's what happens:
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                <span className="text-5xl font-black text-white">1</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Show Me</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Snap the ingredients list or barcode. I'll read it instantly.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                <span className="text-5xl font-black text-white">2</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Tell Me Why</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                "Trying to cut sugar" or "Need protein for gym"—I adapt to your goal.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                <span className="text-5xl font-black text-white">3</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Get the Truth</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Plain language answer with tradeoffs, not a score. You decide.
                            </p>
                        </motion.div>
                    </div>

                    <div className="mt-16 bg-gray-50 rounded-2xl p-8 max-w-3xl mx-auto text-left">
                        <p className="text-sm text-gray-600 mb-3">
                            <FiZap className="inline text-emerald-600" /> <strong>Why this works:</strong>
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            I reduce cognitive load by interpreting ingredients based on your situation. No database browsing, no endless scrolling. Just: "Here's what matters, here's the tradeoff, your call."
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 4: CTA */}
            <section className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center py-20 text-white">
                <div className="max-w-5xl mx-auto px-6 lg:px-12 w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-7xl md:text-8xl font-black mb-8 leading-none">
                            Let's Make<br />Shopping Easier
                        </h2>
                        <p className="text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
                            Next time you're holding a product wondering "Is this okay?", just ask me. I'll give you an honest, intent-driven answer—no filters, no scores, no BS.
                        </p>
                        <Link to="/scan">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-12 py-6 bg-white text-emerald-700 text-2xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all"
                            >
                                Try It Now →
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;
