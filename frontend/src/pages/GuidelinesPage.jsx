import { motion } from 'framer-motion';
import { FiMessageCircle, FiHeart, FiAlertCircle, FiZap, FiTarget, FiTrendingUp, FiShield, FiChevronDown } from 'react-icons/fi';

const GuidelinesPage = () => {
    return (
        <div className="bg-white">
            {/* Section 1: Hero */}
            <section className="min-h-screen flex items-center justify-center relative pt-20">
                <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="text-emerald-600 font-semibold text-lg mb-4 uppercase tracking-wider">Complete Guide</p>
                        <h1 className="text-7xl md:text-9xl font-black text-gray-900 mb-8 leading-none">
                            How to Get the<br />Most from Me
                        </h1>
                        <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                            I'm your AI shopping companion. Here's everything you need to know to have better conversations about food.
                        </p>
                    </motion.div>
                </div>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <FiChevronDown className="text-4xl text-gray-400" />
                </motion.div>
            </section>

            {/* Section 2: The Foundation - How to Talk to Me */}
            <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-6xl font-black text-gray-900 mb-6 leading-tight">
                                Just Talk,<br />Naturally
                            </h2>
                            <p className="text-xl text-gray-700 leading-relaxed mb-8">
                                I'm not a search engine. I'm a conversation partner. Talk to me like you'd ask a knowledgeable friend standing in the grocery aisle with you.
                            </p>
                            <div className="bg-emerald-50 rounded-xl p-6 border-l-4 border-emerald-500">
                                <p className="text-lg font-semibold text-emerald-900 mb-3">The key difference:</p>
                                <p className="text-gray-800 mb-3">
                                    ❌ Database app: "Low sugar protein bars near me"
                                </p>
                                <p className="text-gray-800">
                                    ✅ AI co-pilot: "I need protein after workouts but I'm trying to cut sugar—is this bar good?"
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                                <div className="flex items-start gap-4">
                                    <FiMessageCircle className="text-3xl text-emerald-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-lg text-gray-800 font-semibold mb-2">"Is this cereal okay for my 5-year-old?"</p>
                                        <p className="text-gray-600 mb-3">
                                            → I'll check sugar (kids need less than 12g/serving), artificial colors (some link to hyperactivity), and whether it's actually filling.
                                        </p>
                                        <p className="text-sm text-teal-700">
                                            <strong>Why this works:</strong> You told me the "who" and the "why"—I adapt my answer.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                                <div className="flex items-start gap-4">
                                    <FiMessageCircle className="text-3xl text-teal-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-lg text-gray-800 font-semibold mb-2">"I'm prediabetic—should I buy this bread?"</p>
                                        <p className="text-gray-600 mb-3">
                                            → I'll look at the glycemic impact (whole grain vs. refined), fiber content, and whether it'll spike your blood sugar.
                                        </p>
                                        <p className="text-sm text-teal-700">
                                            <strong>The tradeoff:</strong> Whole grain = slower digestion = better for blood sugar, but some people don't like the taste.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 3: Understanding Intent */}
            <section className="min-h-screen bg-white flex items-center py-20">
                <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-7xl font-black text-gray-900 mb-8">
                            Tell Me Your "Why"
                        </h2>
                        <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
                            The same ingredient means different things depending on your goal. Context is everything.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <FiTarget className="text-4xl text-emerald-600" />
                                <h3 className="text-2xl font-bold text-gray-900">Your Goal Shapes My Answer</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-gray-900 mb-2">Same product, different contexts:</p>
                                    <div className="space-y-3 text-sm">
                                        <div className="bg-white rounded-lg p-4">
                                            <p className="font-semibold text-emerald-800">🏋️ "Building muscle"</p>
                                            <p className="text-gray-700">→ I focus on protein quality, BCAAs, timing</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4">
                                            <p className="font-semibold text-teal-800">👶 "For my toddler"</p>
                                            <p className="text-gray-700">→ I check sugar, allergens, choking hazards</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4">
                                            <p className="font-semibold text-cyan-800">💰 "On a budget"</p>
                                            <p className="text-gray-700">→ I explain if premium versions actually matter</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                <p className="text-lg font-semibold text-gray-900 mb-3">What I need to know:</p>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start gap-3">
                                        <span className="text-emerald-600 font-bold flex-shrink-0">•</span>
                                        <span><strong>Who it's for:</strong> You, kids, elderly parents, pets (yes, really)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-teal-600 font-bold flex-shrink-0">•</span>
                                        <span><strong>Health context:</strong> Diabetes, allergies, IBS, pregnancy, etc.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-cyan-600 font-bold flex-shrink-0">•</span>
                                        <span><strong>Your goal:</strong> Weight loss, energy, muscle gain, gut health</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                                        <span><strong>Constraints:</strong> Budget, taste preferences, cooking time</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
                                <p className="text-amber-900 font-semibold mb-2">💡 Pro tip:</p>
                                <p className="text-gray-800">
                                    The more context you give me, the better I can help. "Is this healthy?" is vague. "Is this healthy for someone with high blood pressure?" is actionable.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 4: What I'll Tell You */}
            <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-7xl font-black text-gray-900 mb-6 text-center">
                            What You'll Get from Me
                        </h2>
                    </motion.div>

                    <div className="space-y-12">
                        {/* Tradeoffs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
                        >
                            <div className="lg:col-span-1">
                                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                                    <span className="text-3xl">⚖️</span>
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-4">The Tradeoffs</h3>
                                <p className="text-lg text-gray-700">
                                    Every food choice has pros and cons. I spell them out honestly.
                                </p>
                            </div>
                            <div className="lg:col-span-2 space-y-4">
                                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-emerald-500">
                                    <p className="text-lg text-gray-800 mb-3">
                                        <strong>"This protein bar has 20g protein (great!) but 18g sugar (not ideal)."</strong>
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>The tradeoff:</strong> Perfect post-workout for quick energy + recovery, but too sweet for an everyday snack. If you're cutting sugar, look elsewhere.
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500">
                                    <p className="text-lg text-gray-800 mb-3">
                                        <strong>"Organic costs 2x more. Is it worth it?"</strong>
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>The tradeoff:</strong> Fewer pesticides (good), but ingredient quality is the same. If budget is tight, prioritize whole foods over the organic label.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Uncertainty */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
                        >
                            <div className="lg:col-span-1">
                                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                                    <FiAlertCircle className="text-4xl text-amber-600" />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-4">When I Don't Know</h3>
                                <p className="text-lg text-gray-700">
                                    Nutrition science isn't black and white. I'll tell you when data is limited.
                                </p>
                            </div>
                            <div className="lg:col-span-2 space-y-4">
                                <div className="bg-amber-50 rounded-xl p-6 shadow-lg border-2 border-amber-300">
                                    <p className="text-lg text-gray-800 mb-3">
                                        <strong>"Is carrageenan safe?"</strong>
                                    </p>
                                    <p className="text-gray-700 mb-3">
                                        → It's approved by regulators, but some studies suggest it might trigger gut inflammation in sensitive people.
                                    </p>
                                    <p className="text-amber-900 font-semibold">
                                        <FiAlertCircle className="inline" /> Honesty: Data is limited and conflicting. Most people are fine, but if you have IBS or inflammatory bowel disease, you might want to avoid it.
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <p className="text-sm text-gray-700">
                                        <strong>Why this matters:</strong> I won't pretend to have all the answers. Uncertainty is part of science, and you deserve to know when we're in gray areas.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Plain Language */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
                        >
                            <div className="lg:col-span-1">
                                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
                                    <FiMessageCircle className="text-4xl text-teal-600" />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-4">Plain Language</h3>
                                <p className="text-lg text-gray-700">
                                    No jargon, no chemical formulas. Just simple explanations.
                                </p>
                            </div>
                            <div className="lg:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                                        <p className="text-sm font-semibold text-red-900 mb-3">❌ Database Dump:</p>
                                        <p className="text-sm text-gray-700">
                                            "Contains maltodextrin (polysaccharide, GI: 110, rapidly hydrolyzed glucose polymer)"
                                        </p>
                                    </div>
                                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                                        <p className="text-sm font-semibold text-green-900 mb-3">✅ AI Co-pilot:</p>
                                        <p className="text-sm text-gray-700">
                                            "Maltodextrin spikes blood sugar faster than table sugar. Skip if you're managing diabetes."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 5: What I Won't Do */}
            <section className="min-h-screen bg-white flex items-center py-20">
                <div className="max-w-5xl mx-auto px-6 lg:px-12 w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-7xl font-black text-gray-900 mb-12">
                            What I Won't Do
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
                                <h3 className="text-3xl font-bold text-red-900 mb-4">❌ Give Health Scores</h3>
                                <p className="text-lg text-gray-700 mb-3">
                                    Food isn't pass/fail. A "bad" score on ice cream is useless—of course it's not health food, but that doesn't mean never eat it.
                                </p>
                                <p className="text-gray-600">
                                    Instead: I explain what's in it and let you decide if it fits your situation.
                                </p>
                            </div>

                            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
                                <h3 className="text-3xl font-bold text-red-900 mb-4">❌ Make Decisions for You</h3>
                                <p className="text-lg text-gray-700 mb-3">
                                    I won't say "buy this" or "avoid that." Your life, your preferences, your choice.
                                </p>
                                <p className="text-gray-600">
                                    Instead: I give you the information to make an informed decision.
                                </p>
                            </div>

                            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
                                <h3 className="text-3xl font-bold text-red-900 mb-4">❌ Dump Research Papers</h3>
                                <p className="text-lg text-gray-700 mb-3">
                                    You're not here to read studies. You're here to make a quick decision in the store.
                                </p>
                                <p className="text-gray-600">
                                    Instead: I translate the science into what it means for you, right now.
                                </p>
                            </div>

                            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
                                <h3 className="text-3xl font-bold text-red-900 mb-4">❌ Pretend Perfection Exists</h3>
                                <p className="text-lg text-gray-700 mb-3">
                                    There's no "perfect" food. Everything has context, tradeoffs, and uncertainty.
                                </p>
                                <p className="text-gray-600">
                                    Instead: I'm honest about what we know, what we don't, and what matters most.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Continue in next message due to length... */}
        </div>
    );
};

export default GuidelinesPage;
