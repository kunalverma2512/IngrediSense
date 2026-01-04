import { motion } from 'framer-motion'
import { FiTarget, FiCpu, FiTrendingUp, FiShield, FiZap, FiHeart } from 'react-icons/fi'

const FeaturesSection = () => {
    const features = [
        {
            icon: FiTarget,
            title: 'Intent-First Interaction',
            description: 'Show or input ingredients naturally. Our AI infers what you care about without forms or filters.',
            color: 'from-emerald-500 to-teal-500',
        },
        {
            icon: FiCpu,
            title: 'Reasoning-Driven Insights',
            description: 'Get explanations that matter—why something is important, what tradeoffs exist, and where uncertainty remains.',
            color: 'from-teal-500 to-cyan-500',
        },
        {
            icon: FiTrendingUp,
            title: 'AI Co-Pilot Experience',
            description: 'Not a lookup tool—a true co-pilot that does cognitive work on your behalf and reduces decision fatigue.',
            color: 'from-cyan-500 to-blue-500',
        },
        {
            icon: FiShield,
            title: 'Honest Uncertainty',
            description: 'We communicate what we don\'t know. Transparent about limitations and evolving scientific guidance.',
            color: 'from-blue-500 to-indigo-500',
        },
        {
            icon: FiZap,
            title: 'Minimal Cognitive Load',
            description: 'Make decisions faster with clear, actionable insights instead of overwhelming data dumps.',
            color: 'from-indigo-500 to-purple-500',
        },
        {
            icon: FiHeart,
            title: 'Health-First Approach',
            description: 'Designed specifically for consumer health—translating complex ingredient science into human-level understanding.',
            color: 'from-purple-500 to-pink-500',
        },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-sm mb-4"
                    >
                        Why Choose IngrediSense
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
                    >
                        AI-Native Features That
                        <br />
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Transform Understanding
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                    >
                        Experience the next generation of ingredient analysis powered by advanced AI reasoning
                    </motion.p>
                </div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                        >
                            {/* Icon */}
                            <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover Gradient Border Effect */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default FeaturesSection
