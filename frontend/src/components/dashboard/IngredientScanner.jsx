import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiCamera, FiImage } from 'react-icons/fi';

const IngredientScanner = () => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        // TODO: Handle file upload
        alert('Image upload feature coming soon!');
    };

    const handleFileSelect = () => {
        alert('Image upload feature coming soon!');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCamera className="text-emerald-600" />
                Ingredient Scanner
            </h2>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-300 hover:border-emerald-400'
                    }`}
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <FiUpload className="text-4xl text-white" />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Upload Product Image
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Drag and drop or click to select
                        </p>
                    </div>

                    <button
                        onClick={handleFileSelect}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
                    >
                        <FiImage className="inline mr-2" />
                        Select Image
                    </button>

                    <p className="text-sm text-gray-500">
                        Supports: JPG, PNG (Max 10MB)
                    </p>
                </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">📋 Tips for Best Results:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Ensure good lighting for clear ingredient list</li>
                    <li>• Capture the entire ingredients section</li>
                    <li>• Avoid blurry or angled images</li>
                    <li>• Use high-resolution photos when possible</li>
                </ul>
            </div>
        </motion.div>
    );
};

export default IngredientScanner;
