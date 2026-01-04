import { motion } from 'framer-motion';
import { FiCpu, FiUsers, FiTarget, FiZap, FiCode, FiAward } from 'react-icons/fi';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Section 1: Introduction */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto mb-20"
                    >
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-semibold mb-6">
                            <FiAward /> ENCODE 2026 Project
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
                            A Health Co-Pilot,<br />
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Not Just a Database.
                            </span>
                        </h1>
                        <p className="text-2xl text-gray-600 leading-relaxed">
                            We built IngrediSense for the ENCODE 2026 Hackathon at IIT Guwahati. Our goal? To move beyond static food labels and build an AI that understands <i>your</i> context.
                        </p>
                    </motion.div>

                    {/* Mission Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                        {[
                            {
                                icon: FiTarget,
                                title: "Intent-First",
                                desc: "Most apps just dump data. We start with your goal ('I'm diabetic', 'building muscle') and filter everything through that lens."
                            },
                            {
                                icon: FiCpu,
                                title: "Thinking AI",
                                desc: "We don't just match keywords. We use LLMs to reason about ingredients, additives, and their combined effects on your specific physiology."
                            },
                            {
                                icon: FiZap,
                                title: "Zero Fluff",
                                desc: "No corporate jargon. No hidden agendas. Just honest analysis of what's in your food, including the uncertain stuff."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all border border-gray-100"
                            >
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-2xl mb-6">
                                    <item.icon />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 2: The Tech (Honest) */}
            <section className="bg-gray-900 text-white py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black mb-8">
                                Under the Hood
                            </h2>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                                This isn't a pre-baked database of products. It's a live reasoning engine.
                            </p>
                            <div className="space-y-6">
                                {[
                                    "Real-time OCR for reading labels",
                                    "LLM-based context analysis",
                                    "Dynamic risk/benefit weighting",
                                    "Honest uncertainty flagging"
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                            <FiCode />
                                        </div>
                                        <span className="text-lg font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
                            <pre className="font-mono text-sm text-emerald-400 overflow-x-auto">
                                {`// Our Core Philosophy
const analyzeFood = (ingredients, userContext) => {
  
  // 1. Understand the goal
  const goal = parseIntent(userContext);
  
  // 2. Analyze tradeoffs
  const risks = findRisks(ingredients, goal);
  const benefits = findBenefits(ingredients, goal);
  
  // 3. Honest Conclusion
  return {
    verdict: calculateVerdict(risks, benefits),
    uncertainty: flagMissingData(),
    advice: generateHumanAdvice()
  };
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: The Team */}
            <section className="py-32 bg-emerald-50/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                        Built by Builders
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
                        We are a team of students and developers participating in ENCODE 2026, passionate about applying AI to real-world health problems.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {/* Team Placeholder 1 */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">👨‍💻</div>
                            <h3 className="text-xl font-bold mb-2">Frontend & UX</h3>
                            <p className="text-emerald-600 font-medium">React & AI Integration</p>
                        </div>
                        {/* Team Placeholder 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">🚀</div>
                            <h3 className="text-xl font-bold mb-2">Backend & Logic</h3>
                            <p className="text-emerald-600 font-medium">Node.js & LLM Ops</p>
                        </div>
                        {/* Team Placeholder 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">🎨</div>
                            <h3 className="text-xl font-bold mb-2">Design & Product</h3>
                            <p className="text-emerald-600 font-medium">Strategy & Analysis</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
