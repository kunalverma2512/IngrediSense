import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { FiUpload, FiCamera, FiMessageCircle, FiZap, FiCheck, FiX, FiRefreshCcw, FiAlertCircle } from 'react-icons/fi';
import { analyzeFoodLabel } from '../services/healthAgent.service';
import HealthAnalysisDisplay from '../components/dashboard/HealthAnalysisDisplay';


const ScanPage = () => {
    const navigate = useNavigate();
    const [uploadedImage, setUploadedImage] = useState(null);
    const [userIntent, setUserIntent] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [analysisError, setAnalysisError] = useState(null);
    const abortControllerRef = useRef(null); // For canceling API requests
    const [showResults, setShowResults] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    const webcamRef = useRef(null);

    // Persist uploaded image and analysis results to localStorage
    useEffect(() => {
        // Restore from localStorage on mount
        const savedImage = localStorage.getItem('scanPage_uploadedImage');
        if (savedImage) {
            setUploadedImage(savedImage);
        }

        // Restore analysis results from localStorage on mount
        const savedResults = localStorage.getItem('scanPage_analysisResults');
        const savedShowResults = localStorage.getItem('scanPage_showResults');
        if (savedResults) {
            try {
                setAnalysisResults(JSON.parse(savedResults));
                setShowResults(savedShowResults === 'true');
            } catch (error) {
                console.warn('Failed to parse saved analysis results');
                localStorage.removeItem('scanPage_analysisResults');
                localStorage.removeItem('scanPage_showResults');
            }
        }

        // Cleanup: save to localStorage on unmount
        return () => {
            if (uploadedImage) {
                localStorage.setItem('scanPage_uploadedImage', uploadedImage);
            }
        };
    }, []);

    // Save to localStorage whenever image changes
    useEffect(() => {
        if (uploadedImage) {
            try {
                localStorage.setItem('scanPage_uploadedImage', uploadedImage);
            } catch (error) {
                // Handle quota exceeded error
                if (error.name === 'QuotaExceededError') {
                    console.warn('Image too large for localStorage. Proceeding without persistence.');
                    // Clear any existing stored image to free up space
                    localStorage.removeItem('scanPage_uploadedImage');
                }
            }
        } else {
            localStorage.removeItem('scanPage_uploadedImage');
        }
    }, [uploadedImage]);

    // Cleanup: Cancel ongoing API request when component unmounts
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                console.log('API request cancelled on unmount');
            }
        };
    }, []);

    // Handle devices
    const handleDevices = useCallback(
        (mediaDevices) => {
            const videoDevices = mediaDevices.filter(({ kind }) => kind === "videoinput");
            setDevices(videoDevices);
            // Auto-select first available camera if none selected
            if (videoDevices.length > 0 && !selectedDeviceId) {
                setSelectedDeviceId(videoDevices[0].deviceId);
            }
        },
        [selectedDeviceId]
    );

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }, [handleDevices]);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setUploadedImage(imageSrc);
        setShowCamera(false);
    }, [webcamRef]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    // Compress if image is too large (> 2MB in base64)
                    const base64Size = reader.result.length * 0.75 / 1024 / 1024; // Approximate MB

                    if (base64Size > 2) {
                        // Create canvas for compression
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        // Calculate new dimensions (max 1920px width)
                        let width = img.width;
                        let height = img.height;
                        const maxWidth = 1920;

                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);

                        // Compress to JPEG with 0.85 quality
                        const compressedImage = canvas.toDataURL('image/jpeg', 0.85);
                        setUploadedImage(compressedImage);
                    } else {
                        setUploadedImage(reader.result);
                    }
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!uploadedImage) {
            setAnalysisError('No image uploaded');
            return;
        }

        // Cancel any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResults(null);

        try {
            // Call FastAPI health agent with abort signal
            const results = await analyzeFoodLabel(uploadedImage, abortControllerRef.current.signal);
            setAnalysisResults(results);
            setShowResults(true);
            // Persist results to localStorage
            try {
                localStorage.setItem('scanPage_analysisResults', JSON.stringify(results));
                localStorage.setItem('scanPage_showResults', 'true');
            } catch (storageError) {
                console.warn('Failed to save analysis results to localStorage:', storageError);
            }
        } catch (error) {
            console.error('Analysis failed:', error);
            // Ignore abort errors (user navigated away or cancelled)
            if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
                setAnalysisError(error.message || 'Failed to analyze image. Please try again.');
            }
        } finally {
            setIsAnalyzing(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <div className="bg-white">
            {/* Section 1: Hero */}
            <section className="min-h-screen flex items-center justify-center relative pt-20">
                <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="mb-8">
                            <span className="text-6xl">📸</span>
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black text-gray-900 mb-8 leading-none">
                            Show Me<br />What You're Buying
                        </h1>
                        <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
                            Snap a photo of the ingredient list, tell me what you care about, and I'll explain what matters—in seconds.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                                <p className="text-emerald-900 font-semibold">✓ No jargon</p>
                            </div>
                            <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                                <p className="text-teal-900 font-semibold">✓ Honest tradeoffs</p>
                            </div>
                            <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                                <p className="text-cyan-900 font-semibold">✓ Your context only</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Upload/Camera */}
            <section className="min-h-screen bg-gray-50 flex items-center py-20" id="upload-section">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-6xl font-black text-gray-900 mb-6">
                            Step 1: Capture or Upload
                        </h2>
                        <p className="text-xl text-gray-600">
                            Take a photo with your camera or upload from your device
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        {!uploadedImage && !showCamera ? (
                            <div className="space-y-6">
                                {/* Upload Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                                    {/* Camera Option */}
                                    <button
                                        onClick={() => setShowCamera(true)}
                                        className="relative flex flex-col items-center justify-center h-80 rounded-3xl border-2 border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100 transition-all duration-300 group cursor-pointer"
                                    >
                                        <div className="mb-6 p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            <FiCamera className="text-5xl text-emerald-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Use Camera</h3>
                                        <p className="text-gray-600 font-medium px-8 text-center leading-relaxed">
                                            Take a live photo of the ingredient list
                                        </p>
                                    </button>

                                    {/* Upload Option */}
                                    <label className="relative flex flex-col items-center justify-center h-80 rounded-3xl border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 cursor-pointer group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <div className="mb-6 p-4 bg-gray-50 rounded-full group-hover:scale-110 transition-transform duration-300">
                                            <FiUpload className="text-5xl text-gray-400 group-hover:text-gray-600 transition-colors" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Image</h3>
                                        <p className="text-gray-500 font-medium px-8 text-center leading-relaxed">
                                            Choose from your gallery
                                        </p>
                                    </label>
                                </div>
                            </div>
                        ) : showCamera ? (
                            /* Camera View - Using react-webcam */
                            <div className="space-y-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800">Camera</h3>
                                    <button
                                        onClick={() => setShowCamera(false)}
                                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>

                                {/* Camera Selection */}
                                <div className="relative">
                                    <select
                                        value={selectedDeviceId}
                                        onChange={(e) => setSelectedDeviceId(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer text-gray-700 font-medium"
                                    >
                                        {devices.map((device, key) => (
                                            <option key={key} value={device.deviceId}>
                                                {device.label || `Camera ${key + 1}`}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                        <FiRefreshCcw />
                                    </div>
                                </div>

                                {/* Webcam Feed */}
                                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] shadow-inner">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{
                                            deviceId: selectedDeviceId
                                        }}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Overlay Guide */}
                                    <div className="absolute inset-0 border-2 border-white/30 rounded-2xl pointer-events-none m-4">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <p className="text-white/70 text-sm font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                                                Align ingredients here
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Capture Button */}
                                <div className="flex justify-center pt-4">
                                    <button
                                        onClick={capture}
                                        className="w-20 h-20 bg-emerald-500 rounded-full border-4 border-emerald-200 shadow-xl flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                                    >
                                        <div className="w-16 h-16 bg-white rounded-full border-4 border-emerald-500" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Uploaded Image Preview */
                            <div className="space-y-6">
                                <div className="relative group">
                                    <img
                                        src={uploadedImage}
                                        alt="Uploaded ingredient list"
                                        className="w-full rounded-2xl shadow-2xl"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-4 backdrop-blur-sm">
                                        <button
                                            onClick={() => setUploadedImage(null)}
                                            className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-transform hover:scale-105 shadow-xl"
                                        >
                                            Retake Photo
                                        </button>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
                                        <FiCheck /> Image Ready
                                    </div>
                                </div>

                                {/* Health Profile Action Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    <p className="text-center text-gray-700 text-lg font-semibold">
                                        Want better recommendations?
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => {
                                                // Set flag to indicate user came from scan page
                                                localStorage.setItem('returnToScanPage', 'true');
                                                navigate('/profile');
                                            }}
                                            className="px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 text-lg font-bold rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <FiCheck className="text-xl" />
                                            Update Your Health Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Start analysis directly
                                                handleAnalyze();
                                            }}
                                            disabled={isAnalyzing}
                                            className={`px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <FiZap className="text-xl" />
                                            Continue with Current Profile
                                        </button>
                                    </div>
                                    <p className="text-center text-gray-500 text-sm mt-2">
                                        Click continue to analyze with your current health profile
                                    </p>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>





            {/* Loading State */}
            {isAnalyzing && (
                <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-20">
                    <div className="max-w-2xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className="relative w-32 h-32 mx-auto">
                                <div className="absolute inset-0 border-8 border-emerald-200 rounded-full animate-ping"></div>
                                <div className="absolute inset-0 border-8 border-t-emerald-600 rounded-full animate-spin"></div>
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 mb-4">Analyzing Your Product...</h2>
                                <p className="text-xl text-gray-600">
                                    Our AI is extracting ingredients and assessing health impacts based on your profile.
                                </p>
                                <p className="text-sm text-gray-500 mt-4">This may take 20-30 seconds</p>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Error State */}
            {analysisError && !isAnalyzing && (
                <section className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-20">
                    <div className="max-w-2xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-xl border border-red-200"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <FiAlertCircle className="text-red-600 text-3xl" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis Failed</h3>
                                    <p className="text-gray-700 mb-6">{analysisError}</p>
                                    <button
                                        onClick={() => {
                                            setAnalysisError(null);
                                            handleAnalyze();
                                        }}
                                        className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
                                    >
                                        <FiRefreshCcw />
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Results Section */}
            {showResults && analysisResults && !isAnalyzing && (
                <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/20 py-20">
                    <div className="max-w-5xl mx-auto px-6 lg:px-12">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <div className="inline-block mb-4 px-6 py-2 bg-emerald-100 rounded-full">
                                <p className="text-emerald-700 font-bold text-sm tracking-wide uppercase">Analysis Complete</p>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                                Health Analysis
                            </h2>
                            <p className="text-2xl md:text-3xl text-gray-600 font-semibold">{analysisResults.brand_name}</p>
                        </motion.div>

                        {/* Parse and display the conversational insight with proper formatting */}
                        <HealthAnalysisDisplay insight={analysisResults.final_conversational_insight} decisionColor={analysisResults.decision_color} />
                    </div>
                </section>
            )}

            {/* Section 5: Follow-Up */}
            {
                showResults && (
                    <section className="min-h-screen bg-white flex items-center py-20">
                        <div className="max-w-4xl mx-auto px-6 lg:px-12 w-full text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-6xl font-black text-gray-900 mb-8">
                                    Want to Dig Deeper?
                                </h2>
                                <p className="text-xl text-gray-600 mb-12">
                                    Ask follow-up questions or compare with another product
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Ask a Follow-Up - Coming Soon */}
                                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 text-left border-2 border-gray-300 transition-all cursor-not-allowed group overflow-hidden">
                                        {/* Diagonal Stripe Pattern Overlay */}
                                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.05) 10px, rgba(0,0,0,.05) 20px)'
                                        }}></div>

                                        {/* Modern Coming Soon Badge */}
                                        <div className="absolute top-4 right-4 z-20">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-md opacity-50"></div>
                                                <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    Coming Soon
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sleek Overlay on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/95 via-purple-600/95 to-pink-600/95 backdrop-blur-md rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10">
                                            <div className="text-center px-8">
                                                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm animate-pulse">
                                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                    </svg>
                                                </div>
                                                <p className="text-white text-2xl font-black mb-3">Feature In Development</p>
                                                <p className="text-white/90 text-base font-medium">We're working on bringing you conversational AI follow-ups</p>
                                                <div className="mt-4 inline-flex items-center gap-2 text-white/70 text-sm">
                                                    <div className="flex gap-1">
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content with subtle styling */}
                                        <div className="relative z-0 opacity-50 select-none">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                Ask a Follow-Up
                                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                            </h3>
                                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                                "Why is sugar 2nd on the list bad?"<br />
                                                "What's a better alternative?"
                                            </p>
                                            <button disabled className="px-6 py-3 bg-gray-200 border-2 border-gray-300 text-gray-500 font-bold rounded-xl w-full cursor-not-allowed relative overflow-hidden">
                                                <span className="relative z-10">Continue Conversation</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-50 rounded-3xl p-8 text-left hover:bg-emerald-100 transition-colors cursor-pointer group">
                                        <h3 className="text-2xl font-bold text-emerald-900 mb-4">Scan Another</h3>
                                        <p className="text-emerald-800 mb-8 text-lg">
                                            Compare this with another product to see which is better for your goal.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setUploadedImage(null);
                                                setUserIntent('');
                                                setShowResults(false);
                                                setAnalysisResults(null);
                                                // Clear all localStorage data for scan page
                                                localStorage.removeItem('scanPage_uploadedImage');
                                                localStorage.removeItem('scanPage_analysisResults');
                                                localStorage.removeItem('scanPage_showResults');
                                                // Smooth scroll to upload section
                                                document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors w-full shadow-lg shadow-emerald-200"
                                        >
                                            Scan New Product
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                )
            }
        </div >
    );
};

export default ScanPage;
