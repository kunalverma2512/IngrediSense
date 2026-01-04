import HealthProfile from '../models/HealthProfile.model.js';

// @desc    Get current user's health profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res, next) => {
    try {
        let profile = await HealthProfile.findOne({ user: req.user._id });

        if (!profile) {
            // Return empty profile structure if not found, but don't create it yet
            return res.status(200).json({
                success: true,
                data: {
                    allergies: [],
                    conditions: [],
                    diets: [],
                    goals: [],
                    stats: {},
                    profileCompleted: false
                }
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update or create health profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const { allergies, conditions, diets, goals, stats } = req.body;

        // Build profile object
        const profileFields = {
            user: req.user._id,
            allergies: allergies || [],
            conditions: conditions || [],
            diets: diets || [],
            goals: goals || [],
            stats: stats || {},
            // Simple logic: if at least one field has data, mark as completed (or partially)
            // For now, we set true if any array has length > 0
            profileCompleted: (allergies?.length > 0 || conditions?.length > 0 || diets?.length > 0 || goals?.length > 0)
        };

        let profile = await HealthProfile.findOne({ user: req.user._id });

        if (profile) {
            // Update
            profile = await HealthProfile.findOneAndUpdate(
                { user: req.user._id },
                { $set: profileFields },
                { new: true }
            );
        } else {
            // Create
            profile = new HealthProfile(profileFields);
            await profile.save();
        }

        res.status(200).json({
            success: true,
            data: profile,
            message: 'Health profile updated successfully'
        });
    } catch (error) {
        next(error);
    }
};
