import { motion } from 'framer-motion';
import { FiDatabase, FiServer, FiMonitor, FiCpu, FiCloud, FiLayers } from 'react-icons/fi';

const ArchitectureSection = () => {
    return (
        <section className="min-h-screen flex items-center py-16 sm:py-20 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
                        System Architecture
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                        Three specialized servers working together to deliver intelligent health analysis.
                    </p>
                </motion.div>

                {/* Architecture Diagram */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gray-800 p-4 sm:p-8 mb-12"
                >
                    {/* User Layer */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white font-bold text-sm sm:text-base">
                            <FiMonitor className="text-lg sm:text-xl" />
                            <span>User Browser</span>
                        </div>
                        <div className="w-0.5 h-6 sm:h-8 bg-gray-600 mx-auto"></div>
                        <div className="text-gray-500 text-xs">HTTPS</div>
                        <div className="w-0.5 h-6 sm:h-8 bg-gray-600 mx-auto"></div>
                    </div>

                    {/* Frontend */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-block bg-blue-600 p-4 sm:p-6 max-w-sm w-full">
                            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <FiLayers className="text-xl sm:text-2xl" />
                                <span className="font-bold text-base sm:text-lg">React Frontend</span>
                            </div>
                            <p className="text-blue-200 text-xs sm:text-sm mb-2">Port: 5173</p>
                            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 text-xs">
                                <span className="bg-blue-700 px-2 py-1">React 19</span>
                                <span className="bg-blue-700 px-2 py-1">Vite</span>
                                <span className="bg-blue-700 px-2 py-1">TailwindCSS</span>
                            </div>
                        </div>
                    </div>

                    {/* Connection Lines - Mobile: Stack, Desktop: Side by Side */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div className="hidden sm:flex items-center gap-4">
                            <div className="w-20 md:w-32 h-0.5 bg-gray-600"></div>
                            <div className="w-0.5 h-8 bg-gray-600"></div>
                            <div className="w-20 md:w-32 h-0.5 bg-gray-600"></div>
                        </div>
                        <div className="sm:hidden w-0.5 h-8 bg-gray-600"></div>
                    </div>

                    {/* Backend Servers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-3xl mx-auto mb-6 sm:mb-8">
                        {/* Node Server */}
                        <div className="bg-green-600 p-4 sm:p-6">
                            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <FiServer className="text-xl sm:text-2xl" />
                                <span className="font-bold text-base sm:text-lg">Node.js Server</span>
                            </div>
                            <p className="text-green-200 text-xs sm:text-sm mb-2 text-center">Port: 8080</p>
                            <div className="text-xs sm:text-sm text-green-100 space-y-1">
                                <p>• User Authentication (JWT)</p>
                                <p>• Health Profile Storage</p>
                                <p>• Session Management</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 text-xs mt-3">
                                <span className="bg-green-700 px-2 py-1">Express</span>
                                <span className="bg-green-700 px-2 py-1">Mongoose</span>
                            </div>
                        </div>

                        {/* FastAPI Server */}
                        <div className="bg-purple-600 p-4 sm:p-6">
                            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <FiCpu className="text-xl sm:text-2xl" />
                                <span className="font-bold text-base sm:text-lg">FastAPI AI Server</span>
                            </div>
                            <p className="text-purple-200 text-xs sm:text-sm mb-2 text-center">Port: 8000</p>
                            <div className="text-xs sm:text-sm text-purple-100 space-y-1">
                                <p>• LangGraph Agent Pipeline</p>
                                <p>• Ingredient Analysis</p>
                                <p>• Risk Assessment</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 text-xs mt-3">
                                <span className="bg-purple-700 px-2 py-1">FastAPI</span>
                                <span className="bg-purple-700 px-2 py-1">LangGraph</span>
                            </div>
                        </div>
                    </div>

                    {/* Connection to External Services */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div className="hidden sm:flex items-center gap-4">
                            <div className="w-20 md:w-32 h-0.5 bg-gray-600"></div>
                            <div className="w-0.5 h-8 bg-gray-600"></div>
                            <div className="w-20 md:w-32 h-0.5 bg-gray-600"></div>
                        </div>
                        <div className="sm:hidden w-0.5 h-8 bg-gray-600"></div>
                    </div>

                    {/* External Services */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {/* MongoDB */}
                        <div className="bg-gray-700 p-4 text-center">
                            <FiDatabase className="text-2xl sm:text-3xl mx-auto mb-2 text-green-400" />
                            <p className="font-bold text-sm sm:text-base">MongoDB</p>
                            <p className="text-gray-400 text-xs">User Data</p>
                        </div>

                        {/* Groq */}
                        <div className="bg-gray-700 p-4 text-center">
                            <FiCloud className="text-2xl sm:text-3xl mx-auto mb-2 text-orange-400" />
                            <p className="font-bold text-sm sm:text-base">Groq LPU</p>
                            <p className="text-gray-400 text-xs">Llama 4 Scout 17B</p>
                        </div>

                        {/* Google */}
                        <div className="bg-gray-700 p-4 text-center">
                            <FiCloud className="text-2xl sm:text-3xl mx-auto mb-2 text-blue-400" />
                            <p className="font-bold text-sm sm:text-base">Google AI</p>
                            <p className="text-gray-400 text-xs">Gemini Model</p>
                        </div>
                    </div>
                </motion.div>

                {/* Data Flow Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="bg-gray-800 p-4 sm:p-6">
                        <span className="text-4xl sm:text-5xl font-black text-gray-700">01</span>
                        <h3 className="text-lg sm:text-xl font-bold mt-2 mb-2">Upload & Auth</h3>
                        <p className="text-gray-400 text-sm">User uploads product image. Frontend authenticates with Node server and fetches health profile.</p>
                    </div>
                    <div className="bg-gray-800 p-4 sm:p-6">
                        <span className="text-4xl sm:text-5xl font-black text-gray-700">02</span>
                        <h3 className="text-lg sm:text-xl font-bold mt-2 mb-2">AI Processing</h3>
                        <p className="text-gray-400 text-sm">FastAPI sends image to Groq for vision analysis, then sends to Gemini with health context for personalized insights.</p>
                    </div>
                    <div className="bg-gray-800 p-4 sm:p-6">
                        <span className="text-4xl sm:text-5xl font-black text-gray-700">03</span>
                        <h3 className="text-lg sm:text-xl font-bold mt-2 mb-2">Response</h3>
                        <p className="text-gray-400 text-sm">Results are compiled and returned to frontend with dynamic color coding and recommendations.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ArchitectureSection;
