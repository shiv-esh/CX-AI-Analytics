
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Menu, Database, History as HistoryIcon } from 'lucide-react';
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

    useEffect(() => {
        localStorage.setItem('cx_analytics_messages', JSON.stringify(messages));
    }, [messages]);

    const [input, setInput] = useState('');
    const [lastIntent, setLastIntent] = useState(() => {
        const saved = localStorage.getItem('cx_analytics_context');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        localStorage.setItem('cx_analytics_context', JSON.stringify(lastIntent));
    }, [lastIntent]);

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('cx_analytics_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cx_analytics_history', JSON.stringify(history));
    }, [history]);

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
            setHistory(prev => [...prev.slice(-19), {
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
        <div className="flex bg-gray-50 h-screen font-sans text-gray-900 overflow-hidden">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="md:pl-64 flex-1 flex flex-col min-w-0 bg-white relative">
                {/* Unified Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 py-4 shadow-sm z-20 sticky top-0 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-gray-800 whitespace-nowrap">
                            {activeTab === 'Dashboard' && <Sparkles className="w-5 h-5 text-yellow-500 shrink-0" />}
                            {activeTab === 'Data' && <Database className="w-5 h-5 text-blue-500 shrink-0" />}
                            {activeTab === 'History' && <HistoryIcon className="w-5 h-5 text-purple-500 shrink-0" />}
                            <span>{activeTab === 'Dashboard' ? 'AI Insights' : activeTab}</span>

                            {activeTab === 'Dashboard' && lastIntent && (
                                <span className="text-[10px] font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 animate-pulse ml-2 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-blue-500 rounded-full"></span>Active
                                </span>
                            )}
                        </h2>
                    </div>

                    {activeTab === 'Dashboard' && lastIntent && (
                        <button
                            onClick={resetContext}
                            className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 group py-1 px-2 hover:bg-red-50 rounded-lg"
                        >
                            Clear Session
                            <span className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center text-[8px]">×</span>
                        </button>
                    )}
                </header>

                {activeTab === 'Dashboard' ? (
                    <>
                        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 md:space-y-8 scroll-smooth pb-10">
                            <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg border-2 ${msg.type === 'bot' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-white' : 'bg-gray-200 border-white text-gray-600'}`}>
                                            {msg.type === 'bot' ? <Bot className="w-6 h-6 text-white" /> : <User className="w-6 h-6" />}
                                        </div>
                                        <div className={`w-full ${msg.type === 'user' ? 'max-w-xl bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-md px-6 py-4' : ''}`}>
                                            {msg.type === 'user' ? (
                                                <p className="text-base md:text-lg font-medium leading-relaxed">{msg.content}</p>
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
                                    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg border-2 border-white">
                                            <Bot className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-3 w-64 animate-pulse">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                            </div>
                                            <span className="text-gray-500 text-sm font-medium">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} className="h-4" />
                            </div>
                        </div>

                        <div className="bg-gray-50/50 border-t border-gray-200 px-4 md:px-8 py-4 md:py-6 shrink-0 z-10">
                            <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-300"></div>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about feedback or inventory..."
                                    className="relative w-full pl-4 md:pl-6 pr-14 md:pr-16 py-3 md:py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base md:text-lg shadow-sm placeholder-gray-400 bg-white"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="absolute right-2 md:right-3 top-2 md:top-3 p-1.5 md:p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg md:rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 z-10"
                                >
                                    <Send className="w-4 md:w-5 h-4 md:h-5" />
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
                                setActiveTab('Dashboard');
                                setSidebarOpen(false);
                            }}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
