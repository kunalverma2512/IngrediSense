import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🧬</span>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                IngrediSense
                            </h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Your AI shopping companion for understanding food ingredients at decision time.
                        </p>
                        <p className="text-sm text-gray-500">
                            Built for ENCODE 2026 Hackathon<br />
                            IIT Guwahati
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-emerald-400">Explore</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                    Services
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-teal-400">Resources</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/guidelines" className="text-gray-400 hover:text-teal-400 transition-colors">
                                    Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link to="/docs" className="text-gray-400 hover:text-teal-400 transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-400 hover:text-teal-400 transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-teal-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Hackathon Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-cyan-400">Hackathon Project</h4>
                        <div className="space-y-4">
                            <p className="text-gray-400 text-sm leading-relaxed">
                                <strong className="text-white">Problem Statement:</strong><br />
                                AI-Native Consumer Health Experiences
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                <strong className="text-white">Approach:</strong><br />
                                Intent-first AI co-pilot, not a database app
                            </p>
                            <div className="flex gap-4 mt-6">
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                                    aria-label="GitHub"
                                >
                                    <FiGithub className="text-2xl" />
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-teal-400 transition-colors"
                                    aria-label="LinkedIn"
                                >
                                    <FiLinkedin className="text-2xl" />
                                </a>
                                <a
                                    href="mailto:hello@ingredisense.com"
                                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                                    aria-label="Email"
                                >
                                    <FiMail className="text-2xl" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-gray-400 text-sm text-center md:text-left">
                            © {currentYear} IngrediSense. Built for ENCODE 2026 Hackathon.
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <span>Made with</span>
                            <FiHeart className="text-red-500" />
                            <span>for better food choices</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI-Native Statement */}
            <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border-t border-emerald-700/30">
                <div className="max-w-4xl mx-auto px-6 py-8 text-center">
                    <p className="text-emerald-400 font-semibold mb-2">AI-Native Experience</p>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
                        This is not a traditional app with AI added on. IngrediSense is built from the ground up as an AI co-pilot that understands your intent, explains tradeoffs, and reduces cognitive load when making food decisions.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
