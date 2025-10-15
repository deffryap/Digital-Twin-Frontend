import React, { useState, useEffect } from 'react';
import YearlyHealthChart from '../components/YearlyHealthChart';
import { machineSlides, initialComponentsTemplate, generateInitialData, mockHistoryData } from '../data/mockData';

// Import Components
import Header from '../components/Header';
import Hotspot from '../components/Hotspot';
import HotspotPopover from '../components/HotspotPopover';
import SummaryPanel from '../components/SummaryPanel';
import ComponentCard from '../components/ComponentCard';
import AIProcessorCard from '../components/AIProcessorCard';
import { ChevronLeft, ChevronRight } from '../components/Icons';

// Initialize data for the demo state
const { components: initialComponentsData, analysisResult: initialAnalysisResult } = generateInitialData();

const normalizeKey = (s = '') => String(s).toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');

const DashboardPage = ({ onLogout }) => {
    const [components, setComponents] = useState(initialComponentsData);
    const [hoveredHotspot, setHoveredHotspot] = useState(null);
    const [highlightedCard, setHighlightedCard] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(initialAnalysisResult);
    const [fileName, setFileName] = useState('sensor_data_20251008.csv');
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [scrollToComponentId, setScrollToComponentId] = useState(null);
    const [selectedHistory, setSelectedHistory] = useState(null);

    useEffect(() => {
        if (scrollToComponentId) {
            const element = document.getElementById(scrollToComponentId);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        const componentToFind = initialComponentsTemplate.find(c => c.id === componentId);
        if (componentToFind) {
            if (currentSlideIndex !== componentToFind.slideIndex) {
                 setCurrentSlideIndex(componentToFind.slideIndex);
            }
            setScrollToComponentId(componentId);
        }
    };

    const handleNextSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % machineSlides.length);
    };

    const handlePrevSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + machineSlides.length) % machineSlides.length);
    };

    // Ubah fungsi convertHistoryToComponents
    const convertHistoryToComponents = (historyKey) => {
        const snapshot = mockHistoryData[historyKey];
        if (!snapshot) return null;

        return initialComponentsTemplate.map(template => {
            // Normalize component names untuk matching
            const normalizedId = normalizeKey(template.id);
            const componentData = Object.entries(snapshot.components).find(([key]) => 
                normalizeKey(key) === normalizedId ||
                normalizeKey(key) === normalizeKey(template.name)
            );

            if (componentData) {
                const [_, data] = componentData;
                return {
                    ...template,
                    health: data.status.toLowerCase(),
                    healthScore: data.health,
                    maintenanceDueInDays: Math.floor(data.health / 2), // Estimasi maintenance berdasarkan health
                    sensors: {
                        temperature: snapshot.temperature,
                        pressure: snapshot.pressure,
                        speed: snapshot.speed,
                        vibration: snapshot.vibration
                    }
                };
            }
            return template;
        });
    };

    // Update handler riwayat
    const handleHistorySelect = (historyKey) => {
        const snapshot = mockHistoryData[historyKey];
        if (!snapshot) return;

        // Convert dan set components
        const updatedComponents = convertHistoryToComponents(historyKey);
        if (updatedComponents) {
            setComponents(updatedComponents);
            
            // Update analysis result dengan detail
            const criticalCount = updatedComponents.filter(c => c.health === 'critical').length;
            const warningCount = updatedComponents.filter(c => c.health === 'warning').length;
            
            setAnalysisResult(
                `Status Mesin: ${snapshot.status}\n` +
                `Waktu: ${snapshot.date} ${snapshot.time}\n` +
                `Komponen Kritis: ${criticalCount}\n` +
                `Komponen Perhatian: ${warningCount}\n\n` +
                `Sensor Readings:\n` +
                `- Temperature: ${snapshot.temperature}°C\n` +
                `- Pressure: ${snapshot.pressure} bar\n` +
                `- Speed: ${snapshot.speed} m/min\n` +
                `- Vibration: ${snapshot.vibration} mm/s`
            );

            setFileName(`history_${snapshot.date}.csv`);
            setSelectedHistory(historyKey);
        }
    };

    // Calculate yearly averages
    const calculateYearlyData = () => {
        const monthlyData = Array(12).fill(0);
        const monthCounts = Array(12).fill(0);

        Object.values(mockHistoryData).forEach(entry => {
            const date = new Date(entry.date);
            const month = date.getMonth();
            
            // Calculate average health score for all components
            const totalHealth = Object.values(entry.components).reduce(
                (sum, comp) => sum + comp.health, 
                0
            );
            const avgHealth = totalHealth / Object.keys(entry.components).length;
            
            monthlyData[month] += avgHealth;
            monthCounts[month]++;
        });

        // Calculate averages
        return monthlyData.map((total, index) => 
            monthCounts[index] ? Math.round(total / monthCounts[index]) : 0
        );
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
            `}</style>
            <div className="bg-[#f1f5f9] min-h-screen p-4 sm:p-6 md:p-8 font-sans">
                <div className="max-w-7xl mx-auto">
                    <Header 
                        onLogout={onLogout}
                        onHistorySelect={handleHistorySelect}
                    />
                    <main>
                        <section className="mb-8 relative">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-[#ffffff] rounded-lg border border-[#e2e8f0] p-4 relative flex flex-col justify-center">
                                    <div className="relative w-full h-full min-h-[400px]">
                                        <img 
                                          src={machineSlides[currentSlideIndex].src} 
                                          alt={machineSlides[currentSlideIndex].name}
                                          className="object-contain w-full h-full"
                                        />
                                        {components.filter(c => c.slideIndex === currentSlideIndex).map(comp => (
                                            <Hotspot 
                                                key={comp.id} 
                                                component={comp} 
                                                onHover={setHoveredHotspot}
                                                onLeave={() => setHoveredHotspot(null)}
                                                onClick={navigateToComponent}
                                            />
                                        ))}
                                        <HotspotPopover component={hoveredHotspot} />
                                        <button onClick={handlePrevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 text-[#1e293b] transition-colors shadow-md">
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button onClick={handleNextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 text-[#1e293b] transition-colors shadow-md">
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="flex justify-center items-center gap-2 pt-4">
                                        {machineSlides.map((slide, index) => (
                                            <button 
                                                key={slide.id} 
                                                onClick={() => setCurrentSlideIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-colors ${currentSlideIndex === index ? 'bg-[#38bdf8]' : 'bg-gray-300 hover:bg-gray-400'}`}
                                                aria-label={`Go to slide ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:col-span-1">
                                    <SummaryPanel components={components} onComponentClick={navigateToComponent}/>
                                </div>
                            </div>
                        </section>
                        
                        <section className="mb-8">
                            <AIProcessorCard 
                                analysisResult={analysisResult}
                                fileName={fileName}
                            />
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-[#1e293b] mb-4">
                                Tren Kesehatan Mesin 2025
                            </h2>
                            <YearlyHealthChart data={calculateYearlyData()} />
                        </section>
                        
                        <section>
                            <h2 className="text-3xl font-bold text-[#1e293b] mb-6">Detail Komponen</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {components.map(comp => (
                                    <ComponentCard 
                                        key={comp.id} 
                                        component={comp}
                                        isHighlighted={highlightedCard === comp.id}
                                    />
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}

export default DashboardPage;
