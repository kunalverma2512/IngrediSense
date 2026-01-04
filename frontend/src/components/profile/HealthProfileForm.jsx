import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FiSave, FiAlertCircle, FiPlus, FiX, FiCheck,
    FiHeart, FiShield, FiTarget, FiActivity
} from 'react-icons/fi';
import { getHealthProfile, updateHealthProfile } from '../../services/profile.service';
import { useAuth } from '../../context/AuthContext';

const HealthProfileForm = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        allergies: [],
        conditions: [],
        diets: [],
        goals: [],
        age: '',
        weight: '',
        height: '',
        gender: ''
    });

    const [inputs, setInputs] = useState({
        allergy: '',
        condition: '',
        diet: '',
        goal: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getHealthProfile();
                const data = response.data;
                setFormData({
                    allergies: data.allergies || [],
                    conditions: data.conditions || [],
                    diets: data.diets || [],
                    goals: data.goals || [],
                    age: data.stats?.age || '',
                    weight: data.stats?.weight || '',
                    height: data.stats?.height || '',
                    gender: data.stats?.gender || ''
                });
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const handleInputChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleStatChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addItem = (field, inputKey) => {
        if (!inputs[inputKey].trim()) return;
        setFormData({
            ...formData,
            [field]: [...formData[field], inputs[inputKey].trim()]
        });
        setInputs({ ...inputs, [inputKey]: '' });
    };

    const removeItem = (field, index) => {
        setFormData({
            ...formData,
            [field]: formData[field].filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const payload = {
                allergies: formData.allergies,
                conditions: formData.conditions,
                diets: formData.diets,
                goals: formData.goals,
                stats: {
                    age: formData.age,
                    weight: formData.weight,
                    height: formData.height,
                    gender: formData.gender
                }
            };

            await updateHealthProfile(payload);
            setMessage('Profile updated successfully!');

            const shouldReturnToScan = localStorage.getItem('returnToScanPage');
            if (shouldReturnToScan === 'true') {
                localStorage.removeItem('returnToScanPage');
                setTimeout(() => {
                    navigate('/scan');
                }, 800);
            } else {
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                < div className="text-center" >
                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your profile...</p>
                </div >
            </div >
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-16 pb-32">
            {/* Status Messages */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3">
                            <FiCheck className="text-2xl text-emerald-600" />
                            <p className="text-emerald-900 font-semibold text-lg">{message}</p>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-red-50 border-2 border-red-200 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3">
                            <FiAlertCircle className="text-2xl text-red-600" />
                            <p className="text-red-900 font-semibold text-lg">{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Basic Information */}
            <div className="space-y-12">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Basic Information</h2>
                    <p className="text-xl text-gray-600">Tell us about yourself (optional)</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
                    <div>
                        <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Age
                        </label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleStatChange}
                            placeholder="25"
                            className="w-full px-0 py-4 text-2xl font-medium text-gray-900 bg-transparent border-0 border-b-3 border-gray-200 focus:border-emerald-600 focus:outline-none transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleStatChange}
                            className="w-full px-0 py-4 text-2xl font-medium text-gray-900 bg-transparent border-0 border-b-3 border-gray-200 focus:border-emerald-600 focus:outline-none transition-all"
                        >
                            <option value="">Select...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Height (cm)
                        </label>
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleStatChange}
                            placeholder="175"
                            className="w-full px-0 py-4 text-2xl font-medium text-gray-900 bg-transparent border-0 border-b-3 border-gray-200 focus:border-emerald-600 focus:outline-none transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Weight (kg)
                        </label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleStatChange}
                            placeholder="70"
                            className="w-full px-0 py-4 text-2xl font-medium text-gray-900 bg-transparent border-0 border-b-3 border-gray-200 focus:border-emerald-600 focus:outline-none transition-all placeholder:text-gray-300"
                        />
                    </div>
                </div>
            </div>

            {/* Health Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16 lg:auto-rows-fr">
                {/* Medical Conditions */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Medical Conditions</h2>
                        <p className="text-xl text-gray-600">Any health conditions we should know about?</p>
                        <p className="text-gray-500 mt-2">e.g., Diabetes, Hypertension, Heart Disease</p>
                    </div>

                    <div className="flex gap-6 items-end">
                        <div className="flex-1">
                            <input
                                type="text"
                                name="condition"
                                value={inputs.condition}
                                onChange={handleInputChange}
                                placeholder="e.g., Diabetes, Hypertension..."
                                className="w-full px-0 py-4 text-xl font-medium text-gray-900 bg-transparent border-0 border-b-3 border-gray-200 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-300"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('conditions', 'condition'))}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => addItem('conditions', 'condition')}
                            className="px-5 py-3 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <FiPlus className="text-xl" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto pr-2">
                        {formData.conditions.map((item, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-5 py-3 bg-blue-50 border-2 border-blue-200 text-blue-900 rounded-xl flex items-center gap-3 font-semibold h-fit"
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => removeItem('conditions', idx)}
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    <FiX className="text-lg" />
                                </button>
                            </motion.span>
                        ))}
                        {formData.conditions.length === 0 && (
                            <p className="text-gray-400 italic py-2">No conditions added.</p>
                        )}
                    </div>
                </div>

                {/* Allergies */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Allergies & Intolerances</h2>
                        <p className="text-xl text-gray-600">What should you absolutely avoid?</p>
                        <p className="text-gray-500 mt-2">e.g., Peanuts, Gluten, Shellfish, Dairy</p>
                    </div>

                    <div className="flex gap-6 items-end">
                        <div className="flex-1">
                            <input
                                type="text"
                                name="allergy"
                                value={inputs.allergy}
                                onChange={handleInputChange}
                                placeholder="e.g., Peanuts, Shellfish, Gluten..."
                                className="w-full px-0 py-4 text-xl font-medium text-gray-900 bg-transparent border-0 border-b-3 border-gray-200 focus:border-red-500 focus:outline-none transition-all placeholder:text-gray-300"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('allergies', 'allergy'))}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => addItem('allergies', 'allergy')}
                            className="px-5 py-3 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <FiPlus className="text-xl" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto pr-2">
                        {formData.allergies.map((item, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-5 py-3 bg-red-50 border-2 border-red-200 text-red-900 rounded-xl flex items-center gap-3 font-semibold h-fit"
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => removeItem('allergies', idx)}
                                    className="hover:text-red-600 transition-colors"
                                >
                                    <FiX className="text-lg" />
                                </button>
                            </motion.span>
                        ))}
                        {formData.allergies.length === 0 && (
                            <p className="text-gray-400 italic py-2">No allergies added.</p>
                        )}
                    </div>
                </div>

                {/* Dietary Preferences */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Dietary Preferences</h2>
                        <p className="text-xl text-gray-600">Any specific diet you follow?</p>
                        <p className="text-gray-500 mt-2">e.g., Vegan, Keto, Low-Carb, Gluten-Free</p>
                    </div>

                    <div className="flex gap-6 items-end">
                        <div className="flex-1">
                            <input
                                type="text"
                                name="diet"
                                value={inputs.diet}
                                onChange={handleInputChange}
                                placeholder="e.g., Vegan, Keto, Paleo..."
                                className="w-full px-0 py-4 text-xl font-medium text-gray-900 bg-transparent border-0 border-b-3 border-gray-200 focus:border-amber-500 focus:outline-none transition-all placeholder:text-gray-300"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('diets', 'diet'))}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => addItem('diets', 'diet')}
                            className="px-5 py-3 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <FiPlus className="text-xl" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto pr-2">
                        {formData.diets.map((item, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-5 py-3 bg-amber-50 border-2 border-amber-200 text-amber-900 rounded-xl flex items-center gap-3 font-semibold h-fit"
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => removeItem('diets', idx)}
                                    className="hover:text-amber-600 transition-colors"
                                >
                                    <FiX className="text-lg" />
                                </button>
                            </motion.span>
                        ))}
                        {formData.diets.length === 0 && (
                            <p className="text-gray-400 italic py-2">No dietary preferences added.</p>
                        )}
                    </div>
                </div>

                {/* Health Goals */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Health Goals</h2>
                        <p className="text-xl text-gray-600">What are you trying to achieve?</p>
                        <p className="text-gray-500 mt-2">e.g., Weight Loss, Muscle Gain, Better Energy, Better Sleep</p>
                    </div>

                    <div className="flex gap-6 items-end">
                        <div className="flex-1">
                            <input
                                type="text"
                                name="goal"
                                value={inputs.goal}
                                onChange={handleInputChange}
                                placeholder="e.g., Weight Loss, Build Muscle..."
                                className="w-full px-0 py-4 text-xl font-medium text-gray-900 bg-transparent border-0 border-b-3 border-gray-200 focus:border-emerald-600 focus:outline-none transition-all placeholder:text-gray-300"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('goals', 'goal'))}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => addItem('goals', 'goal')}
                            className="px-5 py-3 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <FiPlus className="text-xl" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto pr-2">
                        {formData.goals.map((item, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-5 py-3 bg-emerald-50 border-2 border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-3 font-semibold h-fit"
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => removeItem('goals', idx)}
                                    className="hover:text-emerald-600 transition-colors"
                                >
                                    <FiX className="text-lg" />
                                </button>
                            </motion.span>
                        ))}
                        {formData.goals.length === 0 && (
                            <p className="text-gray-400 italic py-2">No goals set yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Save Button - Sticky Bottom */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-6 px-6 mt-16 z-40">
                <div className="max-w-7xl mx-auto">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full md:w-auto px-12 py-4 bg-gray-900 text-white text-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Saving Profile...
                            </>
                        ) : (
                            <>
                                <FiSave className="text-xl" />
                                Save Profile
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default HealthProfileForm;
