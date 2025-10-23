import React, { useMemo } from "react";
import { getOverallStatus } from "../utils/helpers";
import { FaCog, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

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

  const componentStats = useMemo(() => {
    const stats = {
      total: components.length,
      healthy: 0,
      warning: 0,
      critical: 0,
    };

    components.forEach(comp => {
      const status = getOverallStatus([comp]).text;
      if (status === 'Kritis') {
        stats.critical++;
      } else if (status === 'Perhatian') {
        stats.warning++;
      } else {
        stats.healthy++;
      }
    });
    return stats;
  }, [components]);

  return (
    <div className="bg-[#ffffff] p-6 rounded-lg border border-[#e2e8f0] h-full flex flex-col">
      <h3 className="text-xl font-bold text-[#1e293b] mb-4">
        Ringkasan Status Mesin
      </h3>
      <div className="text-center">
        <p className="text-sm text-[#64748b]">Status Keseluruhan</p>
        <p className={`text-3xl font-bold ${overallStatus.color}`}>
          {overallStatus.text}
        </p>
      </div>

      {/* Component Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 text-center">
        <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg">
          <FaCog className="mx-auto text-blue-500" />
          <p className="text-xl font-bold text-blue-800">{componentStats.total}</p>
          <p className="text-xs text-blue-600">Total</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-2 rounded-lg">
          <FaCheckCircle className="mx-auto text-green-500" />
          <p className="text-xl font-bold text-green-800">{componentStats.healthy}</p>
          <p className="text-xs text-green-600">Sehat</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg">
          <FaExclamationTriangle className="mx-auto text-yellow-500" />
          <p className="text-xl font-bold text-yellow-800">{componentStats.warning}</p>
          <p className="text-xs text-yellow-600">Perhatian</p>
        </div>
        <div className="bg-red-50 border border-red-200 p-2 rounded-lg">
          <FaTimesCircle className="mx-auto text-red-500" />
          <p className="text-xl font-bold text-red-800">{componentStats.critical}</p>
          <p className="text-xs text-red-600">Kritis</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-[#1e293b]">
            Skor Kesehatan Total
          </span>
          <span className="text-sm font-medium text-[#1e293b]">
            {totalHealthScore}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`${
              getOverallStatus(components).bgColor
            } h-2.5 rounded-full`}
            style={{ width: `${totalHealthScore}%` }}
          ></div>
        </div>
      </div>
      <div className="flex-grow">
        <h4 className="font-semibold text-[#1e293b] mb-2">
          Perawatan Mendesak
        </h4>
        {components.length > 0 ? (
          <ul className="space-y-2">
            {urgentMaintenance.map((comp) => {
              // Get status for each individual component to determine its card color
              const componentStatus = getOverallStatus([comp]);
              return (
                <li
                  key={comp.id}
                  className={`flex justify-between items-center text-sm p-2 rounded-md cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${componentStatus.bgColor.replace(
                    "bg-",
                    "bg-opacity-20"
                  )}`}
                  onClick={() => onComponentClick(comp.id)}
                >
                  <span className="font-medium text-[#1e293b]">{comp.name}</span>
                  <span className={`font-bold ${componentStatus.color}`}>
                    {comp.maintenanceDueInDays} hari lagi
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-[#64748b]">Belum ada data perawatan</p>
            <p className="text-xs text-[#94a3b8] mt-1">
              Upload file untuk melihat jadwal maintenance
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryPanel;
