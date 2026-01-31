
import React from 'react';
import { LayoutDashboard, History, Settings, Bot, Database, X } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 w-64 bg-gray-900 h-screen text-white flex flex-col p-4 shadow-lg z-50 transition-transform duration-300 md:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                {/* Close button for mobile */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 mb-10 px-2 pt-2">
                    <Bot className="w-8 h-8 text-blue-400" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        CX Analytics
                    </h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem
                        icon={<LayoutDashboard />}
                        label="Dashboard"
                        active={activeTab === 'Dashboard'}
                        onClick={() => {
                            onTabChange('Dashboard');
                            onClose();
                        }}
                    />
                    <NavItem
                        icon={<Database />}
                        label="Data"
                        active={activeTab === 'Data'}
                        onClick={() => {
                            onTabChange('Data');
                            onClose();
                        }}
                    />
                    <NavItem
                        icon={<History />}
                        label="History"
                        active={activeTab === 'History'}
                        onClick={() => {
                            onTabChange('History');
                            onClose();
                        }}
                    />
                </nav>

                <div className="border-t border-gray-700 pt-4 px-2 text-xs text-gray-500">
                    v2.1.0 SQL Engine
                </div>
            </div>
        </>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base
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
