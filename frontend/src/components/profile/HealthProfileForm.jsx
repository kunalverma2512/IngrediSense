import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiAlertCircle, FiPlus, FiX, FiCheck } from 'react-icons/fi';
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

    // Temporary inputs for array fields
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
                // Don't set error, just use empty form data
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchProfile();
        } else {
            // No auth, stop loading
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
            // Prepare payload
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

            // Check if user came from scan page
            const shouldReturnToScan = localStorage.getItem('returnToScanPage');
            if (shouldReturnToScan === 'true') {
                // Clear the flag
                localStorage.removeItem('returnToScanPage');
                // Navigate back to scan page after a short delay
                setTimeout(() => {
                    navigate('/scan');
                }, 800);
            } else {
                // Normal behavior - just show message
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {/* Status Messages */}
            {message && (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-center gap-2">
                    <FiCheck className="text-xl" /> {message}
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
                    <FiAlertCircle className="text-xl" /> {error}
                </div>
            )}

            {/* Basic Stats (Optional) */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Basic Information (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleStatChange}
                            placeholder="e.g. 25"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleStatChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        >
                            <option value="">Select...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleStatChange}
                            placeholder="e.g. 175"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleStatChange}
                            placeholder="e.g. 70"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Medical Conditions */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Medical Conditions</h3>
                <p className="text-gray-500 mb-6 text-sm">Do you have any conditions we should know about? (e.g. Diabetes, Hypertension, IBS)</p>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        name="condition"
                        value={inputs.condition}
                        onChange={handleInputChange}
                        placeholder="Add a condition..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('conditions', 'condition'))}
                    />
                    <button
                        type="button"
                        onClick={() => addItem('conditions', 'condition')}
                        className="px-6 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        <FiPlus />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.conditions.map((item, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg flex items-center gap-2 font-medium">
                            {item}
                            <button type="button" onClick={() => removeItem('conditions', idx)} className="hover:text-blue-900"><FiX /></button>
                        </span>
                    ))}
                    {formData.conditions.length === 0 && <span className="text-gray-400 italic text-sm">No conditions added.</span>}
                </div>
            </div>

            {/* Allergies */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Allergies & Intolerances</h3>
                <p className="text-gray-500 mb-6 text-sm">What should you absolutely avoid? (e.g. Peanuts, Gluten, Shellfish)</p>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        name="allergy"
                        value={inputs.allergy}
                        onChange={handleInputChange}
                        placeholder="Add an allergy..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('allergies', 'allergy'))}
                    />
                    <button
                        type="button"
                        onClick={() => addItem('allergies', 'allergy')}
                        className="px-6 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        <FiPlus />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.allergies.map((item, idx) => (
                        <span key={idx} className="bg-red-50 text-red-700 px-3 py-1 rounded-lg flex items-center gap-2 font-medium">
                            {item}
                            <button type="button" onClick={() => removeItem('allergies', idx)} className="hover:text-red-900"><FiX /></button>
                        </span>
                    ))}
                    {formData.allergies.length === 0 && <span className="text-gray-400 italic text-sm">No allergies added.</span>}

                </div>
            </div>

            {/* Goals */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Health Goals</h3>
                <p className="text-gray-500 mb-6 text-sm">What are you trying to achieve? (e.g. Muscle Gain, Weight Loss, Better Sleep)</p>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        name="goal"
                        value={inputs.goal}
                        onChange={handleInputChange}
                        placeholder="Add a goal..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('goals', 'goal'))}
                    />
                    <button
                        type="button"
                        onClick={() => addItem('goals', 'goal')}
                        className="px-6 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        <FiPlus />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.goals.map((item, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg flex items-center gap-2 font-medium">
                            {item}
                            <button type="button" onClick={() => removeItem('goals', idx)} className="hover:text-emerald-900"><FiX /></button>
                        </span>
                    ))}
                    {formData.goals.length === 0 && <span className="text-gray-400 italic text-sm">No goals added.</span>}
                </div>
            </div>

            {/* Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <p className="text-gray-500 text-sm hidden md:block">
                        All fields are optional. You can update this anytime.
                    </p>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-full hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 ml-auto md:ml-0"
                    >
                        {saving ? 'Saving...' : <><FiSave /> Save Profile</>}
                    </button>
                </div>
            </div>

            {/* Spacer for fixed bottom bar */}
            <div className="h-20" />
        </form>
    );
};

export default HealthProfileForm;
