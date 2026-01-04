import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

const FAQPage = () => {
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (id) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const allQuestions = [
        // Getting Started
        { q: "What is IngrediSense?", a: "IngrediSense is an AI-native shopping companion that helps you understand food ingredients at decision time. Unlike traditional apps with nutrition databases, I'm built as a conversational co-pilot that interprets ingredients based on your specific context and goals." },
        { q: "How do I start using it?", a: "Simple: Take a photo of any product's ingredient list, tell me what you care about (e.g., 'trying to cut sugar' or 'feeding my toddler'), and I'll explain what matters in plain language. No setup, no filters, no complicated menus." },
        { q: "Is this a finished product?", a: "No—this is a hackathon prototype for ENCODE 2026. The core AI co-pilot concept works, but features like OCR and full ingredient database are placeholders. We're demonstrating the AI-native experience, not building production software." },

        // How AI Works
        { q: "What makes this 'AI-native'?", a: "Traditional apps make you set filters first, then show results. I work backwards: you tell me your intent (natural language), and I interpret ingredients through that lens. The AI isn't added on—it's the core interface." },
        { q: "Do you use ChatGPT or similar models?", a: "For this hackathon prototype, we're demonstrating the conversational UX pattern. In production, we'd use fine-tuned models trained on nutrition data, but the key innovation is the intent-first approach, not the specific AI model." },
        { q: "How do you know what I mean?", a: "I look for context clues in your question: Who it's for (kids vs. athletes), health conditions (diabetes, allergies), and goals (weight loss, energy). The same ingredient gets different explanations based on your situation." },

        // Understanding Responses
        { q: "Why don't you give health scores?", a: "Scores are misleading. A 'bad' score on ice cream is useless—of course it's not health food. Instead, I explain what's in it and let YOU decide if it fits your life. Food isn't pass/fail; it's about tradeoffs." },
        { q: "What does 'tradeoff' mean?", a: "Every food choice has pros and cons. High protein might mean high sodium. Organic costs more. Sugar-free uses artificial sweeteners. I spell out both sides so you can decide what matters to you." },
        { q: "Why do you say 'I don't know' sometimes?", a: "Because nutrition science isn't settled on everything. If research is limited or conflicting, I'll tell you. Honesty about uncertainty is more useful than fake confidence." },

        // Using Platform
        { q: "What kind of questions should I ask?", a: "Be specific about your context: 'Is this okay for my prediabetic dad?' is better than 'Is this healthy?' Tell me WHO and WHY, and I'll give you a useful answer." },
        { q: "Can I compare two products?", a: "Yes! Show me both and tell me your priority (more protein? less sugar? budget-friendly?). I'll explain which is better for YOUR goal, not just generic 'healthier.'" },
        { q: "Does it work on all food products?", a: "In the hackathon prototype, you'd manually input ingredient lists or use placeholder functions. In a production version, we'd use OCR to read labels from photos automatically." },

        // Tradeoffs
        { q: "Why do you always mention tradeoffs?", a: "Because they're real. Frozen vegetables are cheaper and often more nutritious than 'fresh' that's been sitting for days, but have worse texture. You deserve to know both sides to make informed choices." },
        { q: "What if I just want a yes/no answer?", a: "I can't give that honestly. 'Is this healthy?' depends on who you are and what you need. Someone training for a marathon needs different food than someone managing diabetes. Context is everything." },
        { q: "How do you handle conflicting research?", a: "I tell you when experts disagree. Example: 'Some studies link artificial sweeteners to gut issues, others find no effect. If you're sensitive, avoid; otherwise you're probably fine.' Your call." },

        // Privacy
        { q: "Do you sell my data?", a: "No. For this hackathon, we're not even collecting data—it's a prototype. In production, your scan history would stay private. We might use anonymized patterns to improve the AI, but never sell individual data." },
        { q: "Can I delete my account?", a: "Yes (in production). You'd own your data and could delete everything anytime." },

        // Technical
        { q: "What tech stack is this built on?", a: "Frontend: React, Tailwind CSS, Framer Motion. Backend: Node.js, MongoDB. The focus for the hackathon is demonstrating the AI-native UX pattern, not production infrastructure." },
        { q: "How does ingredient analysis actually work?", a: "The full pipeline would be: OCR extracts text → NLP parses ingredients → Database lookup for each → AI synthesizes an answer based on your intent. For the hackathon, we've built the UX layer and API structure." },
        { q: "Is the AI running locally or in the cloud?", a: "In production, it would be cloud-based for scalability. The hackathon prototype demonstrates the conversational interface pattern." },

        // Hackathon
        { q: "What problem statement is this solving?", a: "'Designing AI-Native Consumer Health Experiences' for understanding food ingredients at decision time. The challenge is reducing cognitive load when you're standing in a store wondering 'Is this okay?'" },
        { q: "What makes this different from existing apps?", a: "Existing apps are databases with search interfaces. You filter by 'low sodium' or 'organic' BEFORE seeing results. I flip it: you show me a product and ask in natural language, I interpret based on your intent. Intent-first, not filter-first." },
        { q: "What's the innovation here?", a: "The UX pattern. We're not claiming to have invented ingredient analysis—we're showing how an AI-native experience should work: conversational, context-aware, explaining tradeoffs instead of scoring, honest about uncertainty." },
        { q: "Is this production-ready?", a: "No, it's a hackathon prototype demonstrating a concept. Key pieces (OCR, complete ingredient database, production AI models) are placeholders. But the core UX pattern—intent-driven, conversational—is fully functional." },

        // Limitations
        { q: "Can you diagnose health conditions?", a: "Absolutely not. I'm a decision support tool for understanding ingredients, not a doctor. If you have medical conditions, consult healthcare professionals. I can explain what's in food, but I can't give medical advice." },
        { q: "What if I have allergies?", a: "I can flag common allergens in ingredients, but for serious allergies, always read labels yourself and consult your allergist. Don't trust any app (including this one) with life-threatening decisions." },
        { q: "What don't you know?", a: "Lots. Nutrition science evolves, individual reactions vary, and research is often limited. I'm honest when data is unclear. Use me as ONE input for decisions, not the only one." },

        // Future
        { q: "What features would you add post-hackathon?", a: "Full OCR for label scanning, comprehensive ingredient database, scan history tracking, product comparisons side-by-side, barcode lookup, and better handling of complex ingredient lists (percentages, sub-ingredients)." },
        { q: "Will this become a real product?", a: "That depends on hackathon feedback and interest. The core insight—AI-native conversational interfaces for consumer health—feels valuable, but turning a prototype into production takes major work." }
    ];

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-gray-600">
                        Everything you need to know about IngrediSense
                    </p>
                </motion.div>

                {/* All Questions - Continuous Flow */}
                <div className="space-y-0">
                    {allQuestions.map((item, idx) => {
                        const isOpen = openItems[idx];

                        return (
                            <div
                                key={idx}
                                className="border-b border-gray-200"
                            >
                                <button
                                    onClick={() => toggleItem(idx)}
                                    className="w-full px-0 py-6 flex items-start justify-between gap-6 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-xl font-semibold text-gray-900 flex-1">
                                        {item.q}
                                    </span>
                                    <div className="flex-shrink-0 mt-1">
                                        {isOpen ? (
                                            <FiMinus className="text-xl text-gray-900" />
                                        ) : (
                                            <FiPlus className="text-xl text-gray-400" />
                                        )}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-6 pr-12 text-lg text-gray-700 leading-relaxed">
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-16 border-t-2 border-gray-900 pt-12 text-center"
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Try the platform to see how it works
                    </p>
                    <a href="/dashboard">
                        <button className="px-12 py-4 bg-gray-900 text-white text-lg font-semibold hover:bg-gray-800 transition-colors">
                            Go to Dashboard →
                        </button>
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQPage;
