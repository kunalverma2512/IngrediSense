import { motion } from 'framer-motion';
import { useEffect } from 'react';

const AboutPage = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Section 1: Hero & Introduction */}
            <section className="min-h-screen flex items-center pt-20 pb-16 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-6">
                            About IngrediSense
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
                            A Health Co-Pilot,<br />
                            <span className="text-emerald-600">Not Just a Database.</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed">
                            IngrediSense was built for the ENCODE 2026 Hackathon at IIT Guwahati with a simple belief:
                            food labels shouldn't require a chemistry degree to understand. Most nutrition apps dump data on you—calories,
                            percentages, ingredient lists—and leave you to figure it out. We took a different approach. Instead of
                            starting with the product, we start with you. Tell us your goal, your conditions, your concerns, and we'll
                            filter everything through that lens. We don't give you a "health score" or a green/red label. We give you
                            context. We explain tradeoffs. We admit when science is uncertain. Because making good food choices isn't
                            about following rules—it's about understanding what you're actually eating.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Our Philosophy */}
            <section className="min-h-screen flex items-center py-16 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8">
                            Our Philosophy
                        </h2>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
                            We believe you're smart enough to make your own decisions. You don't need an app telling you what to buy
                            or what to avoid. What you need is clear, honest information—presented in plain language, filtered through
                            your specific situation. That's why we built IngrediSense as a "co-pilot" rather than an "authority."
                            A co-pilot doesn't fly the plane while the pilot sleeps. A co-pilot navigates, checks instruments,
                            and provides information so the pilot can make informed decisions. That's us. We read the label,
                            we cross-reference your health profile, we explain what each ingredient means for someone in your situation,
                            and then we step back. The decision is always yours.
                        </p>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed">
                            We also believe in honesty over certainty. Nutrition science is messy. Studies contradict each other.
                            What's "bad" today might be "fine" tomorrow. Rather than pretend we have all the answers, we tell you
                            when the evidence is mixed or when more research is needed. That might feel less satisfying than a
                            definitive "eat this, not that" verdict, but it's more truthful. And truth, in the long run, is more
                            useful than false confidence.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Section 3: The Mission */}
            <section className="min-h-screen flex items-center py-16 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-8">
                            The Mission
                        </h2>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed mb-8">
                            Our mission is simple: make ingredient information accessible to everyone, regardless of their
                            scientific background. We use advanced AI not to replace human judgment, but to augment it.
                            When you scan a product, Llama 4 Scout Vision reads the label in milliseconds. Google Gemini
                            analyzes each ingredient against your health profile. The result is a personalized breakdown
                            that would take a human nutritionist hours to produce—delivered in seconds, on your phone,
                            while you're standing in the grocery aisle.
                        </p>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed">
                            We don't sell your data. We don't push products. We don't have sponsors paying us to
                            recommend their brands. Our only agenda is helping you understand what's in your food.
                            Whether you're managing a chronic condition, avoiding allergens, feeding your family,
                            or just curious about what "natural flavors" actually means—we're here to translate
                            the label into something you can actually use.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
