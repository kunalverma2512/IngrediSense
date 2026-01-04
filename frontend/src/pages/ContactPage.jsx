import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiPhone, FiSend, FiUser, FiMessageSquare, FiTag, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user', // user, developer, investor, researcher
        subject: '',
        message: '',
        priority: 'normal'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                role: 'user',
                subject: '',
                message: '',
                priority: 'normal'
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header */}
            <section className="bg-gray-900 text-white py-20 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-teal-900/40" />
                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-7xl font-black mb-6"
                    >
                        Get in Touch
                    </motion.h1>
                    <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
                        Have feedback, questions, or just want to say hi? We'd love to hear from you.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-10 pb-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-10 text-white shadow-2xl h-fit"
                    >
                        <h3 className="text-3xl font-bold mb-8">Contact Info</h3>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <FiMail className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-1">Email Us</p>
                                    <p className="text-xl font-semibold">hello@ingredisense.com</p>
                                    <p className="text-emerald-100">support@ingredisense.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <FiMapPin className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-1">Location</p>
                                    <p className="text-xl font-semibold">IIT Guwahati</p>
                                    <p className="text-emerald-100">Guwahati, Assam, India</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <FiPhone className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-1">Phone</p>
                                    <p className="text-xl font-semibold">+91 00000 00000</p>
                                    <p className="text-emerald-100">Mon-Fri, 9am - 6pm</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/20">
                            <p className="font-semibold mb-6">Connect across platforms</p>
                            <div className="flex gap-4">
                                <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <FiGithub className="text-xl" />
                                </a>
                                <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <FiLinkedin className="text-xl" />
                                </a>
                                <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <FiTwitter className="text-xl" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 bg-white rounded-3xl p-10 shadow-xl border border-gray-100"
                    >
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                                    <FiSend className="text-4xl" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h3>
                                <p className="text-lg text-gray-600 mb-8 max-w-md">
                                    Thanks for reaching out. We'll interpret your message (AI pun intended) and get back to you shortly.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800"
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                            <FiUser /> Your Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-lg"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                            <FiMail /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-lg"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                            <FiTag /> I am a...
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-lg appearance-none cursor-pointer"
                                            >
                                                <option value="user">User</option>
                                                <option value="developer">Developer</option>
                                                <option value="investor">Investor/Judge</option>
                                                <option value="researcher">Medical Researcher</option>
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                ▼
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                            <FiTag /> Priority
                                        </label>
                                        <div className="flex gap-4">
                                            {['low', 'normal', 'high'].map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, priority: p })}
                                                    className={`flex-1 py-3 rounded-xl border font-medium capitalize transition-all ${formData.priority === p
                                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                                                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                        <FiMessageSquare /> Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-lg"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                        <FiMessageSquare /> Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-lg resize-none"
                                        placeholder="Tell us what's on your mind..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-gray-900 text-white text-xl font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Sending...' : (
                                        <>
                                            Send Message <FiSend />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
