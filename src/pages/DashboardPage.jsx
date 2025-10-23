import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  Shield,
  TrendingDown,
  Wrench
} from "lucide-react";

// Import Components
import Hotspot from "../components/Hotspot";
import HotspotPopover from "../components/HotspotPopover";
import SummaryPanel from "../components/SummaryPanel";
import ComponentCard from "../components/ComponentCard";
import KeyMetrics from "../components/KeyMetrics";
import { ChevronLeft, ChevronRight } from "../components/Icons";

// Import Data
import { generateInitialData, machineSlides } from '../data/mockData';

const DashboardPage = () => {
  const [components, setComponents] = useState(generateInitialData().components);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [highlightedCard, setHighlightedCard] = useState(null);
  const [scrollToComponentId, setScrollToComponentId] = useState(null);
  const [isComponentsLoading, setIsComponentsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (scrollToComponentId) {
      const element = document.getElementById(scrollToComponentId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          setHighlightedCard(scrollToComponentId);
          setTimeout(() => setHighlightedCard(null), 2000);
          setScrollToComponentId(null);
        }, 100);
      } else {
        setScrollToComponentId(null);
      }
    }
  }, [scrollToComponentId, components]);

  const navigateToComponent = (componentId) => {
    const componentToFind = components.find(
      (c) => c.id === componentId
    );
    if (componentToFind) {
      setScrollToComponentId(componentId);
    }
  };

  // Slide data configuration
  const slides = [
    {
      id: 'overview',
      title: 'Flexo Machine Overview',
      image: '/tcy_flexo_machine_1.png',
      description: 'Tampilan keseluruhan mesin flexo dengan semua komponen',
      showAllComponents: true
    },
    {
      id: 'pre-feeder',
      title: 'Pre-feeder Component',
      image: '/tcy_flexo_machine.png', // Using main image for now
      description: 'Komponen Pre-feeder untuk pengumpanan material',
      componentId: 'Pre-feeder',
      showAllComponents: false
    },
    {
      id: 'printing-unit',
      title: 'Printing Unit',
      image: '/tcy_flexo_machine.png', // Using main image for now
      description: 'Unit pencetakan dengan sistem roller dan tinta',
      componentId: 'Printing Unit',
      showAllComponents: false
    },
    {
      id: 'feeder-unit',
      title: 'Feeder Unit',
      image: '/tcy_flexo_machine.png', // Using main image for now
      description: 'Unit pengumpan material',
      componentId: 'Feeder Unit',
      showAllComponents: false
    },
    {
      id: 'slotter-unit',
      title: 'Slotter Unit',
      image: '/tcy_flexo_machine.png', // Using main image for now
      description: 'Unit slotter untuk pemotongan',
      componentId: 'Slotter Unit',
      showAllComponents: false
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
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
          {/* Hero Dashboard Header */}
          <div className="mb-8 bg-white border-2 border-blue-600 rounded-xl shadow-lg overflow-hidden animate-slide-in-left">
            <div className="bg-blue-600 px-8 py-6 border-b-4 border-blue-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-3 rounded-lg">
                      <Activity className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">
                        Digital Twin Dashboard
                      </h1>
                      <p className="text-blue-100 text-sm">
                        Machine Health Monitoring System
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="px-8 py-6 bg-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-700 text-xs font-semibold uppercase">
                      Total Komponen
                    </span>
                    <Wrench className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-900">
                    {components.length}
                  </div>
                  <div className="text-blue-600 text-xs mt-1 font-medium">
                    Active Components
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
                    {components.filter((c) => c.healthScore >= 70).length}
                  </div>
                  <div className="text-green-600 text-xs mt-1 font-medium">
                    Healthy Components
                  </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-700 text-xs font-semibold uppercase">
                      Perhatian
                    </span>
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-900">
                    {components.filter((c) => c.healthScore >= 40 && c.healthScore < 70).length}
                  </div>
                  <div className="text-yellow-600 text-xs mt-1 font-medium">
                    Need Attention
                  </div>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-700 text-xs font-semibold uppercase">
                      Kritis
                    </span>
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-900">
                    {components.filter((c) => c.healthScore < 40).length}
                  </div>
                  <div className="text-red-600 text-xs mt-1 font-medium">
                    Critical Status
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Machine Visualization & Summary Section */}
          <section className="mb-8 animate-slide-in-right">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Machine Viewer - Takes 2 columns */}
              <div className="lg:col-span-2 bg-white rounded-xl border-2 border-gray-300 shadow-lg relative z-20">
                {/* Header with Slide Navigation */}
                <div className="bg-slate-100 px-6 py-4 border-b-2 border-gray-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <Wrench className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {slides[currentSlide].title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {slides[currentSlide].description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Slide Navigation Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevSlide}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isComponentsLoading}
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      {/* Slide Indicators */}
                      <div className="flex gap-1">
                        {slides.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentSlide 
                                ? 'bg-indigo-600' 
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <button
                        onClick={nextSlide}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isComponentsLoading}
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Machine Image Container */}
                <div className="relative p-6 bg-gray-50 min-h-[450px] flex items-center justify-center z-10 overflow-visible">
                  {isComponentsLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
                      <div className="text-center">
                        <div className="relative inline-block mb-4">
                          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Wrench className="w-6 h-6 text-blue-600 animate-pulse" />
                          </div>
                        </div>
                        <p className="text-blue-900 font-semibold mb-1">
                          Processing Machine Data
                        </p>
                        <p className="text-blue-700 text-sm">
                          Analyzing components...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className="object-contain w-full h-full" 
                      />
                      {/* Show hotspots based on current slide */}
                      {slides[currentSlide].showAllComponents ? (
                        // Show all components for overview slide
                        components.map((comp) => (
                          <Hotspot
                            key={comp.id}
                            component={comp}
                            onHover={setHoveredHotspot}
                            onLeave={() => setHoveredHotspot(null)}
                            onClick={navigateToComponent}
                          />
                        ))
                      ) : (
                        // Show only specific component for component slides
                        components
                          .filter(comp => comp.id === slides[currentSlide].componentId)
                          .map((comp) => (
                            <Hotspot
                              key={comp.id}
                              component={comp}
                              onHover={setHoveredHotspot}
                              onLeave={() => setHoveredHotspot(null)}
                              onClick={navigateToComponent}
                            />
                          ))
                      )}
                      {hoveredHotspot && <HotspotPopover component={hoveredHotspot} />}
                    </div>
                  )}
                </div>
              </div>
              {/* Summary Panel - Enhanced */}
              <div className="lg:col-span-1">
                {isComponentsLoading ? (
                  <div className="bg-white rounded-xl shadow-lg border-2 border-gray-300 p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="flex items-center mb-4">
                        <div className="bg-gray-200 rounded-lg w-10 h-10 mr-3"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                      </div>
                      <div className="text-center pt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">
                          Loading summary...
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg border-2 border-gray-300 overflow-hidden h-full">
                    <div className="bg-indigo-600 px-6 py-4 border-b-4 border-indigo-700">
                      <div className="flex items-center text-white">
                        <Shield className="w-6 h-6 mr-2" />
                        <div>
                          <h3 className="text-lg font-bold">
                            {slides[currentSlide].showAllComponents ? 'System Summary' : 'Component Status'}
                          </h3>
                          <p className="text-xs text-indigo-100">
                            {slides[currentSlide].showAllComponents ? 'Overall Health Status' : `${slides[currentSlide].title} Health`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      {slides[currentSlide].showAllComponents ? (
                        // Show overall system summary for overview slide
                        <SummaryPanel
                          components={components}
                          onComponentClick={navigateToComponent}
                        />
                      ) : (
                        // Show specific component details for component slides
                        (() => {
                          const currentComponent = components.find(comp => comp.id === slides[currentSlide].componentId);
                          
                          if (!currentComponent) {
                            return (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                                    {slides[currentSlide].title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-4">
                                    {slides[currentSlide].description}
                                  </p>
                                </div>
                                
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                  <div className="flex items-center">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                                    <div>
                                      <h5 className="font-semibold text-yellow-800">Komponen Tidak Ditemukan</h5>
                                      <p className="text-sm text-yellow-700">
                                        Data komponen untuk {slides[currentSlide].title} belum tersedia.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-center">
                                  <button
                                    onClick={() => setCurrentSlide(0)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                  >
                                    Kembali ke Overview
                                  </button>
                                </div>
                              </div>
                            );
                          }
                          
                          return (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h4 className="text-lg font-bold text-gray-900 mb-2">
                                  {currentComponent.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">
                                  {slides[currentSlide].description}
                                </p>
                              </div>
                              
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-gray-700">Status:</span>
                                  <span className={`font-bold ${
                                    currentComponent.healthScore >= 70 ? 'text-green-700' :
                                    currentComponent.healthScore >= 40 ? 'text-yellow-700' : 'text-red-700'
                                  }`}>
                                    {currentComponent.healthScore >= 70 ? 'Baik' :
                                     currentComponent.healthScore >= 40 ? 'Perhatian' : 'Kritis'}
                                  </span>
                                </div>
                                
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-gray-700">Skor:</span>
                                  <span className="font-bold text-gray-900">{currentComponent.healthScore}/100</span>
                                </div>
                                
                                <div className="flex justify-between items-center mb-4">
                                  <span className="text-sm font-medium text-gray-700">Maintenance:</span>
                                  <span className="font-bold text-gray-900">{currentComponent.maintenanceDueInDays} hari</span>
                                </div>
                                
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      currentComponent.healthScore >= 70 ? 'bg-green-500' :
                                      currentComponent.healthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${currentComponent.healthScore}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <button
                                  onClick={() => navigateToComponent(currentComponent.id)}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                >
                                  Lihat Detail Lengkap
                                </button>
                              </div>
                            </div>
                          );
                        })()
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* KeyMatrics */}
          <KeyMetrics components={components} />

          {/* Component Cards */}
          <section className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detail Komponen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {components.map((comp) => (
                <ComponentCard
                  key={comp.id}
                  component={comp}
                  isHighlighted={highlightedCard === comp.id}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
