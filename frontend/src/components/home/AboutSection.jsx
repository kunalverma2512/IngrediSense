import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

const AboutSection = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full font-semibold text-sm mb-4">
                            The Problem We Solve
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            The Consumer Health
                            <br />
                            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                Information Gap
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            Food labels are optimized for regulatory compliance, not human understanding.
                            Consumers are left to interpret long ingredient lists, unfamiliar chemical names,
                            and conflicting health guidance—all at the exact moment they're trying to make a decision.
                        </p>

                        {/* Problems List */}
                        <div className="space-y-4 mb-8">
                            {[
                                'Existing tools surface raw data instead of insights',
                                'High-friction manual input makes it impractical to use',
                                'AI is treated as an add-on, not the core interface',
                                'Users remain uncertain when they need clarity most',
                            ].map((problem, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <FiAlertCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                                    <p className="text-gray-700">{problem}</p>
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/about"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Learn More About Us
                        </Link>
                    </motion.div>

                    {/* Right Column - Solution Highlights */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-emerald-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    Our AI-Native Solution
                                </span>
                            </h3>
                            <div className="space-y-4">
                                {[
                                    'Interprets ingredients on your behalf—no manual entry',
                                    'Translates science into clear, human-level insights',
                                    'Communicates uncertainty honestly and intuitively',
                                    'Minimizes cognitive load at decision time',
                                ].map((solution, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <FiCheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                                        <p className="text-gray-700">{solution}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Callout Box */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                            <p className="text-gray-700 italic">
                                "We're not building a database browser or adding AI to an existing app.
                                We're reimagining the entire experience with AI as the interface itself."
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection
