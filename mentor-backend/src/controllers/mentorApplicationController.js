import MentorApplication from '../model/mentorApplication.Model.js';
import Mentor from '../model/mentor.Model.js';
import User from '../model/user.Model.js';

/**
 * Submit mentor application
 * @route POST /api/v1/applications/mentor
 */
export const submitApplication = async (req, res) => {
    try {
        const { name, email, expertise, experience, linkedin, message } = req.body;

        // Validate required fields
        if (!name || !email || !expertise || !experience || !message) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Check if application already exists for this email
        const existingApplication = await MentorApplication.findOne({
            email,
            status: 'pending'
        });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message: 'You already have a pending application. Please wait for review.'
            });
        }

        // Create application
        const application = await MentorApplication.create({
            name,
            email,
            expertise,
            experience,
            linkedin,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully! We will review it within 48 hours.',
            data: application
        });
    } catch (error) {
        console.error('Submit application error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error submitting application'
        });
    }
};

/**
 * Get all mentor applications (Admin only)
 * @route GET /api/v1/applications/mentor
 */
export const getAllApplications = async (req, res) => {
    try {
        const { status } = req.query;

        let query = {};
        if (status) {
            query.status = status;
        }

        const applications = await MentorApplication.find(query)
            .populate('reviewedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching applications'
        });
    }
};

/**
 * Update application status (Admin only)
 * @route PUT /api/v1/applications/mentor/:id
 */
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reviewNotes } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be "approved" or "rejected"'
            });
        }

        const application = await MentorApplication.findByIdAndUpdate(
            id,
            {
                status,
                reviewNotes,
                reviewedBy: req.user._id,
                reviewedAt: new Date()
            },
            { new: true }
        ).populate('reviewedBy', 'name email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (status === 'approved') {
            // Check if mentor already exists with this email
            const existingMentor = await Mentor.findOne({ email: application.email });

            if (!existingMentor) {
                // Create random password (since they likely login as User)
                const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

                // Map application fields to Mentor model
                await Mentor.create({
                    name: application.name,
                    email: application.email,
                    password: randomPassword,
                    category: application.expertise, // Mapping expertise to category
                    bio: application.message, // Using message as initial bio
                    jobTitle: 'Mentor',
                    company: 'Independent',
                    skills: [application.expertise],
                    linkedIn: application.linkedin,
                    experience: application.experience,
                    isApproved: true,
                    availability: 'available'
                });
            }

            // Update User role if exists
            await User.findOneAndUpdate(
                { email: application.email },
                { role: 'mentor' }
            );
        }

        res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            data: application
        });
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating application'
        });
    }
};
