import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  Shield,
  TrendingDown,
  TrendingUp,
  Calendar,
  BarChart3,
  Target,
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  Play
} from "lucide-react";

// Import Components
import Hotspot from "../components/Hotspot";
import HotspotPopover from "../components/HotspotPopover";
import KeyMetrics from "../components/KeyMetrics";
import { generateInitialData } from '../data/mockData';

const PredictionPage = () => {
  const [components, setComponents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRunPrediction, setHasRunPrediction] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1month');
  const [hoveredHotspot, setHoveredHotspot] = useState(null);

  useEffect(() => {
    // Load initial components data
    const data = generateInitialData();
    setComponents(data.components);
  }, []);

  const runPrediction = () => {
    setIsLoading(true);
    setHasRunPrediction(false);
    
    // Simulate prediction processing time
    setTimeout(() => {
      generatePredictions(components);
      setHasRunPrediction(true);
      setIsLoading(false);
    }, 2000);
  };

  const generatePredictions = (currentComponents) => {
    const predictionData = currentComponents.map(component => {
      // Prediction algorithm based on current health score and maintenance schedule
      const currentHealth = component.healthScore;
      const maintenanceDays = component.maintenanceDueInDays;
      
      // Calculate degradation rate based on current health
      let degradationRate;
      if (currentHealth < 40) {
        degradationRate = 0.15; // High degradation for critical components
      } else if (currentHealth < 75) {
        degradationRate = 0.08; // Medium degradation for warning components
      } else {
        degradationRate = 0.03; // Low degradation for healthy components
      }
      
      // Predict health score for next month (30 days)
      const daysToPredict = 30;
      const predictedHealth = Math.max(0, Math.min(100, 
        currentHealth - (degradationRate * daysToPredict)
      ));
      
      // Predict maintenance needs
      const predictedMaintenanceDays = Math.max(0, maintenanceDays - daysToPredict);
      
      // Determine predicted health status
      let predictedHealthStatus;
      if (predictedHealth < 40) {
        predictedHealthStatus = 'critical';
      } else if (predictedHealth < 75) {
        predictedHealthStatus = 'warning';
      } else {
        predictedHealthStatus = 'good';
      }
      
      // Calculate risk level
      let riskLevel;
      if (predictedHealth < 30 || predictedMaintenanceDays < 7) {
        riskLevel = 'high';
      } else if (predictedHealth < 60 || predictedMaintenanceDays < 30) {
        riskLevel = 'medium';
      } else {
        riskLevel = 'low';
      }
      
      return {
        ...component,
        currentHealth,
        predictedHealth: Math.round(predictedHealth),
        predictedMaintenanceDays: Math.round(predictedMaintenanceDays),
        predictedHealthStatus,
        riskLevel,
        healthChange: Math.round(predictedHealth - currentHealth),
        degradationRate: Math.round(degradationRate * 100) / 100
      };
    });
    
    setPredictions(predictionData);
  };

  const getOverallPrediction = () => {
    if (predictions.length === 0) return null;
    
    const avgCurrentHealth = predictions.reduce((sum, p) => sum + p.currentHealth, 0) / predictions.length;
    const avgPredictedHealth = predictions.reduce((sum, p) => sum + p.predictedHealth, 0) / predictions.length;
    
    const criticalCount = predictions.filter(p => p.predictedHealthStatus === 'critical').length;
    const warningCount = predictions.filter(p => p.predictedHealthStatus === 'warning').length;
    const goodCount = predictions.filter(p => p.predictedHealthStatus === 'good').length;
    
    const highRiskCount = predictions.filter(p => p.riskLevel === 'high').length;
    const mediumRiskCount = predictions.filter(p => p.riskLevel === 'medium').length;
    const lowRiskCount = predictions.filter(p => p.riskLevel === 'low').length;
    
    return {
      avgCurrentHealth: Math.round(avgCurrentHealth),
      avgPredictedHealth: Math.round(avgPredictedHealth),
      healthTrend: avgPredictedHealth - avgCurrentHealth,
      criticalCount,
      warningCount,
      goodCount,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount
    };
  };

  const overallPrediction = getOverallPrediction();

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analyzing Machine Data
              </h3>
              <p className="text-gray-600">
                Generating health predictions for next month...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideInFromLeft {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromRight {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-left {
          animation: slideInFromLeft 0.6s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInFromRight 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
      
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
          {/* Hero Section */}
          <div className="mb-8 bg-white border-2 border-purple-600 rounded-xl shadow-lg overflow-hidden animate-slide-in-left">
            <div className="bg-purple-600 px-8 py-6 border-b-4 border-purple-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-3 rounded-lg">
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">
                        Prediksi Kesehatan Mesin
                      </h1>
                      <p className="text-purple-100 text-sm">
                        Analisis Prediktif untuk Bulan Depan
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-purple-100 bg-purple-700 px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4" />
                  Prediksi 30 Hari
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div className="px-8 py-6 bg-white">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Jalankan Prediksi Kesehatan Mesin
                </h2>
                <p className="text-gray-600 mb-6">
                  Klik tombol di bawah untuk memulai analisis prediktif berdasarkan data kesehatan komponen saat ini
                </p>
                <button
                  onClick={runPrediction}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Jalankan Prediksi
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Machine Visualization & Prediction Results */}
          <section className="mb-8 animate-slide-in-right">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Machine Viewer - Takes 2 columns */}
              <div className="lg:col-span-2 bg-white rounded-xl border-2 border-gray-300 shadow-lg relative z-20">
                {/* Header */}
                <div className="bg-slate-100 px-6 py-4 border-b-2 border-gray-300">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <Wrench className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Flexo Machine
                      </h3>
                      <p className="text-sm text-gray-600">
                        {hasRunPrediction ? 'Status Prediksi Aktif' : 'Klik "Jalankan Prediksi" untuk melihat prediksi'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Machine Image Container */}
                <div className="relative p-6 bg-gray-50 min-h-[450px] flex items-center justify-center z-10 overflow-visible">
                  <div className="relative w-full h-full">
                    <img
                      src="/tcy_flexo_machine_1.png"
                      alt="Flexo Machine"
                      className="object-contain w-full h-full"
                    />
                    {components.map((comp) => (
                      <Hotspot
                        key={comp.id}
                        component={comp}
                        onHover={setHoveredHotspot}
                        onLeave={() => setHoveredHotspot(null)}
                        onClick={() => {}}
                      />
                    ))}
                    {hoveredHotspot && <HotspotPopover component={hoveredHotspot} />}
                  </div>
                </div>
              </div>
              
              {/* Prediction Status Panel */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-300 overflow-hidden h-full">
                  <div className="bg-indigo-600 px-6 py-4 border-b-4 border-indigo-700">
                    <div className="flex items-center text-white">
                      <Target className="w-6 h-6 mr-2" />
                      <div>
                        <h3 className="text-lg font-bold">
                          Status Prediksi
                        </h3>
                        <p className="text-xs text-indigo-100">
                          {hasRunPrediction ? 'Prediksi Selesai' : 'Menunggu Analisis'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    {!hasRunPrediction ? (
                      <div className="text-center">
                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <Target className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Prediksi Belum Dijalankan
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Klik tombol "Jalankan Prediksi" untuk memulai analisis prediktif
                        </p>
                        <div className="text-xs text-gray-500">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <span>Analisis data komponen</span>
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <span>Prediksi degradasi</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <span>Rekomendasi maintenance</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Prediksi Selesai
                          </h4>
                          <p className="text-sm text-gray-600">
                            Analisis prediktif telah selesai. Lihat hasil di bawah.
                          </p>
                        </div>
                        
                        {overallPrediction && (
                          <div className="space-y-3">
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="text-sm text-blue-700 font-medium">Kesehatan Rata-rata</div>
                              <div className="text-2xl font-bold text-blue-900">
                                {overallPrediction.avgPredictedHealth}%
                              </div>
                            </div>
                            
                            <div className="bg-red-50 rounded-lg p-3">
                              <div className="text-sm text-red-700 font-medium">Komponen Kritis</div>
                              <div className="text-2xl font-bold text-red-900">
                                {overallPrediction.highRiskCount}
                              </div>
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="text-sm text-green-700 font-medium">Komponen Sehat</div>
                              <div className="text-2xl font-bold text-green-900">
                                {overallPrediction.goodCount}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Prediction Details - Only show when prediction has been run */}
          {hasRunPrediction && (
            <>
              {/* Overall Prediction Stats */}
              <section className="mb-8 animate-fade-in-up">
                <div className="bg-white border-2 border-purple-600 rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-purple-600 px-8 py-6 border-b-4 border-purple-700">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-3 rounded-lg">
                            <BarChart3 className="w-8 h-8 text-purple-600" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                              Hasil Prediksi Keseluruhan
                            </h2>
                            <p className="text-purple-100 text-sm">
                              Ringkasan Analisis Prediktif
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {overallPrediction && (
                    <div className="px-8 py-6 bg-white">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-blue-700 text-xs font-semibold uppercase">
                              Kesehatan Saat Ini
                            </span>
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-3xl font-bold text-blue-900">
                            {overallPrediction.avgCurrentHealth}%
                          </div>
                          <div className="text-blue-600 text-xs mt-1 font-medium">
                            Rata-rata Komponen
                          </div>
                        </div>

                        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-purple-700 text-xs font-semibold uppercase">
                              Prediksi Bulan Depan
                            </span>
                            <Target className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="text-3xl font-bold text-purple-900">
                            {overallPrediction.avgPredictedHealth}%
                          </div>
                          <div className={`text-xs mt-1 font-medium flex items-center ${
                            overallPrediction.healthTrend >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {overallPrediction.healthTrend >= 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {overallPrediction.healthTrend >= 0 ? '+' : ''}{overallPrediction.healthTrend}%
                          </div>
                        </div>

                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-red-700 text-xs font-semibold uppercase">
                              Risiko Tinggi
                            </span>
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="text-3xl font-bold text-red-900">
                            {overallPrediction.highRiskCount}
                          </div>
                          <div className="text-red-600 text-xs mt-1 font-medium">
                            Komponen Kritis
                          </div>
                        </div>

                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-green-700 text-xs font-semibold uppercase">
                              Status Sehat
                            </span>
                            <Shield className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="text-3xl font-bold text-green-900">
                            {overallPrediction.goodCount}
                          </div>
                          <div className="text-green-600 text-xs mt-1 font-medium">
                            Komponen Sehat
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Prediction Details */}
              <section className="mb-8 animate-fade-in-up">
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-300 overflow-hidden">
                  <div className="bg-indigo-600 px-6 py-4 border-b-4 border-indigo-700">
                    <div className="flex items-center text-white">
                      <BarChart3 className="w-6 h-6 mr-2" />
                      <div>
                        <h3 className="text-lg font-bold">
                          Detail Prediksi Komponen
                        </h3>
                        <p className="text-xs text-indigo-100">
                          Analisis per komponen untuk 30 hari ke depan
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {predictions.map((prediction) => (
                        <div 
                          key={prediction.id} 
                          className={`rounded-lg p-4 border-2 hover:shadow-lg transition-all duration-300 ${
                            prediction.predictedHealthStatus === 'critical' 
                              ? 'bg-red-50/70 border-red-300 hover:border-red-400' 
                              : prediction.predictedHealthStatus === 'warning' 
                              ? 'bg-yellow-50/70 border-yellow-300 hover:border-yellow-400' 
                              : 'bg-green-50/70 border-green-300 hover:border-green-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className={`font-bold ${
                              prediction.predictedHealthStatus === 'critical' ? 'text-red-900' :
                              prediction.predictedHealthStatus === 'warning' ? 'text-yellow-900' :
                              'text-green-900'
                            }`}>
                              {prediction.name}
                            </h4>
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              prediction.riskLevel === 'high' ? 'bg-red-200 text-red-900 ring-2 ring-red-300' :
                              prediction.riskLevel === 'medium' ? 'bg-yellow-200 text-yellow-900 ring-2 ring-yellow-300' :
                              'bg-green-200 text-green-900 ring-2 ring-green-300'
                            }`}>
                              {prediction.riskLevel === 'high' ? 'Risiko Tinggi' :
                               prediction.riskLevel === 'medium' ? 'Risiko Sedang' : 'Risiko Rendah'}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {/* Current vs Predicted Health */}
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700 font-medium">Kesehatan Saat Ini:</span>
                              <span className="font-semibold text-blue-700">{prediction.currentHealth}%</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700 font-medium">Prediksi Bulan Depan:</span>
                              <span className={`font-bold text-lg ${
                                prediction.predictedHealth >= 70 ? 'text-green-700' :
                                prediction.predictedHealth >= 40 ? 'text-yellow-700' : 'text-red-700'
                              }`}>
                                {prediction.predictedHealth}%
                              </span>
                            </div>
                            
                            {/* Health Change */}
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700 font-medium">Perubahan:</span>
                              <span className={`font-semibold flex items-center ${
                                prediction.healthChange >= 0 ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {prediction.healthChange >= 0 ? (
                                  <TrendingUp className="w-4 h-4 mr-1" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 mr-1" />
                                )}
                                {prediction.healthChange >= 0 ? '+' : ''}{prediction.healthChange}%
                              </span>
                            </div>
                            
                            {/* Maintenance Prediction */}
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700 font-medium">Maintenance dalam:</span>
                              <span className={`font-semibold ${
                                prediction.predictedMaintenanceDays < 7 ? 'text-red-700' :
                                prediction.predictedMaintenanceDays < 30 ? 'text-yellow-700' : 'text-green-700'
                              }`}>
                                {prediction.predictedMaintenanceDays} hari
                              </span>
                            </div>
                            
                            {/* Degradation Rate */}
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700 font-medium">Laju Degradasi:</span>
                              <span className="font-semibold text-gray-800">
                                {prediction.degradationRate}%/hari
                              </span>
                            </div>
                          </div>
                          
                          {/* Status Indicators */}
                          <div className={`mt-4 pt-3 border-t-2 flex items-center justify-between ${
                            prediction.predictedHealthStatus === 'critical' ? 'border-red-200' :
                            prediction.predictedHealthStatus === 'warning' ? 'border-yellow-200' :
                            'border-green-200'
                          }`}>
                            <div className="flex items-center">
                              {prediction.predictedHealthStatus === 'good' ? (
                                <CheckCircle className="w-5 h-5 text-green-600 mr-1" />
                              ) : prediction.predictedHealthStatus === 'warning' ? (
                                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-1" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600 mr-1" />
                              )}
                              <span className={`text-sm font-bold ${
                                prediction.predictedHealthStatus === 'good' ? 'text-green-700' :
                                prediction.predictedHealthStatus === 'warning' ? 'text-yellow-700' : 'text-red-700'
                              }`}>
                                {prediction.predictedHealthStatus === 'good' ? 'Sehat' :
                                 prediction.predictedHealthStatus === 'warning' ? 'Perhatian' : 'Kritis'}
                              </span>
                            </div>
                            
                            <div className={`flex items-center text-xs font-medium ${
                              prediction.predictedMaintenanceDays < 7 ? 'text-red-700' :
                              prediction.predictedMaintenanceDays < 30 ? 'text-yellow-700' : 'text-gray-600'
                            }`}>
                              <Clock className="w-4 h-4 mr-1" />
                              {prediction.predictedMaintenanceDays < 7 ? 'Segera' :
                               prediction.predictedMaintenanceDays < 30 ? 'Mendatang' : 'Jauh'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Key Metrics for Predictions */}
              <KeyMetrics components={predictions} title="Metrik Prediksi" />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PredictionPage;
