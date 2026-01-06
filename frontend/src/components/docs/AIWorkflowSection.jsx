import { motion } from 'framer-motion';
import { FiCamera, FiUser, FiCpu, FiFileText, FiCheckCircle } from 'react-icons/fi';

const AIWorkflowSection = () => {
    const steps = [
        {
            icon: <FiCamera className="text-3xl" />,
            number: "01",
            title: "Image Capture & Vision AI",
            description: "You upload or scan a product image. Llama 4 Scout 17B Vision (running on Groq's LPU hardware) reads the ingredient list and nutritional information directly from the image—no traditional OCR needed.",
            tech: "Groq LPU, Llama 4 Scout 17B Vision"
        },
        {
            icon: <FiUser className="text-3xl" />,
            number: "02",
            title: "Health Profile Mapping",
            description: "Your health conditions (diabetes, hypertension, allergies) are converted to biochemical triggers. 'Diabetic' becomes 'watch glucose, fructose, glycemic impact'.",
            tech: "LangGraph State Machine, Clinical Mapping"
        },
        {
            icon: <FiCpu className="text-3xl" />,
            number: "03",
            title: "AI Analysis Engine",
            description: "Google Gemini analyzes each ingredient through your health lens. It evaluates risks, benefits, and tradeoffs specific to YOUR conditions and goals.",
            tech: "Google Gemini, LangChain, LangGraph"
        },
        {
            icon: <FiFileText className="text-3xl" />,
            number: "04",
            title: "Report Generation",
            description: "Results are compiled into a conversational report. Gemini dynamically generates a color code (green/yellow/red) based on how safe the product is for your situation.",
            tech: "Dynamic Color Coding, Custom Prompts"
        },
        {
            icon: <FiCheckCircle className="text-3xl" />,
            number: "05",
            title: "Smart Recommendations",
            description: "Based on flagged concerns, we suggest healthier alternatives that avoid your specific triggers while meeting your nutritional goals.",
            tech: "Alternative Search, Cross-Allergy Validation"
        }
    ];

    return (
        <section className="min-h-screen py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                        The AI Workflow
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        From photo to personalized health insights in seconds. Powered by LangGraph agent pipeline with Llama Vision + Gemini.
                    </p>
                </motion.div>

                <div className="space-y-0">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-8 py-10 border-b border-gray-200 last:border-b-0"
                        >
                            <div className="flex-shrink-0 w-24 text-center">
                                <span className="text-5xl font-black text-gray-200">{step.number}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="text-emerald-600">{step.icon}</span>
                                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                                </div>
                                <p className="text-gray-600 text-lg leading-relaxed mb-3">
                                    {step.description}
                                </p>
                                <p className="text-sm text-emerald-600 font-mono">
                                    {step.tech}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AIWorkflowSection;
