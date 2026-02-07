import React, { useState, useEffect } from 'react';
import {
    FaUsers, FaUserCheck, FaChartLine, FaDollarSign,
    FaCheckCircle, FaTimesCircle, FaClock, FaEye,
    FaUserGraduate, FaCalendarAlt, FaBell
} from 'react-icons/fa';
import Button from '../../components/Btncomponent';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for dashboard data
    const [dashboardStats, setDashboardStats] = useState({
        totalUsers: 0,
        totalMentors: 0,
        pendingApplications: 0,
        totalBlogs: 0,
        newUsers: 0,
        newApplications: 0
    });
    const [topMentors, setTopMentors] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [pendingApplications, setPendingApplications] = useState([]);

    // Fetch dashboard data on mount
    useEffect(() => {
        fetchDashboardData();
        fetchPendingApplications();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await adminService.getDashboardStats();
            if (response.success) {
                setDashboardStats(response.data.stats);
                setTopMentors(response.data.topMentors || []);
                setRecentUsers(response.data.recentUsers || []);
                setRecentApplications(response.data.recentApplications || []);
            }
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingApplications = async () => {
        try {
            const response = await adminService.getPendingApplications();
            if (response.success) {
                setPendingApplications(response.data || []);
            }
        } catch (err) {
            console.error('Error fetching pending applications:', err);
        }
    };

    const handleApprove = async (id) => {
        try {
            await adminService.approveMentorApplication(id);
            // Refresh the applications list
            fetchPendingApplications();
            fetchDashboardData();
        } catch (err) {
            console.error('Error approving application:', err);
            alert('Failed to approve application');
        }
    };

    const handleReject = async (id) => {
        try {
            await adminService.rejectMentorApplication(id);
            // Refresh the applications list
            fetchPendingApplications();
            fetchDashboardData();
        } catch (err) {
            console.error('Error rejecting application:', err);
            alert('Failed to reject application');
        }
    };

    // Stats cards configuration
    const stats = [
        { icon: <FaUsers />, label: 'Total Users', value: dashboardStats.totalUsers, change: '+12%', color: 'primary' },
        { icon: <FaUserCheck />, label: 'Active Mentors', value: dashboardStats.totalMentors, change: '+8%', color: 'secondary' },
        { icon: <FaUserGraduate />, label: 'Pending Applications', value: dashboardStats.pendingApplications, change: '+23%', color: 'accent' },
        { icon: <FaDollarSign />, label: 'Total Blogs', value: dashboardStats.totalBlogs, change: '+15%', color: 'primary' }
    ];

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Admin Dashboard</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">Manage mentors, users, and platform insights</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === 'overview'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === 'applications'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                    >
                        Pending Applications ({pendingApplications.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === 'insights'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                    >
                        Insights
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`text-3xl text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                            {stat.icon}
                                        </div>
                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                                            {stat.change}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">{stat.value}</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                                <FaBell className="text-primary-600 dark:text-primary-400" />
                                Recent Activity
                            </h2>
                            {loading ? (
                                <div className="text-center py-8">
                                    <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
                                </div>
                            ) : recentUsers.length === 0 && recentApplications.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-neutral-500 dark:text-neutral-400">No recent activity</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Recent Users */}
                                    {recentUsers.slice(0, 3).map((user, index) => (
                                        <div key={`user-${index}`} className="flex items-start gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <p className="text-neutral-900 dark:text-white">
                                                    <span className="font-semibold">{user.name}</span> joined as a new user
                                                </p>
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Recent Applications */}
                                    {recentApplications.slice(0, 2).map((app, index) => (
                                        <div key={`app-${index}`} className="flex items-start gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                                            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <p className="text-neutral-900 dark:text-white">
                                                    <span className="font-semibold">{app.name}</span> applied to become a mentor
                                                </p>
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                                Pending Mentor Applications
                            </h2>

                            {loading ? (
                                <div className="text-center py-12">
                                    <p className="text-neutral-600 dark:text-neutral-400">Loading applications...</p>
                                </div>
                            ) : pendingApplications.length === 0 ? (
                                <div className="text-center py-12">
                                    <FaCheckCircle className="text-6xl text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
                                    <p className="text-neutral-600 dark:text-neutral-400">No pending applications</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingApplications.map((app) => (
                                        <div key={app._id} className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{app.name}</h3>
                                                            <p className="text-primary-600 dark:text-primary-400 font-medium">{app.expertise}</p>
                                                        </div>
                                                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-semibold flex items-center gap-1">
                                                            <FaClock size={12} /> Pending
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                                        <div>
                                                            <span className="font-semibold">Email:</span> {app.email}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold">Experience:</span> {app.experience}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold">Applied:</span> {new Date(app.createdAt).toLocaleDateString()}
                                                        </div>
                                                        {app.linkedin && (
                                                            <div>
                                                                <span className="font-semibold">LinkedIn:</span>{' '}
                                                                <a href={app.linkedin.startsWith('http') ? app.linkedin : `https://${app.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                                                                    View Profile
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleApprove(app._id)}
                                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                                    >
                                                        <FaCheckCircle /> Approve
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleReject(app._id)}
                                                        className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <FaTimesCircle /> Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Insights Tab */}
                {activeTab === 'insights' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Platform Growth */}
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FaChartLine className="text-primary-600 dark:text-primary-400" />
                                    Platform Growth (Last 30 Days)
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-neutral-600 dark:text-neutral-400">User Signups</span>
                                            <span className="font-bold text-neutral-900 dark:text-white">+{dashboardStats.newUsers}</span>
                                        </div>
                                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                                            <div className="bg-primary-600 h-2 rounded-full" style={{ width: dashboardStats.totalUsers > 0 ? `${Math.min(100, (dashboardStats.newUsers / dashboardStats.totalUsers) * 100)}%` : '0%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-neutral-600 dark:text-neutral-400">Mentor Applications</span>
                                            <span className="font-bold text-neutral-900 dark:text-white">+{dashboardStats.newApplications}</span>
                                        </div>
                                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                                            <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-neutral-600 dark:text-neutral-400">Total Approved Mentors</span>
                                            <span className="font-bold text-neutral-900 dark:text-white">{dashboardStats.totalMentors}</span>
                                        </div>
                                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                                            <div className="bg-accent-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Top Mentors */}
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FaUserCheck className="text-primary-600 dark:text-primary-400" />
                                    Top Performing Mentors
                                </h3>
                                <div className="space-y-3">
                                    {loading ? (
                                        <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
                                    ) : topMentors.length === 0 ? (
                                        <p className="text-neutral-500 dark:text-neutral-400 text-center py-4">No data available</p>
                                    ) : (
                                        topMentors.map((mentor, index) => (
                                            <div key={mentor._id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg transition-all hover:shadow-md">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 overflow-hidden">
                                                        {mentor.avatar ? (
                                                            <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span>{index + 1}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-neutral-900 dark:text-white block">{mentor.name}</span>
                                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{mentor.company}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400 block">{mentor.totalSessions}</span>
                                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">sessions</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
