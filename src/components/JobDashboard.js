// ------- JOB DASHBOARD (client/src/components/JobDashboard.js) ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchJobs();
    }, [filter]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            let url = '/api/jobs';

            if (filter !== 'all') {
                url += `?status=${filter}`;
            }

            const response = await axios.get(url);
            setJobs(response.data.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleManualApply = async (jobId) => {
        try {
            const response = await axios.post(`/api/jobs/apply/${jobId}`);

            if (response.data.success) {
                fetchJobs();
            }
        } catch (error) {
            console.error('Error applying to job:', error);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-800';
            case 'applied':
                return 'bg-green-100 text-green-800';
            case 'manual_intervention_needed':
                return 'bg-orange-100 text-orange-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'interview':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatSalary = (salary) => {
        if (!salary.min && !salary.max) return 'Not specified';
        if (salary.min && !salary.max) return `₹${salary.min / 100000}L+`;
        if (!salary.min && salary.max) return `Up to ₹${salary.max / 100000}L`;
        return `₹${salary.min / 100000}L - ₹${salary.max / 100000}L`;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Job Applications Dashboard</h1>

            <div className="mb-6">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('new')}
                        className={`px-4 py-2 rounded ${filter === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        New
                    </button>
                    <button
                        onClick={() => setFilter('applied')}
                        className={`px-4 py-2 rounded ${filter === 'applied' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Applied
                    </button>
                    <button
                        onClick={() => setFilter('manual_intervention_needed')}
                        className={`px-4 py-2 rounded ${filter === 'manual_intervention_needed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Needs Action
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No jobs found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div key={job._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                            <div className="p-4 border-b">
                                <div className="flex justify-between items-start">
                                    <h2 className="font-bold text-lg mb-1">{job.title}</h2>
                                    <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeClass(job.status)}`}>
                                        {job.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <p className="text-gray-600">{job.company}</p>
                                {job.location && <p className="text-gray-500 text-sm">{job.location}</p>}
                            </div>

                            <div className="p-4 bg-gray-50">
                                <div className="mb-2">
                                    <span className="text-gray-600 text-sm">Salary: </span>
                                    <span className="font-medium">{formatSalary(job.salary)}</span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-gray-600 text-sm">Source: </span>
                                    <span className="font-medium">{job.source}</span>
                                </div>
                                {job.dateFound && (
                                    <div className="mb-2 text-sm text-gray-500">
                                        Found: {new Date(job.dateFound).toLocaleDateString()}
                                    </div>
                                )}
                                {job.dateApplied && (
                                    <div className="mb-2 text-sm text-gray-500">
                                        Applied: {new Date(job.dateApplied).toLocaleDateString()}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex justify-between border-t">
                                <a
                                    href={job.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    View Job
                                </a>

                                {job.status === 'manual_intervention_needed' && (
                                    <button
                                        onClick={() => handleManualApply(job._id)}
                                        className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                        Try Again
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobDashboard;