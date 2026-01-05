import { motion } from 'framer-motion';
import { FiThumbsDown, FiThumbsUp, FiAlertTriangle, FiHelpCircle, FiShoppingBag, FiActivity } from 'react-icons/fi';

const HealthAnalysisDisplay = ({ insight, decisionColor }) => {
    // Convert hex to RGB for lighter background
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 234, g: 179, b: 8 }; // Default yellow
    };

    // Get dynamic styles based on Gemini's hex color
    const getDecisionStyles = () => {
        const color = decisionColor || '#EAB308';
        const rgb = hexToRgb(color);

        // Calculate lightened background (20% opacity)
        const bgColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
        const borderColor = color;
        const iconBgColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`;

        // Determine icon based on color hue
        // Green hues (60-180): thumbs up, Yellow (30-60): warning, Red (0-30, 330-360): thumbs down
        const hue = rgbToHue(rgb.r, rgb.g, rgb.b);
        let Icon = FiAlertTriangle; // Default

        if (hue >= 80 && hue <= 160) {
            Icon = FiThumbsUp; // Green spectrum
        } else if (hue >= 0 && hue <= 40 || hue >= 340) {
            Icon = FiThumbsDown; // Red spectrum
        }

        return { bgColor, borderColor, iconBgColor, iconColor: color, Icon };
    };

    // Convert RGB to Hue (0-360)
    const rgbToHue = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0;
        if (max !== min) {
            const d = max - min;
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
                case g: h = ((b - r) / d + 2); break;
                case b: h = ((r - g) / d + 4); break;
            }
            h *= 60;
        }
        return h;
    };

    const decisionStyles = getDecisionStyles();
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
                currentSection = '';  // Reset section
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
            // Detect Tradeoffs - THIS EXITS "Why This Matters"
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
            // Detect What I'm Unsure About - THIS EXITS "Tradeoffs"
            else if (trimmedLine.match(/What I'?m Unsure About/i) || trimmedLine.match(/What I'?m Not Sure About/i)) {
                currentSection = 'unsure';
            }
            // Detect Better Options - THIS EXITS "Unsure"
            else if (trimmedLine.match(/\*?\*?Better Options?:?\*?\*?/i) || trimmedLine.includes('🛒')) {
                currentSection = 'betterOptions';
            }
            // NOW process content based on currentSection
            // Detect bullet points for Why This Matters (more flexible)
            else if (currentSection === 'whyMatters' && (trimmedLine.match(/^[-*]\s+\*?\*?([^*:]+)\*?\*?:/) || trimmedLine.match(/^\*\s+\*\*([^*]+)\*\*:/))) {
                const match = trimmedLine.match(/^[-*]\s+\*?\*?([^*:]+)\*?\*?:\s*(.*)/) || trimmedLine.match(/^\*\s+\*\*([^*]+)\*\*:\s*(.*)/);
                if (match) {
                    sections.whyMatters.push({
                        title: match[1].trim(),
                        content: match[2].trim() ? [match[2].trim()] : []  // Start with first line if present
                    });
                }
            }
            // Continue Why Matters subsection content (improved)
            else if (currentSection === 'whyMatters' && trimmedLine && sections.whyMatters.length > 0) {
                // Don't add if it's a new section header
                if (!trimmedLine.match(/\*\*[A-Z]/) && !trimmedLine.match(/^[-*]\s+\*?\*?([^*:]+)\*?\*?:/)) {
                    const lastItem = sections.whyMatters[sections.whyMatters.length - 1];
                    // Add all content lines, not just non-bullet-point lines
                    if (trimmedLine && trimmedLine !== '' && !trimmedLine.startsWith('**')) {
                        lastItem.content.push(trimmedLine);
                    }
                }
            }
            else if (currentSection === 'unsure' && (trimmedLine.match(/^[-*]\s+\*?\*?([^*:]+)\*?\*?:/) || trimmedLine.match(/^\*\s+\*\*([^*]+)\*\*:/))) {
                const match = trimmedLine.match(/^[-*]\s+\*?\*?([^*:]+)\*?\*?:\s*(.*)/) || trimmedLine.match(/^\*\s+\*\*([^*]+)\*\*:\s*(.*)/);
                if (match) {
                    sections.unsure.push({
                        title: match[1].trim(),
                        content: match[2].trim() ? [match[2].trim()] : []  // Support multi-line content
                    });
                }
            }
            // Continue unsure section content (multi-line support)
            else if (currentSection === 'unsure' && trimmedLine && sections.unsure.length > 0) {
                if (!trimmedLine.match(/\*\*[A-Z]/) && !trimmedLine.match(/^[-*]\s+\*?\*?([^*:]+)\*?\*?:/)) {
                    const lastItem = sections.unsure[sections.unsure.length - 1];
                    if (trimmedLine && trimmedLine !== '' && !trimmedLine.startsWith('**')) {
                        if (Array.isArray(lastItem.content)) {
                            lastItem.content.push(trimmedLine);
                        } else {
                            lastItem.content = [lastItem.content, trimmedLine];
                        }
                    }
                }
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
                    className="rounded-3xl p-8 shadow-xl"
                    style={{
                        backgroundColor: decisionStyles.bgColor,
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: decisionStyles.borderColor
                    }}
                >
                    <div className="flex items-start gap-4">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: decisionStyles.iconBgColor }}
                        >
                            <decisionStyles.Icon className="text-2xl" style={{ color: decisionStyles.iconColor }} />
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
                                {Array.isArray(item.content) ? (
                                    <div className="space-y-2">
                                        {item.content.map((paragraph, pIndex) => (
                                            <p key={pIndex} className="text-base text-gray-700 leading-relaxed">{paragraph}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-base text-gray-700 leading-relaxed">{item.content}</p>
                                )}
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
