import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ServicesCTA = () => {
    return (
        <section className="py-32 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                        Try It Yourself
                    </h2>
                    <p className="text-xl text-gray-600 mb-12">
                        No signup walls. Just scan a product and see how it works.
                    </p>
                    <Link to="/scan">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-3 px-12 py-5 bg-gray-900 text-white text-xl font-bold hover:bg-gray-800 transition-colors"
                        >
                            Scan a Product
                            <FiArrowRight className="text-xl" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ServicesCTA;
