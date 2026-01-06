import { motion } from 'framer-motion';

const FeaturesSection = () => {
    const features = [
        {
            title: "OCR Label Extraction",
            description: "Upload any food product image and our computer vision system extracts ingredient lists and nutritional information automatically."
        },
        {
            title: "Health Profile Integration",
            description: "Your medical conditions, allergies, and dietary goals are stored securely. Every analysis is filtered through your unique health context."
        },
        {
            title: "Intent-First Analysis",
            description: "Tell us what you care about—'Is this good for my diabetes?' or 'Safe for my gluten-intolerant kid?'—and we analyze accordingly."
        },
        {
            title: "Clinical Evidence Search",
            description: "We search real clinical databases and regulatory sources to back up our assessments with actual research."
        },
        {
            title: "Risk Color Coding",
            description: "Gemini dynamically generates a color code based on how safe the product is for YOUR specific situation. Green = go, Yellow = caution, Red = skip."
        },
        {
            title: "Alternative Suggestions",
            description: "When we flag concerns, we don't just say 'avoid this.' We suggest similar products that work better for your health profile."
        },
        {
            title: "No False Certainty",
            description: "When science is unclear or research is limited, we say so. We never pretend to know more than we do."
        },
        {
            title: "Tradeoff Transparency",
            description: "Every food has pros and cons. We show both—high protein but high sodium, organic but expensive—so you can decide."
        }
    ];

    return (
        <section className="min-h-screen py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                        Core Features
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Everything you need to make informed food choices, powered by AI.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-8 bg-white border-t border-l border-gray-200 md:[&:nth-child(-n+2)]:border-t-0 first:border-t-0 md:odd:border-l-0"
                        >
                            <span className="text-5xl font-black text-gray-100">{String(idx + 1).padStart(2, '0')}</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 -mt-4">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
