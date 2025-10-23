import React from "react";

// Skeleton untuk Component Cards
export const ComponentCardSkeleton = () => {
  console.log("🟦 ComponentCardSkeleton rendered");
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton untuk Machine View (Hotspots)
export const MachineViewSkeleton = () => {
  console.log("🟩 MachineViewSkeleton rendered");
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
      <div className="relative bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
        {/* Skeleton hotspots */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-gray-300 rounded-full animate-pulse"
            style={{
              top: `${20 + i * 15}%`,
              left: `${15 + i * 15}%`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Skeleton untuk Summary Panel
export const SummaryPanelSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>

    {/* Machine Status */}
    <div className="mb-6">
      <div className="h-5 bg-gray-200 rounded w-28 mb-3"></div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="h-8 bg-gray-200 rounded w-8 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Urgent Maintenance */}
    <div>
      <div className="h-5 bg-gray-200 rounded w-36 mb-3"></div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100"
          >
            <div className="w-3 h-3 bg-gray-200 rounded-full mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Loading Overlay untuk seluruh dashboard
export const DashboardLoadingOverlay = () => (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Memproses Data ML
      </h3>
      <p className="text-gray-600">Sedang menganalisis data produksi...</p>
      <div className="mt-4 flex items-center justify-center space-x-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  </div>
);

export default {
  ComponentCardSkeleton,
  MachineViewSkeleton,
  SummaryPanelSkeleton,
  DashboardLoadingOverlay,
};
