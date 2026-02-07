import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import Button from '../components/Btncomponent';
import authService from '../services/authService';
import { addUser } from '../store/userSlice';

const UserProfile = () => {
    const user = useSelector((store) => store.user?.user);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await authService.updateProfile(formData);
            if (response.success) {
                dispatch(addUser(response.data));
                setMessage({ text: 'Profile updated successfully!', type: 'success' });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Update error:', error);
            setMessage({ text: 'Failed to update profile', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            location: user.location || ''
        });
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
                <p className="text-xl text-neutral-600 dark:text-neutral-400">Please log in to view your profile</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-20 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary-600 text-4xl font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                                    <p className="text-primary-100">{user.role}</p>
                                </div>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-2"
                                >
                                    <FaEdit /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        {message.text && (
                            <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                    <FaUser className="inline mr-2" /> Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-lg text-neutral-900 dark:text-white">{user.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                    <FaEnvelope className="inline mr-2" /> Email
                                </label>
                                <p className="text-lg text-neutral-900 dark:text-white">{user.email}</p>
                                <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                    <FaPhone className="inline mr-2" /> Phone
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-lg text-neutral-900 dark:text-white">{user.phone || 'Not provided'}</p>
                                )}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                    <FaMapMarkerAlt className="inline mr-2" /> Location
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-lg text-neutral-900 dark:text-white">{user.location || 'Not provided'}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-4 mt-8">
                                <Button variant="primary" onClick={handleSave} disabled={loading}>
                                    <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button variant="outline" onClick={handleCancel}>
                                    <FaTimes className="mr-2" /> Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
