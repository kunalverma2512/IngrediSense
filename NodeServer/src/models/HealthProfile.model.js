import mongoose from 'mongoose';

const healthProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    allergies: [{
        type: String,
        trim: true
    }],
    conditions: [{
        type: String,
        trim: true
    }],
    diets: [{
        type: String,
        trim: true
    }],
    goals: [{
        type: String,
        trim: true
    }],
    // Flexible object for key-value stats (e.g., age: 25, weight: 70kg)
    // We intentionally keep this flexible as per user request for "optional" and "add more detailed afterwards"
    stats: {
        type: Map,
        of: String
    },
    profileCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const HealthProfile = mongoose.model('HealthProfile', healthProfileSchema);

export default HealthProfile;
