
import React from 'react';
import { LayoutDashboard, History, Settings, Bot } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-900 h-screen text-white flex flex-col p-4 shadow-lg fixed left-0 top-0">
            <div className="flex items-center gap-3 mb-10 px-2 pt-2">
                <Bot className="w-8 h-8 text-blue-400" />
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    CX Analytics
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
                <NavItem icon={<History />} label="History" />
                <NavItem icon={<Settings />} label="Settings" />
            </nav>

            <div className="border-t border-gray-700 pt-4 px-2 text-xs text-gray-500">
                v1.0.0 Alpha
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active }) => (
    <button
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
    ${active
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
    >
        {React.cloneElement(icon, { size: 20 })}
        <span className="font-medium">{label}</span>
    </button>
);

export default Sidebar;
