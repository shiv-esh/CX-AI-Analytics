
import React, { useState } from 'react';
import { MOCK_FEEDBACK_DATA, INVENTORY_DATA } from '../data/mockData';
import { Search, Database, Package, MessageSquare } from 'lucide-react';

const DataView = () => {
    const [view, setView] = useState('feedback'); // 'feedback' or 'inventory'

    const activeData = view === 'feedback' ? MOCK_FEEDBACK_DATA : INVENTORY_DATA;

    return (
        <div className="h-full flex flex-col p-4 md:p-8 space-y-4 md:space-y-6 animate-in fade-in duration-500 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
                        <Database className="w-6 md:w-8 h-6 md:h-8 text-blue-500 shrink-0" />
                        <span>Data Laboratory</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-sm md:text-base md:ml-11">
                        Viewing {activeData.length} {view === 'feedback' ? 'Customer Feedback' : 'Inventory'} records
                    </p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl w-fit border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setView('feedback')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'feedback'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Feedback
                    </button>
                    <button
                        onClick={() => setView('inventory')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'inventory'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Package className="w-4 h-4" />
                        Inventory
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col flex-1 min-h-0">
                <div className="overflow-auto scroll-smooth flex-1">
                    <table className="w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm border-b border-gray-200">
                            {view === 'feedback' ? (
                                <tr>
                                    <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                                    <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Store</th>
                                    <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Brand</th>
                                    <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Category</th>
                                    <th className="px-3 md:px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">NPS</th>
                                    <th className="px-3 md:px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Rating</th>
                                    <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Segment</th>
                                    <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Comment</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                                    <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Store</th>
                                    <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Product</th>
                                    <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Brand</th>
                                    <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Category</th>
                                    <th className="px-3 md:px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Stock</th>
                                    <th className="px-3 md:px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {view === 'feedback' ? (
                                MOCK_FEEDBACK_DATA.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group text-xs md:text-sm">
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-gray-500 font-medium">{item.date}</td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap font-bold text-gray-900">{item.store_name}</td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${item.brand_name === 'Nike' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                    item.brand_name === 'Adidas' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        item.brand_name === 'Puma' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {item.brand_name?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-gray-500">{item.category}</td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${item.nps_score >= 8 ? 'bg-green-100 text-green-700' :
                                                    item.nps_score >= 5 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {item.nps_score}
                                            </span>
                                        </td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center font-bold text-gray-900">
                                            {item.rating} <span className="text-yellow-400">★</span>
                                        </td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-gray-500">{item.customer_segment}</td>
                                        <td className="px-3 md:px-6 py-4 text-gray-600 italic group-hover:text-gray-900 transition-colors max-w-xs truncate">
                                            "{item.comment}"
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                INVENTORY_DATA.map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50/30 transition-colors group text-xs md:text-sm">
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-gray-500 font-medium">{item.date}</td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap font-bold text-gray-900">{item.store_name}</td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap font-medium text-gray-700">{item.product_id}</td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${item.brand_name === 'Nike' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                    item.brand_name === 'Adidas' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        item.brand_name === 'Puma' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {item.brand_name?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-gray-500">{item.category}</td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center font-bold text-gray-900">{item.stock_level}</td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${item.stock_status === 'In Stock' ? 'bg-green-100 text-green-700' :
                                                    item.stock_status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {item.stock_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataView;
