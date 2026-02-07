import Mentor from '../model/mentor.Model.js';
import Booking from '../model/booking.Model.js';

/**
 * Get all mentors with search and filter
 * @route GET /api/v1/mentors
 */
export const getAllMentors = async (req, res) => {
    try {
        const { search, category, availability, minRating } = req.query;

        // Build query
        let query = { isApproved: true };

        // Search by name, company, or job title
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { jobTitle: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Filter by availability
        if (availability) {
            query.availability = availability;
        }

        // Filter by minimum rating
        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };
        }

        // Fetch mentors (excluding password)
        const mentors = await Mentor.find(query)
            .select('-password')
            .sort({ rating: -1, totalSessions: -1 });

        res.status(200).json({
            success: true,
            count: mentors.length,
            data: mentors
        });
    } catch (error) {
        console.error('Get mentors error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching mentors'
        });
    }
};

/**
 * Get single mentor by ID
 * @route GET /api/v1/mentors/:id
 */
export const getMentorById = async (req, res) => {
    try {
        const { id } = req.params;

        const mentor = await Mentor.findById(id).select('-password');

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Mentor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: mentor
        });
    } catch (error) {
        console.error('Get mentor error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching mentor'
        });
    }
};

/**
 * Create new mentor (Admin only)
 * @route POST /api/v1/mentors
 */
export const createMentor = async (req, res) => {
    try {
        const mentorData = req.body;

        // Create mentor
        const mentor = await Mentor.create(mentorData);

        // Remove password from response
        const mentorResponse = mentor.toObject();
        delete mentorResponse.password;

        res.status(201).json({
            success: true,
            message: 'Mentor created successfully',
            data: mentorResponse
        });
    } catch (error) {
        console.error('Create mentor error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating mentor'
        });
    }
};

/**
 * Update mentor
 * @route PUT /api/v1/mentors/:id
 */
export const updateMentor = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Don't allow password update through this route
        delete updateData.password;

        const mentor = await Mentor.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Mentor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Mentor updated successfully',
            data: mentor
        });
    } catch (error) {
        console.error('Update mentor error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating mentor'
        });
    }
};

/**
 * Delete mentor (Admin only)
 * @route DELETE /api/v1/mentors/:id
 */
export const deleteMentor = async (req, res) => {
    try {
        const { id } = req.params;

        const mentor = await Mentor.findByIdAndDelete(id);

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Mentor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Mentor deleted successfully'
        });
    } catch (error) {
        console.error('Delete mentor error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting mentor'
        });
    }
};

/**
 * Update mentor availability
 * @route PUT /api/v1/mentors/availability
 */
export const updateAvailability = async (req, res) => {
    try {
        const { slots } = req.body;

        // Find mentor by email (since req.user has email)
        const mentor = await Mentor.findOne({ email: req.user.email });

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Mentor profile not found'
            });
        }

        // Get existing slots to detect deletions
        const oldSlots = mentor.slots || [];
        const newSlots = slots || [];

        // Only validate if we're actually reducing the number of slots
        // This prevents false positives from ID mismatches
        if (newSlots.length < oldSlots.length) {
            // Check if any of the old booked slots are missing in the new slots
            for (const oldSlot of oldSlots) {
                if (oldSlot.isBooked) {
                    // Check if this booked slot still exists in new slots by matching time/date
                    const stillExists = newSlots.some(newSlot => {
                        const oldDate = oldSlot.date ? new Date(oldSlot.date).toDateString() : null;
                        const newDate = newSlot.date ? new Date(newSlot.date).toDateString() : null;

                        return (
                            oldSlot.day === newSlot.day &&
                            oldSlot.startTime === newSlot.startTime &&
                            oldSlot.endTime === newSlot.endTime &&
                            oldDate === newDate
                        );
                    });

                    if (!stillExists) {
                        const slotDate = oldSlot.date ? new Date(oldSlot.date) : null;
                        return res.status(400).json({
                            success: false,
                            message: `Cannot delete slot ${oldSlot.startTime} - ${oldSlot.endTime}${slotDate ? ' on ' + slotDate.toLocaleDateString() : ' (' + oldSlot.day + ')'} because it has an active booking. Please cancel the booking first.`
                        });
                    }
                }
            }
        }

        mentor.slots = slots;
        await mentor.save();

        res.status(200).json({
            success: true,
            message: 'Availability updated successfully',
            data: mentor.slots
        });
    } catch (error) {
        console.error('Update availability error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating availability'
        });
    }
};

// Get current mentor's profile (for authenticated mentor)
export const getMyMentorProfile = async (req, res) => {
    try {
        const mentor = await Mentor.findOne({ email: req.user.email });

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Mentor profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: mentor
        });
    } catch (error) {
        console.error('Get mentor profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching mentor profile'
        });
    }
};
