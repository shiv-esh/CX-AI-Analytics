
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import Sidebar from './components/Sidebar';
import InsightCard from './components/InsightCard';
import DataView from './components/DataView';
import HistoryView from './components/HistoryView';
import { processQuery } from './utils/dataEngine';

function App() {
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('cx_analytics_messages');
        if (saved) return JSON.parse(saved);
        return [
            {
                id: 'welcome',
                type: 'bot',
                content: {
                    answerText: "Hello! I'm your CX Analytics Assistant. Ask me anything about customer feedback, like 'Why are reviews negative at Dubai Mall?' or 'Show me the trend of complaints'.",
                    chartConfig: { type: 'none', data: [] },
                    evidence: []
                }
            }
        ];
    });

    // Save messages to localStorage
    useEffect(() => {
        localStorage.setItem('cx_analytics_messages', JSON.stringify(messages));
    }, [messages]);
    const [input, setInput] = useState('');
    const [lastIntent, setLastIntent] = useState(() => {
        const saved = localStorage.getItem('cx_analytics_context');
        return saved ? JSON.parse(saved) : null;
    });

    // Save context to localStorage
    useEffect(() => {
        localStorage.setItem('cx_analytics_context', JSON.stringify(lastIntent));
    }, [lastIntent]);
    // Load history from localStorage on mount
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('cx_analytics_history');
        return saved ? JSON.parse(saved) : [];
    });

    // Save history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cx_analytics_history', JSON.stringify(history));
    }, [history]);

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (activeTab === 'Dashboard') {
            scrollToBottom();
        }
    }, [messages, loading, activeTab]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await processQuery(userMessage.content, lastIntent);

            // Add to history with query type detection
            setHistory(prev => [...prev.slice(-19), { // Keep last 20 queries
                query: userMessage.content,
                timestamp: Date.now(),
                type: response?.chartConfig?.type === 'line' ? 'Trend' : 'Comparison'
            }]);

            if (response.intent) {
                setLastIntent(response.intent);
            }

            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: response,
                queryRef: userMessage.content
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error processing query:", error);
            // Even if it fails, we keep the record in history
            setHistory(prev => [...prev.slice(-19), {
                query: userMessage.content,
                timestamp: Date.now(),
                type: 'Failed'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const resetContext = () => {
        setLastIntent(null);
        setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'bot',
            content: {
                answerText: "Context has been reset. How can I help you from scratch?",
                chartConfig: { type: 'none', data: [] },
                evidence: []
            }
        }]);
    };

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans text-gray-900 overflow-hidden">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="ml-64 flex-1 flex flex-col h-screen relative">

                {activeTab === 'Dashboard' ? (
                    <>
                        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 shadow-sm z-10 sticky top-0 flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                AI Insights Dashboard
                                {lastIntent && <span className="text-[10px] font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 animate-pulse ml-2 flex items-center gap-1"><span className="w-1 h-1 bg-blue-500 rounded-full"></span>Context Active</span>}
                            </h2>

                            {lastIntent && (
                                <button
                                    onClick={resetContext}
                                    className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 group py-1 px-2 hover:bg-red-50 rounded-lg"
                                >
                                    Clear Session
                                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center text-[8px] group-hover:border-red-400">×</span>
                                </button>
                            )}
                        </header>

                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 scroll-smooth pb-32">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg border-2 ${msg.type === 'bot' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-white' : 'bg-gray-200 border-white'}`}>
                                        {msg.type === 'bot' ? <Bot className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-gray-600" />}
                                    </div>
                                    <div className={`max-w-5xl w-full transition-all duration-300 ${msg.type === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-md px-6 py-4' : ''}`}>
                                        {msg.type === 'user' ? (
                                            <p className="text-lg font-medium leading-relaxed">{msg.content}</p>
                                        ) : (
                                            <InsightCard
                                                query={msg.queryRef || "Introduction"}
                                                response={msg.content}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg border-2 border-white">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-3 w-64 animate-pulse">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                        <span className="text-gray-500 text-sm font-medium">Analyzing feedback data...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="absolute bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 px-8 py-5 z-20">
                            <form onSubmit={handleSend} className="max-w-4xl mx-auto relative shadow-xl rounded-2xl">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about customer reviews..."
                                    className="w-full pl-6 pr-16 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-lg shadow-sm placeholder-gray-400 bg-white"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="absolute right-3 top-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : activeTab === 'Data' ? (
                    <div className="flex-1 overflow-hidden">
                        <DataView />
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto bg-gray-50">
                        <HistoryView
                            history={history}
                            onSelectQuery={(item) => {
                                // For now, just switch back to dashboard. 
                                // In a real app we'd scroll to that message.
                                setActiveTab('Dashboard');
                            }}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
