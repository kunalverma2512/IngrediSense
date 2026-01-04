import { motion } from 'framer-motion';
import { FiCpu, FiMessageCircle, FiShield, FiZap, FiSearch, FiLayers } from 'react-icons/fi';

const ServicesPage = () => {
    const services = [
        {
            icon: <FiMessageCircle className="text-4xl" />,
            title: "Intent Interpretation",
            description: "I don't just read ingredients; I understand what you want. Tell me 'I'm pre-diabetic' or 'building muscle', and I'll filter the data through that specific lens.",
            color: "from-emerald-400 to-emerald-600"
        },
        {
            icon: <FiSearch className="text-4xl" />,
            title: "Contextual Translation",
            description: "Chemical names are confusing. I translate 'Pyridoxine Hydrochloride' to 'Vitamin B6' and tell you exactly why it's there and if you should care.",
            color: "from-teal-400 to-teal-600"
        },
        {
            icon: <FiLayers className="text-4xl" />,
            title: "Tradeoff Analysis",
            description: "No food is perfect. I explain the tradeoffs: 'This has high protein but high sodium.' I give you the full picture so you can make the decision.",
            color: "from-cyan-400 to-cyan-600"
        },
        {
            icon: <FiShield className="text-4xl" />,
            title: "Safety Checks",
            description: "While I'm not a doctor, I flag common allergens and controversial additives based on current research, always citing uncertainty where it exists.",
            color: "from-blue-400 to-blue-600"
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white -z-10" />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6">
                            What I Actually Do
                        </h1>
                        <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            No generic "AI magic." Here are the specific, concrete services I provide to help you shop smarter.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-12 pb-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-white rounded-3xl p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-10 rounded-bl-[100px] group-hover:scale-150 transition-transform duration-500`} />

                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {service.icon}
                                </div>

                                <h3 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {service.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Honest Limitations Section */}
            <section className="bg-gray-900 py-32 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl font-black mb-8 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                What I Will NOT Do
                            </h2>
                            <p className="text-xl text-gray-300 leading-relaxed mb-6">
                                Honesty is part of the service. I am programmed to NEVER:
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 p-1 bg-red-500/20 rounded-full text-red-500">
                                        <FiX />
                                    </div>
                                    <span className="text-lg text-gray-300">Give medical diagnoses or prescribe diets without professional oversight.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 p-1 bg-red-500/20 rounded-full text-red-500">
                                        <FiX />
                                    </div>
                                    <span className="text-lg text-gray-300">Tell you what to buy (I support decisions, I don't make them).</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 p-1 bg-red-500/20 rounded-full text-red-500">
                                        <FiX />
                                    </div>
                                    <span className="text-lg text-gray-300">Pretend to be 100% certain when the science is conflicting.</span>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gray-800 rounded-3xl p-10 border border-gray-700"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <FiZap className="text-4xl text-yellow-400" />
                                <h3 className="text-3xl font-bold">The "Co-Pilot" Promise</h3>
                            </div>
                            <p className="text-lg text-gray-300 leading-relaxed mb-8">
                                "A co-pilot doesn't fly the plane while the pilot sleeps. A co-pilot navigates, checks systems, and offers information so the pilot (YOU) can fly safely."
                            </p>
                            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-gray-400">
                                <span>My Input</span>
                                <span>Your Decision</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-black text-gray-900 mb-8">
                        Ready for a test flight?
                    </h2>
                    <p className="text-2xl text-gray-600 mb-12">
                        Try the intent-first analysis on the dashboard.
                    </p>
                    <a href="/dashboard">
                        <button className="px-12 py-5 bg-gray-900 text-white text-xl font-bold rounded-full hover:bg-gray-800 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1">
                            Go to Dashboard
                        </button>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
