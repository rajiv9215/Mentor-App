import React, { useState } from "react";
import Button from "../../components/Btncomponent";

const MentorSuggestionForm = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [goals, setGoals] = useState("");
  const [experience, setExperience] = useState("");
  const [preferredMentor, setPreferredMentor] = useState("");
  const [communicationPreference, setCommunicationPreference] = useState("");
  const [availableTime, setAvailableTime] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Call API or send data to server to suggest a mentor
    console.log({
      name,
      email,
      industry,
      goals,
      experience,
      preferredMentor,
      communicationPreference,
      availableTime,
    });
  };

  const inputClasses = "shadow-sm appearance-none border border-neutral-200 rounded-xl w-full py-3 px-4 text-neutral-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";
  const labelClasses = "block text-neutral-700 text-sm font-bold mb-2";

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto rounded-3xl -rotate-1 bg-primary-600 shadow-2xl transition-all hover:rotate-0 duration-500">
        <div className="bg-white rounded-3xl mx-auto p-10 rotate-1 shadow-inner">
          <form onSubmit={handleSubmit} className="leading-loose">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary-900">Find a Mentor!</h2>

            <div className="mb-6">
              <label className={labelClasses} htmlFor="name">Name</label>
              <input
                className={inputClasses}
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className={labelClasses} htmlFor="email">Email</label>
              <input
                className={inputClasses}
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelClasses} htmlFor="industry">Industry</label>
                <select
                  className={inputClasses}
                  id="industry"
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                >
                  <option value="">Select industry</option>
                  <option value="tech">Tech</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                </select>
              </div>

              <div>
                <label className={labelClasses} htmlFor="experience">Experience Level</label>
                <select
                  className={inputClasses}
                  id="experience"
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClasses} htmlFor="preferredMentor">Mentor Type</label>
              <select
                className={inputClasses}
                id="preferredMentor"
                value={preferredMentor}
                onChange={(event) => setPreferredMentor(event.target.value)}
              >
                <option value="">Select mentor type</option>
                <option value="career">Career Guidance</option>
                <option value="industry">Industry Insights</option>
                <option value="networking">Networking</option>
              </select>
            </div>

            <div className="mb-8">
              <label className={labelClasses} htmlFor="goals">Goals</label>
              <textarea
                className={`${inputClasses} h-32 resize-none`}
                id="goals"
                placeholder="What do you hope to achieve?"
                value={goals}
                onChange={(event) => setGoals(event.target.value)}
              />
            </div>

            <div className="text-center">
              <Button type="submit" variant="primary" className="w-full md:w-auto px-12 py-3 text-lg">
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorSuggestionForm;
