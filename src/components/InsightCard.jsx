
import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Loader, ChevronDown, ChevronUp, Table, MessageSquare, Lightbulb, TrendingUp, Info, Package, MessageCircle } from 'lucide-react';

const COLORS = ['#6366f1', '#60a5fa', '#a78bfa', '#f472b6', '#fb923c', '#4ade80'];

const InsightCard = ({ query, response, loading }) => {
    const [showEvidence, setShowEvidence] = useState(false);
    const [visibleCount, setVisibleCount] = useState(10);
    const [activeEvidenceTab, setActiveEvidenceTab] = useState(null); // 'FEEDBACK' or 'INVENTORY'

    if (loading) {
        return (
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex items-center justify-center gap-3 animate-pulse">
                <Loader className="w-5 h-5 text-blue-500 animate-spin shrink-0" />
                <span className="text-gray-500 font-medium text-sm md:text-base">Processing...</span>
            </div>
        );
    }

    if (!response) return null;

    const { answerText, chartConfig = { type: 'none', data: [] }, evidence = [] } = response;
    const isLine = chartConfig.type === 'line';

    // Separate evidence by source
    const feedbackEvidence = evidence.filter(e => e.__source === 'FEEDBACK');
    const inventoryEvidence = evidence.filter(e => e.__source === 'INVENTORY');

    // Auto-set initial evidence tab if not set
    if (showEvidence && !activeEvidenceTab) {
        if (feedbackEvidence.length > 0) setActiveEvidenceTab('FEEDBACK');
        else if (inventoryEvidence.length > 0) setActiveEvidenceTab('INVENTORY');
    }

    // Helper to determine headers for a specific data set
    const getHeaders = (data) => {
        if (!data || data.length === 0) return [];
        const allKeys = new Set();
        data.forEach(row => Object.keys(row).forEach(k => k !== '__source' && allKeys.add(k)));

        const priorities = [
            'date', 'store_name', 'brand_name',
            'product_id', 'stock_level', 'stock_status',
            'nps_score', 'sentiment', 'category', 'comment'
        ];

        return priorities.filter(key => allKeys.has(key));
    };

    const renderTable = (data, sourceName) => {
        const headers = getHeaders(data);
        const icon = sourceName === 'FEEDBACK' ? <MessageCircle className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />;

        return (
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 shadow-inner bg-gray-50/30 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className={`p-3 border-b border-gray-100 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${sourceName === 'FEEDBACK' ? 'bg-blue-50/50 text-blue-600' : 'bg-amber-50/50 text-amber-600'
                    }`}>
                    {icon}
                    {sourceName} RECORDS ({data.length})
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-white/50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                            <tr>
                                {headers.map(h => (
                                    <th key={h} className="px-5 py-3">{h.replace('_', ' ')}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.slice(0, visibleCount).map((item, idx) => (
                                <tr key={idx} className="hover:bg-white transition-colors">
                                    {headers.map(h => (
                                        <td key={h} className="px-5 py-3 whitespace-nowrap">
                                            {h === 'sentiment' ? (
                                                <span className={`px-2 py-0.5 rounded-full font-bold
                                                    ${item[h] === 'Negative' ? 'text-rose-600 bg-rose-50' :
                                                        item[h] === 'Positive' ? 'text-emerald-600 bg-emerald-50' :
                                                            'text-gray-600 bg-gray-50'}`}>
                                                    {item[h]}
                                                </span>
                                            ) : h === 'stock_status' ? (
                                                <span className={`px-2 py-0.5 rounded-full font-bold
                                                    ${item[h] === 'Out of Stock' ? 'text-rose-600 bg-rose-50' :
                                                        item[h] === 'Low Stock' ? 'text-amber-600 bg-amber-50' :
                                                            'text-emerald-600 bg-emerald-50'}`}>
                                                    {item[h]}
                                                </span>
                                            ) : h === 'comment' ? (
                                                <div className="italic text-gray-500 max-w-xs truncate">"{item[h]}"</div>
                                            ) : (
                                                <span className="text-gray-700">{item[h] ?? '-'}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {data.length > visibleCount && (
                    <button onClick={() => setVisibleCount(v => v + 10)} className="w-full py-3 text-[10px] font-black text-blue-600 bg-white border-t border-gray-100 hover:bg-blue-50 transition-colors uppercase tracking-widest">
                        Load More {sourceName} Records
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 space-y-4 md:space-y-6 transition-all duration-300 hover:shadow-xl group/card">
            {/* Header */}
            <div className="pb-3 md:pb-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-4 md:w-5 h-4 md:h-5 text-blue-500 shrink-0" />
                    <span className="line-clamp-1">{query}</span>
                </h3>
            </div>

            {/* AI Insight Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-4 md:p-5 border border-blue-100/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/card:scale-110 transition-transform duration-500">
                    <Lightbulb className="w-12 h-12 text-blue-600" />
                </div>
                <div className="flex items-start gap-3 relative z-10">
                    <div className="bg-blue-600 rounded-lg p-1.5 shrink-0 shadow-md">
                        <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Key Insight</h4>
                        <p className="text-gray-800 text-sm md:text-base font-medium leading-relaxed">
                            {answerText}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart Wrapper */}
            {chartConfig.data && chartConfig.data.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 px-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        Visual Supporting Data
                    </h4>
                    {chartConfig.type === 'stat' ? (
                        <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center border border-gray-100 shadow-inner hover:bg-gray-50/50 transition-colors">
                            <div className="text-xs md:text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">Result</div>
                            <div className="text-4xl md:text-6xl font-black text-blue-600 drop-shadow-sm">
                                {(() => {
                                    const row = chartConfig.data[0];
                                    const key = chartConfig.dataKey || Object.keys(row).find(k => !isNaN(parseFloat(row[k]))) || Object.keys(row)[0];
                                    const val = parseFloat(row[key]);
                                    return !isNaN(val) ? (val % 1 === 0 ? val : val.toFixed(1)) : (row[key] || "N/A");
                                })()}
                            </div>
                            {(() => {
                                const row = chartConfig.data[0];
                                const labelKey = Object.keys(row).find(k => typeof row[k] === 'string' && k !== 'date' && k !== 'id');
                                return labelKey ? (
                                    <div className="mt-2 text-lg md:text-xl font-bold text-gray-700">{row[labelKey]}</div>
                                ) : null;
                            })()}
                        </div>
                    ) : chartConfig.type === 'pie' ? (
                        <div className="h-64 md:h-80 w-full bg-white rounded-xl p-3 md:p-4 border border-gray-100 flex items-center justify-center shadow-sm">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartConfig.data}
                                        dataKey={chartConfig.dataKey || Object.keys(chartConfig.data[0]).find(k => typeof chartConfig.data[0][k] === 'number') || 'value'}
                                        nameKey={chartConfig.xKey}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {chartConfig.data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 md:h-80 w-full bg-white rounded-xl p-3 md:p-4 border border-gray-100 shadow-sm overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                {isLine ? (
                                    <LineChart data={chartConfig.data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey={chartConfig.xKey} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        <Legend />
                                        <Line type="monotone" dataKey={chartConfig.dataKey} stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
                                    </LineChart>
                                ) : (
                                    <BarChart data={chartConfig.data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey={chartConfig.xKey} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        <Legend />
                                        <Bar dataKey={chartConfig.dataKey} fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}

            {/* Evidence Toggle */}
            {evidence && evidence.length > 0 && (
                <div className="pt-2">
                    <button
                        onClick={() => setShowEvidence(!showEvidence)}
                        className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-widest pl-1 mb-4"
                    >
                        {showEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {showEvidence ? 'Hide Supporting Records' : 'View Supporting Records'}
                    </button>

                    {showEvidence && (
                        <div className="space-y-6">
                            {/* Evidence Tabs if both exist */}
                            {feedbackEvidence.length > 0 && inventoryEvidence.length > 0 && (
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                                    <button
                                        onClick={() => setActiveEvidenceTab('FEEDBACK')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${activeEvidenceTab === 'FEEDBACK'
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Feedback Data
                                    </button>
                                    <button
                                        onClick={() => setActiveEvidenceTab('INVENTORY')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${activeEvidenceTab === 'INVENTORY'
                                                ? 'bg-white text-amber-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <Package className="w-3.5 h-3.5" />
                                        Inventory Data
                                    </button>
                                </div>
                            )}

                            {/* Render active or both */}
                            {feedbackEvidence.length > 0 && (activeEvidenceTab === 'FEEDBACK' || inventoryEvidence.length === 0) &&
                                renderTable(feedbackEvidence, 'FEEDBACK')
                            }

                            {inventoryEvidence.length > 0 && (activeEvidenceTab === 'INVENTORY' || feedbackEvidence.length === 0) &&
                                renderTable(inventoryEvidence, 'INVENTORY')
                            }
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InsightCard;
