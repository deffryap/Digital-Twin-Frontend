import React from 'react';
import { getStatusInfo } from '../utils/helpers';

const HotspotPopover = ({ component }) => {
    if (!component) return null;
    const statusInfo = getStatusInfo(component.health);
    return (
        <div
            className="absolute z-[9999] pointer-events-none"
            style={{
                top: `calc(${component.position.top} - 12px)`,
                left: component.position.left,
                transform: 'translate(-50%, -100%)',
                minWidth: '250px',
            }}
        >
            <div className="relative p-4 bg-white border border-[#e2e8f0] rounded-lg shadow-xl">
                <div className={`flex items-center font-bold mb-3 ${statusInfo.color}`}>
                    <statusInfo.Icon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <h4 className="text-lg leading-tight">{component.name}</h4>
                </div>
                <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm mb-4">
                    <span className="text-[#64748b]">Status:</span>
                    <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
                    <span className="text-[#64748b]">Skor:</span>
                    <span className="font-semibold text-[#1e293b]">{component.healthScore}/100</span>
                    <span className="text-[#64748b]">Penyelenggaraan:</span>
                    <span className="font-semibold text-[#1e293b]">{component.maintenanceDueInDays} hari</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className={`${statusInfo.bgColor} h-2 rounded-full`} style={{ width: `${component.healthScore}%` }}></div>
                </div>
                <div className="pt-2 text-xs text-center text-gray-400 border-t border-gray-200">
                    Klik untuk lihat butiran
                </div>
                <div className="absolute w-4 h-4 bg-white border-r border-b border-[#e2e8f0] rotate-45 -bottom-2 left-1/2 -translate-x-1/2"></div>
            </div>
        </div>
    );
};

export default HotspotPopover;
