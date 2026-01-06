import { motion } from 'framer-motion';

const TechStackSection = () => {
    const stacks = [
        {
            category: "Frontend",
            items: [
                { name: "React 19", desc: "Latest React with concurrent features" },
                { name: "Vite 7", desc: "Lightning-fast build tool" },
                { name: "TailwindCSS 4", desc: "Utility-first CSS framework" },
                { name: "Framer Motion", desc: "Production-ready animations" },
                { name: "React Router 7", desc: "Client-side routing" },
                { name: "Axios", desc: "Promise-based HTTP client" }
            ]
        },
        {
            category: "Node Server",
            items: [
                { name: "Express 5", desc: "Fast, minimalist web framework" },
                { name: "MongoDB", desc: "Document database for user data" },
                { name: "Mongoose", desc: "MongoDB object modeling" },
                { name: "JWT", desc: "Secure token authentication" },
                { name: "bcrypt", desc: "Password hashing" },
                { name: "Helmet", desc: "Security headers middleware" }
            ]
        },
        {
            category: "AI Server",
            items: [
                { name: "FastAPI", desc: "Modern Python web framework" },
                { name: "LangGraph", desc: "AI agent state machine" },
                { name: "LangChain", desc: "LLM application framework" },
                { name: "Groq + Llama 4 Scout", desc: "17B Vision model for label reading" },
                { name: "Google Gemini", desc: "Health analysis & recommendations" },
                { name: "Pillow", desc: "Image processing library" }
            ]
        }
    ];

    return (
        <section className="min-h-screen py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                        Technology Stack
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Built with modern, production-ready technologies. Dual AI model architecture for speed and accuracy.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-gray-200">
                    {stacks.map((stack, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-200 last:border-r-0 last:border-b-0"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                {stack.category}
                            </h3>
                            <div className="space-y-4">
                                {stack.items.map((item, itemIdx) => (
                                    <div key={itemIdx}>
                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechStackSection;
