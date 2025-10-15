import React, { useMemo } from 'react';
import { getOverallStatus } from '../utils/helpers';

const SummaryPanel = ({ components, onComponentClick }) => {
    const overallStatus = getOverallStatus(components);
    const totalHealthScore = useMemo(() => {
        if (components.length === 0) return 0;
        const total = components.reduce((acc, c) => acc + c.healthScore, 0);
        return Math.round(total / components.length);
    }, [components]);

    const urgentMaintenance = useMemo(() => {
        return [...components]
            .sort((a, b) => a.maintenanceDueInDays - b.maintenanceDueInDays)
            .slice(0, 3);
    }, [components]);

    return (
        <div className="bg-[#ffffff] p-6 rounded-lg border border-[#e2e8f0] h-full flex flex-col">
            <h3 className="text-xl font-bold text-[#1e293b] mb-4">Ringkasan Status Mesin</h3>
            <div className="text-center">
                <p className="text-sm text-[#64748b]">Status Keseluruhan</p>
                <p className={`text-3xl font-bold ${overallStatus.color}`}>{overallStatus.text}</p>
            </div>
            <div className="my-6">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-[#1e293b]">Skor Kesehatan Total</span>
                    <span className="text-sm font-medium text-[#1e293b]">{totalHealthScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`${getOverallStatus(components).bgColor} h-2.5 rounded-full`} style={{ width: `${totalHealthScore}%` }}></div>
                </div>
            </div>
            <div className="flex-grow">
                <h4 className="font-semibold text-[#1e293b] mb-2">Perawatan Mendesak</h4>
                <ul className="space-y-2">
                    {urgentMaintenance.map(comp => (
                        <li key={comp.id} className="flex justify-between text-sm text-[#64748b] cursor-pointer hover:text-[#38bdf8] transition-colors" onClick={() => onComponentClick(comp.id)}>
                            <span>{comp.name}</span>
                            <span className="font-semibold text-[#38bdf8]">{comp.maintenanceDueInDays} hari lagi</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SummaryPanel;
