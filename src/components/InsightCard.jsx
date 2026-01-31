import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Loader, ChevronDown, ChevronUp, Table, MessageSquare } from 'lucide-react';

const COLORS = ['#6366f1', '#60a5fa', '#a78bfa', '#f472b6', '#fb923c', '#4ade80'];

const InsightCard = ({ query, response, loading }) => {
    const [showEvidence, setShowEvidence] = useState(false);
    const [visibleCount, setVisibleCount] = useState(10);

    if (loading) {
        return (
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex items-center justify-center gap-3 animate-pulse">
                <Loader className="w-5 h-5 text-blue-500 animate-spin shrink-0" />
                <span className="text-gray-500 font-medium text-sm md:text-base">Processing...</span>
            </div>
        );
    }

    // Handle case where chartConfig is null if error
    if (!response) return null;

    const { answerText, chartConfig = { type: 'none', data: [] }, evidence = [] } = response;
    const isLine = chartConfig.type === 'line';

    return (
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 space-y-4 md:space-y-6 transition-all duration-300 hover:shadow-xl">
            {/* Header */}
            <div className="pb-3 md:pb-4 border-b border-gray-50">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-4 md:w-5 h-4 md:h-5 text-blue-500 shrink-0" />
                    <span className="line-clamp-2">{query}</span>
                </h3>
            </div>

            {/* Summary */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">{answerText}</p>

            {/* Chart */}
            {chartConfig.data && chartConfig.data.length > 0 && (
                chartConfig.type === 'stat' ? (
                    <div className="bg-blue-50/50 rounded-xl md:rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center border border-blue-100 shadow-inner group transition-all duration-300 hover:bg-blue-50">
                        <div className="text-xs md:text-sm font-bold text-blue-400 uppercase tracking-widest mb-1 group-hover:scale-105 transition-transform">
                            {chartConfig.summary_hint?.split(' ')[0] || 'Metric'}
                        </div>
                        <div className="text-4xl md:text-6xl font-black text-blue-600 drop-shadow-sm group-hover:scale-110 transition-transform duration-500">
                            {(() => {
                                const row = chartConfig.data[0];
                                const key = chartConfig.dataKey || Object.keys(row).find(k => !isNaN(parseFloat(row[k]))) || Object.keys(row)[0];
                                const val = parseFloat(row[key]);
                                return !isNaN(val) ? (val % 1 === 0 ? val : val.toFixed(1)) : (row[key] || "N/A");
                            })()}
                        </div>
                        {(() => {
                            const row = chartConfig.data[0];
                            const labelKey = Object.keys(row).find(k => typeof row[k] === 'string' && k !== 'date');
                            return labelKey ? (
                                <div className="mt-2 text-lg md:text-xl font-bold text-gray-700 animate-in fade-in zoom-in duration-700">
                                    {row[labelKey]}
                                </div>
                            ) : null;
                        })()}
                        <div className="mt-2 text-gray-400 text-[11px] md:text-xs font-medium">
                            Based on {evidence.length} feedback records
                        </div>
                    </div>
                ) : chartConfig.type === 'pie' ? (
                    <div className="h-64 md:h-80 w-full mt-3 md:mt-4 bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-100 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartConfig.data}
                                    dataKey={chartConfig.dataKey || Object.keys(chartConfig.data[0]).find(k => typeof chartConfig.data[0][k] === 'number') || 'value'}
                                    nameKey={chartConfig.xKey}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {chartConfig.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-64 md:h-80 w-full mt-3 md:mt-4 bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-100">
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
                                    <Line type="monotone" dataKey={chartConfig.dataKey || Object.keys(chartConfig.data[0]).find(k => k !== chartConfig.xKey) || 'value'} stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
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
                                        dataKey={chartConfig.dataKey || Object.keys(chartConfig.data[0]).find(k => k !== chartConfig.xKey) || 'value'}
                                        fill="#6366f1"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                )
            )}

            {/* Evidence Toggle */}
            {evidence && evidence.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowEvidence(!showEvidence)}
                        className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 group"
                    >
                        <Table className="w-3.5 md:w-4 h-3.5 md:h-4 shrink-0" />
                        <span className="hidden sm:inline">{showEvidence ? 'Hide Source Data' : 'View Supporting Comments'}</span>
                        <span className="sm:hidden">{showEvidence ? 'Hide' : 'View'}</span>
                        {showEvidence ? (
                            <ChevronUp className="w-3.5 md:w-4 h-3.5 md:h-4 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                        ) : (
                            <ChevronDown className="w-3.5 md:w-4 h-3.5 md:h-4 group-hover:translate-y-0.5 transition-transform shrink-0" />
                        )}
                    </button>

                    {/* Data Table */}
                    {showEvidence && (
                        <div className="mt-3 md:mt-4 overflow-x-auto rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                            <table className="w-full divide-y divide-gray-200 text-xs md:text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Store</th>
                                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Brand</th>
                                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Category</th>
                                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Score</th>
                                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {evidence.slice(0, visibleCount).map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-gray-500">{item.date}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap font-medium text-gray-900">{item.store_name}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-gray-600 font-bold uppercase">{item.brand_name}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-gray-500">{item.category}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-gray-900">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${item.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                                                        item.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                    {item.nps_score}
                                                </span>
                                            </td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-gray-600 italic max-w-xs truncate">"{item.comment}"</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {evidence.length > visibleCount && (
                                <div className="p-3 md:p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + 10)}
                                        className="text-xs md:text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                                    >
                                        Load More (Showing {visibleCount} of {evidence.length})
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InsightCard;
