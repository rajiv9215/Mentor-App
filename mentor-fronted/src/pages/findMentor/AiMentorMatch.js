import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaRobot, FaBrain, FaSearch, FaCheckCircle, FaLightbulb, FaUserTie, FaArrowRight, FaArrowLeft, FaStar } from 'react-icons/fa';
import mentorService from '../../services/mentorService';

const AiMentorMatch = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [analysisText, setAnalysisText] = useState('');
    const [mentors, setMentors] = useState([]);
    const [matches, setMatches] = useState([]);

    // Constants
    const INDUSTRIES = [
        "Software Development", "Data Science", "Product Management",
        "Design", "Marketing", "Business"
    ];

    const SKILLS = [
        'JavaScript', 'React', 'Python', 'Leadership', 'System Design',
        'UI/UX', 'Marketing Strategy', 'Public Speaking', 'Data Analysis',
        'Career Growth', 'Networking', 'Project Management'
    ];

    // User inputs
    const [formData, setFormData] = useState({
        role: '',
        experience: '',
        industry: '',
        skills: [],
        goals: ''
    });

    // Fetch all mentors on mount
    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await mentorService.getAllMentors();
                if (response.success) {
                    setMentors(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch mentors", error);
            }
        };
        fetchMentors();
    }, []);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const toggleSkill = (skill) => {
        const currentSkills = formData.skills;
        if (currentSkills.includes(skill)) {
            setFormData({ ...formData, skills: currentSkills.filter(s => s !== skill) });
        } else {
            setFormData({ ...formData, skills: [...currentSkills, skill] });
        }
    };

    const runAiAnalysis = () => {
        setLoading(true);
        const properAnalysisSteps = [
            "Analyzing your profile...",
            "Accessing mentor database...",
            "Matching skills and expertise...",
            "Calculating compatibility scores...",
            "Finalizing best matches..."
        ];

        let stepIndex = 0;
        setAnalysisText(properAnalysisSteps[0]);

        const interval = setInterval(() => {
            stepIndex++;
            if (stepIndex < properAnalysisSteps.length) {
                setAnalysisText(properAnalysisSteps[stepIndex]);
            } else {
                clearInterval(interval);
                performMatching();
                setLoading(false);
                setStep(5); // Go to results
            }
        }, 800);
    };

    const performMatching = () => {
        // AI Heuristic Matching Logic
        const scoredMentors = mentors.map(mentor => {
            let score = 0;
            const maxScore = 100;

            // 1. Industry Match (30 points)
            if (mentor.category === formData.industry || mentor.jobTitle.toLowerCase().includes(formData.role.toLowerCase())) {
                score += 30;
            }

            // 2. Skill Match (40 points)
            // Calculate overlap between user desired skills and mentor skills
            const mentorSkills = mentor.skills.map(s => s.toLowerCase());
            const userSkills = formData.skills.map(s => s.toLowerCase());

            const matchingSkills = userSkills.filter(skill =>
                mentorSkills.some(ms => ms.includes(skill))
            );

            if (userSkills.length > 0) {
                const skillMatchRatio = matchingSkills.length / userSkills.length;
                score += (skillMatchRatio * 40);
            }

            // 3. Keyword Match in Bio (10 points)
            if (formData.goals) {
                const keywords = formData.goals.toLowerCase().split(' ');
                const bio = mentor.bio.toLowerCase();
                const keywordMatches = keywords.filter(word => word.length > 3 && bio.includes(word));
                if (keywordMatches.length > 0) score += 10;
            }

            // 4. Rating Bonus (up to 20 points)
            // 5 stars = 20 pts, 0 stars = 0 pts
            score += (mentor.rating / 5) * 20;

            return { ...mentor, matchScore: Math.round(score), matchingSkills };
        });

        // Filter out low scores and sort by highest score
        const topMatches = scoredMentors
            .filter(m => m.matchScore > 40) // Threshold
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 3); // Top 3

        setMatches(topMatches);
    };

    // Render Steps
    const renderStep1 = () => (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-white">Tell us about yourself</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-600 dark:text-neutral-300">Current Role / Title</label>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="e.g. Frontend Developer, Student"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-600 dark:text-neutral-300">Experience Level</label>
                    <select
                        className="w-full p-3 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    >
                        <option value="">Select Level</option>
                        <option value="beginner">Beginner (0-2 years)</option>
                        <option value="intermediate">Intermediate (3-5 years)</option>
                        <option value="advanced">Advanced (5+ years)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-600 dark:text-neutral-300">Target Industry</label>
                    <select
                        className="w-full p-3 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    >
                        <option value="">Select Industry</option>
                        {INDUSTRIES.map(ind => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={!formData.role || !formData.industry}
                    className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-primary-500/30"
                >
                    Next Step <FaArrowRight />
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-white">What skills do you want to learn?</h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">Select skills relevant to your {formData.industry} path.</p>

            <div className="flex flex-wrap gap-3 mb-8">
                {SKILLS.map(skill => (
                    <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full border transition-all ${formData.skills.includes(skill)
                            ? 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                            : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'
                            }`}
                    >
                        {skill} {formData.skills.includes(skill) && <FaCheckCircle className="inline ml-1 text-sm" />}
                    </button>
                ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
                <div className="flex gap-4">
                    <button onClick={handleBack} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300">Back</button>
                    {formData.skills.length > 0 && (
                        <button
                            onClick={() => setFormData({ ...formData, skills: [] })}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            Clear All
                        </button>
                    )}
                </div>
                <button
                    onClick={handleNext}
                    disabled={formData.skills.length === 0}
                    className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-primary-500/30"
                >
                    Next Step <FaArrowRight />
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-white">What are your main goals?</h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">Describe what you hope to achieve with a mentor. Our AI will analyze keywords to find the best match.</p>

            <textarea
                className="w-full h-40 p-4 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                placeholder="e.g. I want to transition from a junior to senior developer role and improve my system design skills..."
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
            />

            <div className="mt-8 flex justify-between">
                <button onClick={handleBack} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300">Back</button>
                <button
                    onClick={handleNext}
                    disabled={!formData.goals}
                    className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-primary-500/30"
                >
                    Analyze & Find Match <FaRobot />
                </button>
            </div>
        </div>
    );

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-primary-200 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 border-t-4 border-primary-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <FaBrain className="text-4xl text-primary-600 animate-bounce" />
                </div>
            </div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 mb-2">
                AI Matching in Progress
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-sm animate-pulse">
                {analysisText}
            </p>
        </div>
    );

    const renderResults = () => (
        <div className="animate-fade-in w-full">
            <div className="text-center mb-10">
                <div className="inline-block p-4 rounded-full bg-green-100 text-green-600 mb-4 text-3xl">
                    <FaCheckCircle />
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">We found your perfect mentors!</h2>
                <p className="text-neutral-600 dark:text-neutral-400">Based on your goals and skills, these mentors are the best fit.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {matches.length > 0 ? matches.map((mentor, index) => (
                    <div key={mentor._id} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xl border border-neutral-100 dark:border-neutral-700 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        {/* Match Score Badge */}
                        <div className="absolute top-0 right-0 bg-gradient-to-bl from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10 shadow-lg">
                            {mentor.matchScore}% MATCH
                        </div>

                        {index === 0 && (
                            <div className="absolute top-0 left-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-br-xl z-10 shadow-lg flex items-center gap-1">
                                <FaStar /> TOP CHOICE
                            </div>
                        )}

                        <div className="flex flex-col items-center mb-4 mt-4">
                            <img
                                src={mentor.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"}
                                alt={mentor.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-neutral-700 shadow-lg mb-4"
                            />
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white text-center">{mentor.name}</h3>
                            <p className="text-primary-600 font-medium text-sm text-center">{mentor.jobTitle} at {mentor.company}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300" title="Experience match">
                                <FaUserTie className="text-neutral-400" />
                                <span>{mentor.skills.slice(0, 2).join(', ')}...</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                <FaLightbulb className="text-yellow-500" />
                                <span>Matches {mentor.matchingSkills.length} of your skills</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate(`/mentor/${mentor._id}`)}
                            className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-3 rounded-xl font-bold hover:bg-primary-600 dark:hover:bg-primary-400 dark:hover:text-white transition-colors shadow-lg"
                        >
                            View Profile
                        </button>
                    </div>
                )) : (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-xl text-neutral-500">No high matches found. Try adjusting your skills.</p>
                        <button onClick={() => setStep(1)} className="mt-4 text-primary-600 font-bold underline">Start Over</button>
                    </div>
                )}
            </div>

            <div className="text-center mt-12">
                <button onClick={() => setStep(1)} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm font-medium">
                    Start New Search
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-dots-pattern">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                {step < 4 && (
                    <div className="mb-8 max-w-md mx-auto">
                        <div className="flex justify-between mb-2 text-xs font-semibold uppercase text-neutral-500">
                            <span className={step >= 1 ? "text-primary-600" : ""}>Profile</span>
                            <span className={step >= 2 ? "text-primary-600" : ""}>Skills</span>
                            <span className={step >= 3 ? "text-primary-600" : ""}>Goals</span>
                        </div>
                        <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-600 transition-all duration-500 ease-out"
                                style={{ width: `${(step / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <div className={`
                    ${step === 5 ? 'max-w-5xl' : 'max-w-2xl'} 
                    mx-auto bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl 
                    p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20 dark:border-neutral-800
                    transition-all duration-500
                `}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderLoading()}
                    {step === 5 && renderResults()}
                </div>
            </div>
        </div>
    );
};

export default AiMentorMatch;
