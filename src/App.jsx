
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import Sidebar from './components/Sidebar';
import InsightCard from './components/InsightCard';
import { processQuery } from './utils/dataEngine';

function App() {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            type: 'bot',
            content: {
                answerText: "Hello! I'm your CX Analytics Assistant. Ask me anything about customer feedback, like 'Why are reviews negative at Dubai Mall?' or 'Show me the trend of complaints'.",
                chartConfig: { type: 'none', data: [] }, // Initial state no chart
                evidence: []
            }
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

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

        // Await the asynchronous processQuery call
        try {
            const response = await processQuery(userMessage.content);
            console.log("Response from engine:", response);
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: response,
                queryRef: userMessage.content
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error processing query:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans text-gray-900">
            <Sidebar />

            <main className="ml-64 flex-1 flex flex-col h-screen relative">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm z-10 sticky top-0">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        AI Insights Dashboard
                    </h2>
                </header>

                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 scroll-smooth pb-32">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>

                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg border-2 ${msg.type === 'bot' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-white' : 'bg-gray-200 border-white'
                                }`}>
                                {msg.type === 'bot' ? <Bot className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-gray-600" />}
                            </div>

                            {/* Message Content */}
                            <div className={`max-w-3xl w-full transition-all duration-300 ${msg.type === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-md px-6 py-4' : ''}`}>

                                {msg.type === 'user' ? (
                                    <p className="text-lg font-medium leading-relaxed">{msg.content}</p>
                                ) : (
                                    // For bot, render Insight Card
                                    <InsightCard
                                        query={msg.queryRef || "Introduction"}
                                        response={msg.content}
                                    />
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
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

                {/* Input Bar */}
                <div className="absolute bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 px-8 py-5">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto relative shadow-xl rounded-2xl">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about customer reviews (e.g., 'Why are people unhappy at Dubai Mall?')"
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
                    <p className="text-center text-xs text-gray-400 mt-3 font-medium">
                        AI Data Engine v2.0 • Backend Powered • Response generated by Gemini
                    </p>
                </div>
            </main>
        </div>
    );
}

export default App;
