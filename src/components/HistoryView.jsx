
import React from 'react';
import { History, MessageSquare, Clock, ArrowRight } from 'lucide-react';

const HistoryView = ({ history, onSelectQuery }) => {
    return (
        <div className="p-4 md:p-8 space-y-4 md:space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
                    <History className="w-6 md:w-8 h-6 md:h-8 text-blue-500 shrink-0" />
                    Query History
                </h1>
                <p className="text-gray-500 font-medium text-sm md:text-base md:ml-11">
                    Trace back through your analytical sessions.
                </p>
            </div>

            <div className="max-w-4xl space-y-3 md:space-y-4">
                {history && history.length > 0 ? (
                    history.slice().reverse().map((item, index) => (
                        <button
                            key={index}
                            onClick={() => onSelectQuery(item)}
                            className="w-full text-left bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex items-start justify-between gap-3 md:gap-4"
                        >
                            <div className="flex gap-3 md:gap-4 min-w-0">
                                <div className="p-2 md:p-3 bg-blue-50 rounded-lg md:rounded-xl group-hover:bg-blue-100 transition-colors shrink-0">
                                    <MessageSquare className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
                                </div>
                                <div className="space-y-1 min-w-0 flex-1">
                                    <p className="text-base md:text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                                        {item.query}
                                    </p>
                                    <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-400 flex-wrap">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 md:w-3.5 h-3 md:h-3.5 shrink-0" />
                                            <span className="whitespace-nowrap">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full shrink-0"></span>
                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-gray-600">
                                            {item.type || 'Insight'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0 flex items-center justify-center w-7 md:w-8 h-7 md:h-8 rounded-full border border-gray-100 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
                                <ArrowRight className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 md:p-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-3 md:p-4 bg-white rounded-full shadow-sm">
                            <Clock className="w-8 md:w-10 h-8 md:h-10 text-gray-300" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg md:text-xl font-bold text-gray-400">No History Yet</h3>
                            <p className="text-sm md:text-base text-gray-400 max-w-xs">
                                Start asking questions in the dashboard to see your analytical journey here.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryView;
