import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryModal from './HistoryModal';

// Icon component is placed directly inside this file to resolve the import issue.
const History = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M12 7v5l4 2"/>
  </svg>
);

const LogoutIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const Header = ({ onLogout, onHistorySelect }) => {
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleHistorySelect = (historyData) => {
        onHistorySelect(historyData);
        setIsHistoryModalOpen(false);
    };

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <>
            <header className="mb-8 p-6 bg-white rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-12 bg-sky-500 rounded-full"></div>
                            <h1 className="text-4xl font-bold text-[#1e293b] tracking-tight">
                                Digital Twin Flexo Machine
                            </h1>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                            onClick={() => setIsHistoryModalOpen(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[#1e293b] font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <History className="w-5 h-5 text-[#64748b]" />
                            <span>Riwayat Analisis</span>
                        </button>
                        
                        <button 
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-red-600 font-semibold hover:bg-red-100 transition-colors"
                        >
                            <LogoutIcon className="w-5 h-5" />
                            <span>Keluar</span>
                        </button>
                    </div>
                </div>
            </header>

            <HistoryModal 
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                onSelectHistory={handleHistorySelect}
            />
        </>
    );
};

export default Header;

