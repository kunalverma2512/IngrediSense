import { motion } from 'framer-motion';
import { FiArrowDown, FiZap, FiCpu, FiShield } from 'react-icons/fi';

const DocsHero = () => {
    const handleScrollToNext = () => {
        const heroSection = document.getElementById('docs-hero');
        if (heroSection) {
            const nextSection = heroSection.nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const highlights = [
        { icon: <FiZap />, label: "Llama 4 Scout", desc: "17B Vision Model" },
        { icon: <FiCpu />, label: "Google Gemini", desc: "Health analysis engine" },
        { icon: <FiShield />, label: "Personalized", desc: "Context-aware insights" }
    ];

    return (
        <section
            id="docs-hero"
            className="min-h-screen flex items-center justify-center relative pt-20 bg-gradient-to-br from-gray-50 to-white"
        >
            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-6">
                            Technical Documentation
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-none">
                            How<br />It Works
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed mb-6 max-w-lg">
                            A three-tier AI system that reads food labels using Llama Vision,
                            understands your health context, and explains what matters to you.
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                            {highlights.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.1 }}
                                    className="flex items-center gap-3 px-4 py-3 bg-white shadow-sm"
                                >
                                    <span className="text-emerald-600">{item.icon}</span>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side - Architecture Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <div className="bg-gray-900 text-white p-8 font-mono text-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                <span className="ml-4 text-gray-400">system_architecture.md</span>
                            </div>
                            <pre className="text-gray-300 leading-relaxed">
                                {`┌─────────────────────────────────┐
│     React Frontend              │
│     Port: 5173                  │
└──────────────┬──────────────────┘
               │
     ┌─────────┴─────────┐
     │                   │
     ▼                   ▼
┌─────────────┐   ┌─────────────┐
│  Node.js    │   │  FastAPI    │
│  Auth Server│   │  AI Server  │
│  Port: 8080 │   │  Port: 8000 │
└──────┬──────┘   └──────┬──────┘
       │                 │
       ▼                 ▼
   MongoDB          Groq + Gemini
   (Users)          (AI Models)`}
                            </pre>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.button
                onClick={handleScrollToNext}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-xs font-medium text-gray-500 group-hover:text-emerald-600 transition-colors">
                        Explore architecture
                    </span>
                    <div className="w-12 h-12 bg-white shadow-md flex items-center justify-center group-hover:bg-emerald-50 transition-all">
                        <FiArrowDown className="text-2xl text-gray-600 group-hover:text-emerald-600 transition-colors" />
                    </div>
                </motion.div>
            </motion.button>
        </section>
    );
};

export default DocsHero;
