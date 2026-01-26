
import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader, ChevronDown, ChevronUp, Table, MessageSquare } from 'lucide-react';

const InsightCard = ({ query, response, loading }) => {
    const [showEvidence, setShowEvidence] = useState(false);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center gap-3 animate-pulse">
                <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                <span className="text-gray-500 font-medium">Processing...</span>
            </div>
        );
    }

    // Handle case where chartConfig is null if error
    if (!response) return null;

    const { answerText, chartConfig = { type: 'none', data: [] }, evidence = [] } = response;
    const isLine = chartConfig.type === 'line';

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6 transition-all duration-300 hover:shadow-xl">
            {/* Header */}
            <div className="pb-4 border-b border-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    {query}
                </h3>
            </div>

            {/* Summary */}
            <p className="text-gray-600 text-base leading-relaxed">{answerText}</p>

            {/* Chart */}
            {chartConfig.data && chartConfig.data.length > 0 && (
                <div className="h-64 w-full mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <ResponsiveContainer width="100%" height="100%">
                        {isLine ? (
                            <LineChart data={chartConfig.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey={chartConfig.xKey} tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1f2937' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey={chartConfig.dataKey} stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        ) : (
                            <BarChart data={chartConfig.data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey={chartConfig.xKey} tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar
                                    dataKey={chartConfig.dataKey}
                                    fill="#6366f1"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            )}

            {/* Evidence Toggle */}
            {evidence && evidence.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowEvidence(!showEvidence)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 group"
                    >
                        <Table className="w-4 h-4" />
                        {showEvidence ? 'Hide Source Data' : 'View Supporting Comments'}
                        {showEvidence ? (
                            <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        ) : (
                            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        )}
                    </button>

                    {/* Data Table */}
                    {showEvidence && (
                        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {evidence.slice(0, 10).map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.store_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${item.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                                                        item.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                    {item.nps_score}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 italic">"{item.comment}"</td>
                                        </tr>
                                    ))}
                                    {evidence.length > 10 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-3 text-center text-xs text-gray-400 font-medium bg-gray-50">
                                                ...and {evidence.length - 10} more records
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InsightCard;
