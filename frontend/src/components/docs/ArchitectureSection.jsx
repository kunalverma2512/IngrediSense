import { motion } from 'framer-motion';

const ArchitectureSection = () => {
    const components = [
        {
            name: "React Frontend",
            port: "5173",
            tech: "React 19 + Vite + TailwindCSS",
            description: "Modern, responsive user interface. Handles authentication, health profile management, product scanning, and displays AI analysis results.",
            color: "emerald"
        },
        {
            name: "Node.js Server",
            port: "8080",
            tech: "Express + MongoDB + JWT",
            description: "Authentication backend. Manages user accounts, stores health profiles with conditions and allergies, handles secure session management.",
            color: "blue"
        },
        {
            name: "FastAPI AI Server",
            port: "8000",
            tech: "FastAPI + LangGraph + Gemini",
            description: "The brain. Runs the AI health agent workflow—OCR processing, ingredient analysis, risk assessment, and personalized recommendations.",
            color: "purple"
        }
    ];

    return (
        <section className="min-h-screen flex items-center py-20 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-6 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-black mb-6">
                        Three-Tier Architecture
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Three specialized servers working together to deliver intelligent health analysis.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {components.map((comp, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gray-800 p-8 hover:bg-gray-750 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`w-3 h-3 rounded-full bg-${comp.color}-500`}></span>
                                <span className="text-sm text-gray-400 font-mono">:{comp.port}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{comp.name}</h3>
                            <p className="text-sm text-emerald-400 font-mono mb-4">{comp.tech}</p>
                            <p className="text-gray-400 leading-relaxed">{comp.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-4 text-gray-500">
                        <span className="w-16 h-px bg-gray-700"></span>
                        <span className="text-sm">Data flows seamlessly between all three</span>
                        <span className="w-16 h-px bg-gray-700"></span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ArchitectureSection;
