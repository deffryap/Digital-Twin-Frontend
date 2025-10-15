import React from 'react';
import { getStatusInfoCard } from '../utils/helpers';

const ComponentCard = ({ component, isHighlighted }) => {
    const statusInfo = getStatusInfoCard(component.health);
    return (
        <div 
            id={component.id} 
            className={`
                rounded-lg border border-slate-200 
                transition-all duration-300 group 
                hover:shadow-lg hover:-translate-y-1 flex flex-col 
                ${isHighlighted ? `${statusInfo.bgColor} ring-2 ${statusInfo.ringColor}` : 'bg-white shadow-sm'}
            `}
        >
            <div className="p-6 flex-grow">
                <div className="flex items-start justify-between mb-4 min-h-[56px]">
                    <h3 className="text-lg font-bold text-slate-800 pr-2">{component.name}</h3>
                    <span className={`
                        flex items-center text-xs font-semibold 
                        px-2.5 py-1 rounded-full 
                        ${statusInfo.bgColor} ${statusInfo.color}
                    `}>
                        <statusInfo.Icon className="w-4 h-4 mr-1.5" />
                        {statusInfo.text}
                    </span>
                </div>
                
                <div className="mb-4">
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">Skor Kesehatan</span>
                        <span className="text-sm font-medium text-slate-700">{component.healthScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div className={`${statusInfo.strongBgColor} h-2.5 rounded-full`} style={{ width: `${component.healthScore}%` }}></div>
                    </div>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Perawatan Berikutnya dalam:</p>
                    <p className="text-2xl font-bold text-sky-600">
                        {component.maintenanceDueInDays} 
                        <span className="text-base font-normal text-slate-500"> hari</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ComponentCard;
