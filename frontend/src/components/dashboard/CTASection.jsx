import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <section className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center py-20 text-white">
            <div className="max-w-5xl mx-auto px-6 lg:px-12 w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 md:mb-8 leading-tight">
                        Let's Make<br />Shopping Easier
                    </h2>
                    <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
                        Next time you're holding a product wondering "Is this okay?", just ask me. I'll give you an honest, intent-driven answer—no filters, no scores, no BS.
                    </p>
                    <Link to="/scan">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-4 md:px-12 md:py-5 bg-white text-emerald-700 text-xl md:text-2xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all"
                        >
                            Try It Now →
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
