import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCpu, FiZap, FiShield } from 'react-icons/fi';

const DocsPage = () => {
    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-6">
                        How I Think
                    </h1>
                    <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
                        Behind the scenes of your AI shopping companion
                    </p>
                </motion.div>

                {/* The Philosophy */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-16"
                >
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">My Philosophy</h2>
                    <p className="text-xl text-gray-700 leading-relaxed mb-8">
                        I'm not a food database app with AI slapped on. I'm built from the ground up to understand your intent and reduce the mental load of reading ingredient lists while shopping.
                    </p>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border-2 border-emerald-200">
                        <h3 className="text-3xl font-bold text-emerald-900 mb-4">Intent-First, Not Filter-First</h3>
                        <p className="text-lg text-gray-800 mb-4">
                            Traditional apps make you set filters ("low sodium," "organic," "gluten-free") before you even start. That's backwards.
                        </p>
                        <p className="text-lg text-gray-800">
                            I listen to what you're trying to do—"stay energized," "feed my kids," "manage diabetes"—and interpret ingredients through that lens. Your intent shapes my answer.
                        </p>
                    </div>
                </motion.section>

                {/* How I Reason */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                >
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">How I Reason</h2>

                    <div className="space-y-8">
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FiCpu className="text-emerald-600 text-xl" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">1. I Read the Label</h3>
                            </div>
                            <p className="text-lg text-gray-700 mb-4">
                                When you show me a product, I extract the ingredient list and nutritional info. I use OCR (reading text from images) to get the data.
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Tech note:</strong> This is standard computer vision, not the interesting part.
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FiZap className="text-teal-600 text-xl" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">2. I Understand Your Intent</h3>
                            </div>
                            <p className="text-lg text-gray-700 mb-4">
                                This is where AI co-pilot thinking happens. "Is this okay for my kid?" means different things than "Will this help me build muscle?"
                            </p>
                            <div className="bg-teal-50 rounded-lg p-6 mt-4">
                                <p className="font-semibold text-teal-900 mb-3">Example Reasoning:</p>
                                <div className="space-y-2 text-sm text-gray-800">
                                    <p>• You asked about kids → I prioritize sugar content, artificial colors, allergens</p>
                                    <p>• You asked about muscle → I look at protein quality, BCAAs, digestibility</p>
                                    <p>• You asked about diabetes → I focus on glycemic impact, fiber, sugar types</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-cyan-600 text-2xl font-bold">?</span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">3. I Explain What Matters</h3>
                            </div>
                            <p className="text-lg text-gray-700 mb-4">
                                I don't dump the whole database on you. I pick out what's relevant to your question and explain it in plain language.
                            </p>
                            <div className="space-y-4">
                                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                                    <p className="text-sm font-semibold text-green-900 mb-1">Good:</p>
                                    <p className="text-sm text-gray-800">"The 12g sugar here is from fruit concentrate, not added sugar. Still sweet, but comes with fiber that slows absorption."</p>
                                </div>
                                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                    <p className="text-sm font-semibold text-red-900 mb-1">Bad:</p>
                                    <p className="text-sm text-gray-800">"Contains 12g sugar. Sugar is classified as a simple carbohydrate (monosaccharide/disaccharide). Daily value: 24%. Glycemic index: 65..."</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 text-2xl">⚖️</span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">4. I Show the Tradeoffs</h3>
                            </div>
                            <p className="text-lg text-gray-700 mb-4">
                                Every ingredient has context. High protein might mean high sodium. Organic might cost more. I spell it out.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-700">
                                    "This has more protein than Brand X (good for muscle recovery) but also 300mg more sodium (watch if you have high blood pressure). Your call."
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* What I Know (and Don't) */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16"
                >
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">What I Know (and Don't)</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                            <h3 className="text-2xl font-bold text-emerald-900 mb-3">I Know About:</h3>
                            <ul className="space-y-2 text-gray-800">
                                <li>• Common ingredients and their functions</li>
                                <li>• Nutritional science basics</li>
                                <li>• Food additives and preservatives</li>
                                <li>• Allergens and sensitivities</li>
                                <li>• Processing methods</li>
                                <li>• When research is limited/conflicting</li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                            <h3 className="text-2xl font-bold text-amber-900 mb-3">I Don't:</h3>
                            <ul className="space-y-2 text-gray-800">
                                <li>• Give medical advice (ask your doctor)</li>
                                <li>• Claim to know everything</li>
                                <li>• Pretend uncertainty doesn't exist</li>
                                <li>• Make absolute good/bad judgments</li>
                                <li>• Replace personal context/preferences</li>
                            </ul>
                        </div>
                    </div>
                </motion.section>

                {/* Privacy */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-16 bg-gray-50 rounded-2xl p-8"
                >
                    <div className="flex items-start gap-4 mb-4">
                        <FiShield className="text-4xl text-teal-600 flex-shrink-0" />
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Privacy & Data</h2>
                            <div className="space-y-4 text-lg text-gray-700">
                                <p>
                                    <strong className="text-teal-800">Your conversations are private.</strong> I don't sell your data or share what you scan.
                                </p>
                                <p>
                                    <strong className="text-teal-800">I learn from usage.</strong> Anonymized patterns (not your specific scans) help me get better at understanding intent.
                                </p>
                                <p>
                                    <strong className="text-teal-800">You're in control.</strong> You can delete your account and all data anytime.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-white"
                >
                    <h2 className="text-4xl font-bold mb-4">Questions?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        The best way to understand how I work is to try me out.
                    </p>
                    <Link to="/dashboard">
                        <button className="px-10 py-4 bg-white text-emerald-700 text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all">
                            Go to Dashboard →
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default DocsPage;
