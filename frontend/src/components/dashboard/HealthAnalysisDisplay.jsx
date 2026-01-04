import { motion } from 'framer-motion';
import { FiThumbsDown, FiAlertTriangle, FiHelpCircle, FiShoppingBag, FiActivity } from 'react-icons/fi';

const HealthAnalysisDisplay = ({ insight }) => {
    // Parse the insight text into structured sections
    const parseInsight = (text) => {
        const sections = {
            scanning: '',
            quickDecision: '',
            whyMatters: [],
            tradeoffs: '',
            unsure: [],
            betterOptions: []
        };

        // Split by lines
        const lines = text.split('\n');
        let currentSection = '';

        lines.forEach(line => {
            const trimmedLine = line.trim();

            // Detect scanning message (flexible patterns)
            if (trimmedLine.includes('Scanning') || trimmedLine.includes('🤔')) {
                sections.scanning = trimmedLine.replace(/^🤔\s*/, '');
            }
            // Detect Quick Decision (with or without asterisks)
            else if (trimmedLine.match(/\*?\*?Quick Decision:?\*?\*?/i)) {
                currentSection = 'quickDecision';
                sections.quickDecision = trimmedLine.replace(/\*?\*?Quick Decision:?\*?\*?/i, '').trim();
            }
            // Continue Quick Decision content
            else if (currentSection === 'quickDecision' && trimmedLine && !trimmedLine.match(/\*\*[A-Z]/)) {
                sections.quickDecision += ' ' + trimmedLine;
            }
            // Detect Why This Matters
            else if (trimmedLine.match(/\*?\*?Why This Matters/i)) {
                currentSection = 'whyMatters';
            }
            // Detect bullet points for Why This Matters (more flexible)
            else if (currentSection === 'whyMatters' && (trimmedLine.match(/^[-*]\s+\*?\*?([^*:]+)\*?\*?:/) || trimmedLine.match(/^\*\s+\*\*([^*]+)\*\*:/))) {
                const match = trimmedLine.match(/^[-*]\s+\*?\*?([^*:]+)\*?\*?:\s*(.*)/) || trimmedLine.match(/^\*\s+\*\*([^*]+)\*\*:\s*(.*)/);
                if (match) {
                    sections.whyMatters.push({
                        title: match[1].trim(),
                        content: [match[2].trim()]
                    });
                }
            }
            // Continue Why Matters subsection content
            else if (currentSection === 'whyMatters' && trimmedLine && !trimmedLine.match(/\*\*[A-Z]/) && sections.whyMatters.length > 0) {
                const lastItem = sections.whyMatters[sections.whyMatters.length - 1];
                if (!trimmedLine.match(/^[-*]/)) {
                    lastItem.content.push(trimmedLine);
                }
            }
            // Detect Tradeoffs
            else if (trimmedLine.match(/\*?\*?Tradeoffs?:?\*?\*?/i)) {
                currentSection = 'tradeoffs';
                const contentMatch = trimmedLine.match(/\*?\*?Tradeoffs?:?\*?\*?\s*(.*)/i);
                if (contentMatch && contentMatch[1]) {
                    sections.tradeoffs = contentMatch[1].trim();
                }
            }
            else if (currentSection === 'tradeoffs' && trimmedLine && !trimmedLine.match(/\*\*[A-Z]/)) {
                sections.tradeoffs += ' ' + trimmedLine;
            }
            // Detect What I'm Unsure About
            else if (trimmedLine.match(/What I'?m Unsure About/i) || trimmedLine.match(/What I'?m Not Sure About/i)) {
                currentSection = 'unsure';
            }
            else if (currentSection === 'unsure' && (trimmedLine.match(/^[-*]\s+\*?\*?([^*:]+)\*?\*?:/) || trimmedLine.match(/^\*\s+\*\*([^*]+)\*\*:/))) {
                const match = trimmedLine.match(/^[-*]\s+\*?\*?([^*:]+)\*?\*?:\s*(.*)/) || trimmedLine.match(/^\*\s+\*\*([^*]+)\*\*:\s*(.*)/);
                if (match) {
                    sections.unsure.push({
                        title: match[1].trim(),
                        content: match[2].trim()
                    });
                }
            }
            // Better Options (flexible matching for multiple formats)
            else if (trimmedLine.match(/\*?\*?Better Options?:?\*?\*?/i) || trimmedLine.includes('🛒')) {
                currentSection = 'betterOptions';
            }
            else if (currentSection === 'betterOptions' && trimmedLine) {
                // Gemini format: "Product Name (Why it's better: reason)"
                const geminiMatch = trimmedLine.match(/^[-*\s]*(.+?)\s*\(\s*Why it's better:\s*(.+?)\s*\)$/i);
                if (geminiMatch) {
                    sections.betterOptions.push({
                        name: geminiMatch[1].trim(),
                        details: geminiMatch[2].trim()
                    });
                }
                // Old format: "**Product Name**: details" or "Product Name (Grade X)"
                else {
                    const oldMatch = trimmedLine.match(/^[-*]\s+\*?\*?([^*:(]+)\*?\*?[:\s]*(.*)/) || trimmedLine.match(/^\*\s+\*\*([^*:(]+)\*\*[:\s]*(.*)/);
                    if (oldMatch) {
                        sections.betterOptions.push({
                            name: oldMatch[1].replace(/\(.*?\)/, '').trim(),
                            details: oldMatch[2].trim()
                        });
                    }
                }
            }
        });

        return sections;
    };

    const sections = parseInsight(insight);

    return (
        <div className="space-y-8">
            {/* Scanning Message */}
            {sections.scanning && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200"
                >
                    <p className="text-lg text-emerald-800 font-medium text-center">
                        {sections.scanning}
                    </p>
                </motion.div>
            )}

            {/* Quick Decision */}
            {sections.quickDecision && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border-2 border-red-200"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <FiThumbsDown className="text-red-600 text-2xl" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-gray-900 mb-3">Quick Decision</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                {sections.quickDecision}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Why This Matters To You */}
            {sections.whyMatters.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <FiActivity className="text-blue-600 text-2xl" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 flex-1">Why This Matters To You</h3>
                    </div>

                    <div className="space-y-6 ml-0 md:ml-18">
                        {sections.whyMatters.map((matter, index) => (
                            <div key={index} className="pl-6 border-l-4 border-blue-300">
                                <h4 className="text-xl font-bold text-blue-900 mb-3">{matter.title}</h4>
                                <div className="space-y-2">
                                    {matter.content.map((paragraph, pIndex) => (
                                        <p key={pIndex} className="text-base text-gray-700 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Tradeoffs */}
            {sections.tradeoffs && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border-2 border-amber-200"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <FiAlertTriangle className="text-amber-600 text-2xl" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-gray-900 mb-3">Tradeoffs</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                {sections.tradeoffs.trim()}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* What I'm Unsure About */}
            {sections.unsure.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-200"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <FiHelpCircle className="text-purple-600 text-2xl" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 flex-1">What I'm Unsure About</h3>
                    </div>

                    <div className="space-y-4 ml-0 md:ml-18">
                        {sections.unsure.map((item, index) => (
                            <div key={index} className="bg-purple-50 rounded-xl p-4">
                                <h4 className="text-lg font-bold text-purple-900 mb-2">{item.title}</h4>
                                <p className="text-base text-gray-700 leading-relaxed">{item.content}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Better Options */}
            {sections.betterOptions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-xl border-2 border-emerald-300"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <FiShoppingBag className="text-white text-2xl" />
                        </div>
                        <h3 className="text-3xl font-black text-emerald-900 flex-1">Better Options</h3>
                    </div>

                    <p className="text-lg text-emerald-800 mb-6 font-semibold ml-0 md:ml-18">
                        🛒 For a healthier snack that's kinder to your sinuses and sleep, try these:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-18">
                        {sections.betterOptions.map((option, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                <h4 className="text-xl font-bold text-emerald-900 mb-3">{option.name}</h4>
                                <p className="text-base text-gray-700 leading-relaxed">{option.details}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default HealthAnalysisDisplay;
