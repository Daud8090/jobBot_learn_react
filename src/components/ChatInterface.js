// ------- CHATBOT INTERFACE (client/src/components/ChatInterface.js) -------
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi! I\'m your job application assistant. What kind of jobs are you looking for?' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [jobPreferences, setJobPreferences] = useState({
        jobTitle: '',
        keywords: [],
        salaryMin: 1700000,
        salaryMax: 2500000,
        location: '',
        sources: ['linkedin', 'naukri', 'hirist'],
        autoApply: true,
    });
    const [stage, setStage] = useState('initial'); // initial, collecting, confirmed, searching
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages((msgs) => [...msgs, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Process user message based on current stage
            processUserMessage(userMessage.text);
        } catch (error) {
            console.error('Error processing message:', error);
            addBotMessage('Sorry, I encountered an error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const processUserMessage = async (text) => {
        // Simple NLP to extract job search criteria
        if (stage === 'initial') {
            // Extract job title and keywords
            const jobInfo = extractJobInfo(text);
            if (jobInfo.jobTitle) {
                setJobPreferences((prev) => ({
                    ...prev,
                    jobTitle: jobInfo.jobTitle,
                    keywords: jobInfo.keywords,
                }));

                addBotMessage(`Great! I'll look for ${jobInfo.jobTitle} positions. What location are you interested in?`);
                setStage('collecting_location');
            } else {
                addBotMessage('Could you tell me what job title you\'re looking for? For example: "Node.js Developer" or "SDE2"');
            }
        } else if (stage === 'collecting_location') {
            setJobPreferences((prev) => ({
                ...prev,
                location: text.trim(),
            }));

            addBotMessage(`Thanks! I'll look for jobs in ${text.trim()}. Let me confirm your preferences:
      
            Job Title: ${jobPreferences.jobTitle}
            Keywords: ${jobPreferences.keywords.join(', ')}
            Salary Range: ₹${jobPreferences.salaryMin / 100000}-${jobPreferences.salaryMax / 100000} lakhs
            Location: ${text.trim()}
            Sources: LinkedIn, Naukri, Hirist
            Auto-Apply: ${jobPreferences.autoApply ? 'Yes' : 'No'}

            Are these preferences correct? (Yes/No)`);
            setStage('confirming');
        } else if (stage === 'confirming') {
            if (text.toLowerCase().includes('yes')) {
                addBotMessage('Great! I\'ll start searching for jobs that match your criteria. This might take a few minutes...');
                setStage('initial');// todo

                // Save preferences
                await savePreferences();

                // Start job search
                const searchResult = await startJobSearch();
                console.log(searchResult,"------------->>");
                
                if (searchResult.success) {
                    addBotMessage(`Job search completed! Found ${searchResult.count} matching jobs. 
          
                    ${searchResult.autoApplied} jobs were automatically applied to.
                    ${searchResult.manualNeeded} jobs need manual intervention.

                    I'll notify you on WhatsApp when manual intervention is needed or when new jobs are found.`);
                } else {
                    addBotMessage('There was an error during the job search. Please try again later.');
                    addBotMessage('Can you tell again me again what kind of jobs are you looking for');
                }
            } else {
                addBotMessage('Let\'s adjust your preferences. What would you like to change?');
                setStage('adjusting');
            }
        } else if (stage === 'adjusting' && !text.toLowerCase().includes('continue')) {
            // Handle preference adjustments
            if (text.toLowerCase().includes('job') || text.toLowerCase().includes('title')) {
                addBotMessage('What job title are you looking for?');
                setStage('updating_job');
            } else if (text.toLowerCase().includes('location')) {
                addBotMessage('What location are you interested in?');
                setStage('updating_location');
            } else if (text.toLowerCase().includes('salary')) {
                addBotMessage('What salary range are you looking for? Format: min-max in lakhs (e.g., "17-25")');
                setStage('updating_salary');
            } else {
                addBotMessage('I didn\'t understand what you want to change. Would you like to modify the job title, location, or salary range?');
            }
        } else if (stage === 'updating_job') {
            const jobInfo = extractJobInfo(text);
            setJobPreferences((prev) => ({
                ...prev,
                jobTitle: jobInfo.jobTitle,
                keywords: jobInfo.keywords,
            }));

            addBotMessage(`Updated job title to ${jobInfo.jobTitle}. Anything else you'd like to change? If not, say "Continue".`);
            setStage('adjusting');
        } else if (stage === 'updating_location') {
            setJobPreferences((prev) => ({
                ...prev,
                location: text.trim(),
            }));

            addBotMessage(`Updated location to ${text.trim()}. Anything else you'd like to change? If not, say "Continue".`);
            setStage('adjusting');
        } else if (stage === 'updating_salary') {
            const salaryMatch = text.match(/(\d+)(?:-|\s+to\s+)(\d+)/i);
            if (salaryMatch) {
                const min = parseInt(salaryMatch[1], 10) * 100000;
                const max = parseInt(salaryMatch[2], 10) * 100000;

                setJobPreferences((prev) => ({
                    ...prev,
                    salaryMin: min,
                    salaryMax: max,
                }));

                addBotMessage(`Updated salary range to ₹${min / 100000}-${max / 100000} lakhs. Anything else you'd like to change? If not, say "Continue".`);
            } else {
                addBotMessage('I couldn\'t understand the salary range. Please provide it in the format "min-max" in lakhs (e.g., "17-25").');
            }
            setStage('adjusting');
        } else if (stage === 'adjusting' && text.toLowerCase().includes('continue')) {
            addBotMessage(`Here are your updated preferences:
      
            Job Title: ${jobPreferences.jobTitle}
            Keywords: ${jobPreferences.keywords.join(', ')}
            Salary Range: ₹${jobPreferences.salaryMin / 100000}-${jobPreferences.salaryMax / 100000} lakhs
            Location: ${jobPreferences.location}
            Sources: LinkedIn, Naukri, Hirist
            Auto-Apply: ${jobPreferences.autoApply ? 'Yes' : 'No'}

            Are these preferences correct? (Yes/No)`);
                        setStage('confirming');
        }
    };

    const extractJobInfo = (text) => {
        const jobInfo = {
            jobTitle: '',
            keywords: [],
        };

        // Extract job title (simplified)
        const titleMatch = text.match(/(node\.?js|react\.?js|javascript|sde\d*|software\s+engineer|software\s+developer|developer|full\s+stack| fullstack| full| stack)/i);
        if (titleMatch) {
            jobInfo.jobTitle = titleMatch[0];

            // Extract keywords
            const techKeywords = ['node.js', 'react.js', 'javascript', 'mysql', 'mongodb', 'express','developer', 'fullstack'];
            techKeywords.forEach(keyword => {
                if (text.toLowerCase().includes(keyword.toLowerCase())) {
                    jobInfo.keywords.push(keyword);
                }
            });
        }

        return jobInfo;
    };

    const addBotMessage = (text) => {
        setMessages((msgs) => [...msgs, { sender: 'bot', text }]);
    };

    const savePreferences = async () => {
        try {
            const response = await axios.post('/api/jobs/preferences', jobPreferences);
            console.log(response);
            return response.data.success;
        } catch (error) {
            console.error('Error saving preferences:', error);
            return false;
        }
    };

    const startJobSearch = async () => {
        try {
            const response = await axios.post('/api/jobs/search');

            // Get the list of jobs to count stats
            const jobsResponse = await axios.get('/api/jobs');

            const allJobs = jobsResponse.data.data;
            const autoApplied = allJobs.filter(job => job.status === 'applied').length;
            const manualNeeded = allJobs.filter(job => job.status === 'manual_intervention_needed').length;

            return {
                success: response.data.success,
                count: allJobs.length,
                autoApplied,
                manualNeeded,
            };
        } catch (error) {
            console.error('Error starting job search:', error);
            return { success: false };
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="p-4 bg-blue-600 text-white">
                <h1 className="text-2xl font-bold">Job Application Assistant</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`my-2 p-3 rounded-lg ${message.sender === 'user'
                                ? 'ml-auto bg-blue-500 text-white max-w-md'
                                : 'mr-auto bg-white text-gray-800 max-w-md shadow'
                            }`}
                    >
                        {message.text.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                ))}
                {loading && (
                    <div className="flex my-2">
                        <div className="bg-gray-200 rounded-full p-2 px-4">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
                <div className="flex">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message here..."
                        className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                        disabled={loading}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;