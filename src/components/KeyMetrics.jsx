import React, { useState, useEffect, useMemo } from 'react';
import { ChevronsUp, ChevronsDown, Gauge, Clock, Zap, CheckCircle2 } from 'lucide-react';

const KeyMetrics = ({ components }) => {
    const initialAvailability = 83.4;
    const initialPerformance = 84.0;
    const initialQuality = 83.1;
    const initialOee = Number(((initialAvailability + initialPerformance + initialQuality) / 3).toFixed(1));

    const [metrics, setMetrics] = useState({
        oee: initialOee,
        availability: initialAvailability,
        performance: initialPerformance,
        quality: initialQuality,
    });
    const [oeeTrend, setOeeTrend] = useState([initialOee]);
    const [availabilityTrend, setAvailabilityTrend] = useState([initialAvailability]);
    const [performanceTrend, setPerformanceTrend] = useState([initialPerformance]);
    const [qualityTrend, setQualityTrend] = useState([initialQuality]);
    const [timestamps, setTimestamps] = useState([new Date()]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [selectedComponentId, setSelectedComponentId] = useState(null);

    const overallHealth = useMemo(() => {
        // PERBAIKAN: Menambahkan pengecekan untuk memastikan 'components' tidak undefined
        if (!components || components.length === 0) return '0.0';
        const total = components.reduce((acc, c) => acc + c.healthScore, 0);
        return (total / components.length).toFixed(1);
    }, [components]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => {
                const nextAvailability = Math.max(70, Math.min(99, prev.availability + (Math.random() - 0.5) * 0.6));
                const nextPerformance = Math.max(70, Math.min(99, prev.performance + (Math.random() - 0.5) * 0.6));
                const nextQuality = Math.max(70, Math.min(99, prev.quality + (Math.random() - 0.5) * 0.6));
                const nextOee = Number(((nextAvailability + nextPerformance + nextQuality) / 3).toFixed(1));
                const next = {
                    oee: nextOee,
                    availability: nextAvailability,
                    performance: nextPerformance,
                    quality: nextQuality,
                };
                setOeeTrend(arr => [...arr.slice(-23), nextOee]);
                setAvailabilityTrend(arr => [...arr.slice(-23), nextAvailability]);
                setPerformanceTrend(arr => [...arr.slice(-23), nextPerformance]);
                setQualityTrend(arr => [...arr.slice(-23), nextQuality]);
                setTimestamps(arr => [...arr.slice(-23), new Date()]);
                return next;
            });
        }, 5000); // Auto-update setiap 5 detik

        return () => clearInterval(interval);
    }, []);

    const oeeDiff = (metrics.oee - initialOee).toFixed(1);

    return (
        <>
        <section className="mb-8 animate-fade-in-up">
            <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">System Performance Overview</h2>
                    <div className="text-xs text-gray-500">Auto-updating every 5s</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Overall Health - prominent card */}
                    <div className="md:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-white shadow border border-indigo-100">
                                <Gauge className="w-5 h-5 text-indigo-600" />
                            </div>
                            <p className="text-sm font-medium text-indigo-700">System Health Score</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-extrabold text-indigo-900 leading-none">
                                {overallHealth}
                            </p>
                            <span className="text-sm text-indigo-700">/ 100</span>
                        </div>
                        <div className="mt-3">
                            <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                                <div
                                    className="h-2 bg-indigo-500 rounded-full transition-all"
                                    style={{ width: `${Number(overallHealth)}%` }}
                                />
                            </div>
                            <div className="mt-2 inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                                <ChevronsUp size={12} className="mr-1" />
                                STABLE
                            </div>
                        </div>
                    </div>

                    {/* OEE */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-md bg-white border border-gray-200">
                                    <Gauge className="w-4 h-4 text-gray-700" />
                                </div>
                                <p className="text-sm text-gray-600">Overall Equipment Effectiveness</p>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{metrics.oee.toFixed(1)}%</p>
                        <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full">
                            <div className="h-1.5 bg-gray-700 rounded-full" style={{ width: `${metrics.oee}%` }} />
                        </div>
                        {(() => {
                            const target = 85;
                            const diff = (metrics.oee - target).toFixed(1);
                            const negative = parseFloat(diff) < 0;
                            return (
                                <div className={`mt-2 inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${negative ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {negative ? '−' : '+'}{Math.abs(diff)}% vs target
                                </div>
                            );
                        })()}
                    </div>

                    {/* Availability */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 rounded-md bg-white border border-gray-200">
                                <Clock className="w-4 h-4 text-emerald-600" />
                            </div>
                            <p className="text-sm text-gray-600">Availability Rate</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{metrics.availability.toFixed(1)}%</p>
                        <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full">
                            <div className="h-1.5 bg-emerald-600 rounded-full" style={{ width: `${metrics.availability}%` }} />
                        </div>
                    </div>

                    {/* Performance */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 rounded-md bg-white border border-gray-200">
                                <Zap className="w-4 h-4 text-amber-600" />
                            </div>
                            <p className="text-sm text-gray-600">Performance Rate</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{metrics.performance.toFixed(1)}%</p>
                        <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full">
                            <div className="h-1.5 bg-amber-600 rounded-full" style={{ width: `${metrics.performance}%` }} />
                        </div>
                    </div>

                    {/* Quality */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 rounded-md bg-white border border-gray-200">
                                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                            </div>
                            <p className="text-sm text-gray-600">Quality Rate</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{metrics.quality.toFixed(1)}%</p>
                        <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full">
                            <div className="h-1.5 bg-sky-600 rounded-full" style={{ width: `${metrics.quality}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* OEE Detailed Analysis */}
        <section className="mb-8 animate-fade-in-up">
            <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">OEE Detailed Analysis</h3>
                    <div className="text-xs text-gray-500">Auto-updating every 5s</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">Availability</p>
                        <div className="text-4xl font-bold text-gray-900">{metrics.availability.toFixed(1)}%</div>
                        <div className="mt-3 w-full h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-emerald-600 rounded-full" style={{ width: `${metrics.availability}%` }} />
                        </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">Performance</p>
                        <div className="flex items-end gap-3">
                            <div className="text-4xl font-bold text-gray-900">{metrics.performance.toFixed(1)}%</div>
                        </div>
                        <div className="mt-3 w-full h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-amber-600 rounded-full" style={{ width: `${metrics.performance}%` }} />
                        </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">Quality</p>
                        <div className="text-4xl font-bold text-gray-900">{metrics.quality.toFixed(1)}%</div>
                        <div className="mt-3 w-full h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-sky-600 rounded-full" style={{ width: `${metrics.quality}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Component Health Status */}
        <section className="mb-8 animate-fade-in-up">
            <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Component Health Status</h3>
                    <div className="text-xs text-gray-500">Auto-updating every 5s</div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-3">Component Health Score Distribution</p>
                        {(() => {
                            const width = 520; const height = 240; const pad = 36;
                            const y = (v) => pad + (100 - v) * (height - 2 * pad) / 100;
                            const desiredOrder = [
                                'Pre-feeder',
                                'Feeder Unit',
                                'Printing',
                                'Printing Unit',
                                'Slotter Unit',
                                'Stacker',
                            ];
                            const normalizeName = (n) => (n || '').toString().trim();
                            const getOrderIndex = (n) => {
                                const idx = desiredOrder.findIndex(d => normalizeName(n).toLowerCase().startsWith(d.toLowerCase()));
                                return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
                            };
                            const ordered = (components || []).slice().sort((a,b) => getOrderIndex(a.name) - getOrderIndex(b.name));
                            const barW = (width - 2 * pad) / Math.max(1, (ordered.length || 1));
                            const selectedId = selectedComponentId ?? (ordered[0]?.id);
                            return (
                                <svg width={width} height={height} className="w-full">
                                    <rect x="0" y="0" width={width} height={height} fill="#f8fafc" />
                                    {[0,20,40,60,80,100].map(t => (
                                        <g key={t}>
                                            <line x1={pad} y1={y(t)} x2={width-pad} y2={y(t)} stroke="#e5e7eb" strokeDasharray={t%40===0?"":"4 4"} />
                                            <text x={8} y={y(t)+4} fontSize="10" fill="#64748b">{t}</text>
                                        </g>
                                    ))}
                                    {/* threshold lines */}
                                    <line x1={pad} y1={y(80)} x2={width-pad} y2={y(80)} stroke="#10b981" strokeDasharray="6 4" />
                                    <line x1={pad} y1={y(60)} x2={width-pad} y2={y(60)} stroke="#f59e0b" strokeDasharray="6 4" />
                                    {/* bars */}
                                    {ordered.map((c, i) => (
                                        <g key={c.id} onMouseEnter={() => setSelectedComponentId(c.id)}>
                                            <rect
                                                x={pad + i * barW + 6}
                                                width={Math.max(8, barW - 12)}
                                                y={y(c.healthScore)}
                                                height={y(0) - y(c.healthScore)}
                                                fill={c.id === selectedId ? '#2563eb' : '#f59e0b'}
                                                opacity={0.9}
                                                rx="4"
                                            />
                                            <text x={pad + i * barW + barW/2} y={height - 6} fontSize="10" textAnchor="middle" fill="#64748b">
                                                {c.name}
                                            </text>
                                        </g>
                                    ))}
                                    {/* axes */}
                                    <line x1={pad} y1={y(0)} x2={width-pad} y2={y(0)} stroke="#94a3b8" />
                                    <line x1={pad} y1={pad} x2={pad} y2={y(0)} stroke="#94a3b8" />
                                </svg>
                            );
                        })()}
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-3">Detailed Component Metrics</p>
                        {(() => {
                            if (!components || components.length === 0) return null;
                            const active = components.find(c => c.id === (selectedComponentId ?? components[0].id)) || components[0];
                            const uptimeRatio = Number((0.6 + active.healthScore/200).toFixed(3));
                            const feedStopsHour = Math.max(0, Math.round((100 - active.healthScore)/10));
                            const tensionDevPct = Number((Math.max(0, 10 - active.healthScore/10)).toFixed(3));
                            // Feeder Unit specific metrics (exclude Pre-feeder)
                            const nameLower = (active.name || '').toLowerCase();
                            const isPreFeeder = /pre[- ]?feeder/.test(nameLower);
                            const isFeederUnit = !isPreFeeder && (/\bfeeder unit\b/.test(nameLower) || /\bfeeder\b/.test(nameLower));
                            const isSlotter = /slotter/.test(nameLower);
                            // Slotter-specific derived values
                            const miscutPct = Number(((100 - active.healthScore) / 60).toFixed(3));
                            const burrMm = Number(((100 - active.healthScore) / 1900).toFixed(3));
                            const bladeLifeUsedPct = Number((((100 - active.healthScore) * 0.35)).toFixed(3));
                            const doubleSheetHour = Math.max(0, Math.round((100 - active.healthScore) / 50)); // often 0
                            const vacuumDevPct = Number((Math.max(0, 10 - active.healthScore/10)).toFixed(3));
                            const status = active.health;
                            const statusText = status === 'critical' ? 'Warning' : status === 'warning' ? 'Warning' : 'Good';
                            const recommendations = [
                                status !== 'good' ? `${statusText.toUpperCase()}: ${active.name} requires monitoring` : `${active.name} operating within normal range`,
                                uptimeRatio < 0.85 ? `uptime_ratio: ${uptimeRatio} ratio - Level WARNING` : `uptime_ratio: ${uptimeRatio} ratio - Level NORMAL`
                            ];
                            return (
                    <div>
                                    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 mb-3">
                                        <div className="font-semibold text-gray-800">{active.name.toUpperCase()} | Score: {Number(active.healthScore).toFixed(1)}/100</div>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-sm font-semibold text-gray-700">Health Status: <span className="font-normal text-gray-600">{statusText}</span></p>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${active.healthScore}%` }} />
                        </div>
                    </div>
                                    <div className="mb-3">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Performance Metrics:</p>
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="grid grid-cols-[1fr,1fr] text-xs bg-gray-100 text-gray-700">
                                                <div className="px-3 py-2 font-semibold">Metric</div>
                                                <div className="px-3 py-2 font-semibold">Value</div>
                                            </div>
                                            {isFeederUnit ? (
                                                <div className="grid grid-cols-[1fr,1fr] text-xs text-gray-700">
                                                    <div className="px-3 py-2">Double Sheet Hour</div>
                                                    <div className="px-3 py-2">{doubleSheetHour}</div>
                                                    <div className="px-3 py-2">Vacuum Dev Pct</div>
                                                    <div className="px-3 py-2">{vacuumDevPct}</div>
                                                    <div className="px-3 py-2">Uptime Ratio</div>
                                                    <div className="px-3 py-2">{uptimeRatio}</div>
                                                </div>
                                            ) : isSlotter ? (
                                                <div className="grid grid-cols-[1fr,1fr] text-xs text-gray-700">
                                                    <div className="px-3 py-2">Miscut Pct</div>
                                                    <div className="px-3 py-2">{miscutPct}</div>
                                                    <div className="px-3 py-2">Burr Mm</div>
                                                    <div className="px-3 py-2">{burrMm}</div>
                                                    <div className="px-3 py-2">Blade Life Used Pct</div>
                                                    <div className="px-3 py-2">{bladeLifeUsedPct}</div>
                                                    <div className="px-3 py-2">Uptime Ratio</div>
                                                    <div className="px-3 py-2">{uptimeRatio}</div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-[1fr,1fr] text-xs text-gray-700">
                                                    <div className="px-3 py-2">Tension Dev Pct</div>
                                                    <div className="px-3 py-2">{tensionDevPct}</div>
                                                    <div className="px-3 py-2">Feed Stops Hour</div>
                                                    <div className="px-3 py-2">{feedStopsHour}</div>
                                                    <div className="px-3 py-2">Uptime Ratio</div>
                                                    <div className="px-3 py-2">{uptimeRatio}</div>
                                                </div>
                                            )}
                        </div>
                    </div>
                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Maintenance Recommendations:</p>
                                        <ol className="list-decimal ml-5 text-xs text-gray-700 space-y-1">
                                            {recommendations.map((r, idx) => (
                                                <li key={idx}>{r}</li>
                                            ))}
                                        </ol>
                    </div>
                    </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </section>

        {/* Performance Trend Analysis */}
        <section className="mb-8 animate-fade-in-up">
            <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Performance Trend Analysis</h3>
                    <div className="text-xs text-gray-500">Auto-updating every 5s</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-x-auto">
                    {(() => {
                        const width = 900; const height = 240; const pad = 36;
                        const toPoints = (arr) => arr.map((v, i) => {
                            const x = pad + (i * (width - 2 * pad)) / Math.max(1, (arr.length - 1));
                            const y = pad + (100 - v) * (height - 2 * pad) / 100;
                            return `${x},${y}`;
                        }).join(' ');
                        const getX = (i, len) => pad + (i * (width - 2 * pad)) / Math.max(1, (len - 1));
                        const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
                        const formatTime = (d) => d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                        const len = oeeTrend.length;
                        return (
                            <svg width={width} height={height} className="block mx-auto" onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const ratio = clamp((x - pad) / (width - 2 * pad), 0, 1);
                                const idx = Math.round(ratio * (len - 1));
                                setHoverIndex(idx);
                            }} onMouseLeave={() => setHoverIndex(null)}>
                                <rect x="0" y="0" width={width} height={height} fill="#f8fafc" />
                                {/* Y grid & labels */}
                                {[0,20,40,60,80,100].map(g => (
                                    <g key={g}>
                                        <line x1={pad} y1={pad + (100 - g)*(height-2*pad)/100} x2={width-pad} y2={pad + (100 - g)*(height-2*pad)/100} stroke="#e5e7eb" strokeDasharray={g%40===0?"":"4 4"} />
                                        <text x={8} y={pad + (100 - g)*(height-2*pad)/100 + 4} fontSize="10" fill="#64748b">{g}</text>
                                    </g>
                                ))}
                                <text x={8} y={pad - 10} fontSize="10" fill="#475569">Performance (%)</text>
                                <polyline fill="none" stroke="#111827" strokeWidth="2" points={toPoints(oeeTrend)} />
                                <polyline fill="none" stroke="#059669" strokeWidth="2" points={toPoints(availabilityTrend)} />
                                <polyline fill="none" stroke="#d97706" strokeWidth="2" points={toPoints(performanceTrend)} />
                                <polyline fill="none" stroke="#0284c7" strokeWidth="2" points={toPoints(qualityTrend)} />
                                {/* X axis time labels */}
                                {(() => {
                                    const tickCount = 6; // ~ every ~5 points depending on width
                                    const idxs = Array.from({length: tickCount}, (_, i) => Math.round(i * (len - 1) / (tickCount - 1)));
                                    return (
                                        <g>
                                            {idxs.map((i) => (
                                                <text key={i} x={getX(i, len)} y={height - 8} fontSize="10" fill="#64748b" textAnchor="middle">
                                                    {timestamps[i] ? formatTime(timestamps[i]) : ''}
                                                </text>
                                            ))}
                                            <text x={width/2} y={height - 2} fontSize="10" fill="#475569" textAnchor="middle">Time</text>
                                        </g>
                                    );
                                })()}
                                {hoverIndex !== null && (
                                    <g>
                                        <line x1={getX(hoverIndex, len)} y1={pad} x2={getX(hoverIndex, len)} y2={height - pad} stroke="#94a3b8" strokeDasharray="4 4" />
                                        <rect rx="6" ry="6" x={width - 210} y={pad + 8} width="200" height="100" fill="#111827" opacity="0.95" />
                                        <text x={width - 200} y={pad + 26} fontSize="12" fill="#e5e7eb">{timestamps[hoverIndex] ? formatTime(timestamps[hoverIndex]) : ''}</text>
                                        <text x={width - 200} y={pad + 44} fontSize="12" fill="#60a5fa">OEE {oeeTrend[hoverIndex]?.toFixed(1)}%</text>
                                        <text x={width - 200} y={pad + 60} fontSize="12" fill="#34d399">Availability {availabilityTrend[hoverIndex]?.toFixed(1)}%</text>
                                        <text x={width - 200} y={pad + 76} fontSize="12" fill="#f59e0b">Performance {performanceTrend[hoverIndex]?.toFixed(1)}%</text>
                                        <text x={width - 200} y={pad + 92} fontSize="12" fill="#38bdf8">Quality {qualityTrend[hoverIndex]?.toFixed(1)}%</text>
                                    </g>
                                )}
                                <g>
                                    {(() => {
                                        const startX = width - pad - 330; // move legend to top-right
                                        return (
                                            <>
                                                <rect x={startX} y={pad-18} width="10" height="10" fill="#111827" />
                                                <text x={startX+16} y={pad-8} fontSize="12" fill="#374151">OEE</text>
                                                <rect x={startX+60} y={pad-18} width="10" height="10" fill="#059669" />
                                                <text x={startX+76} y={pad-8} fontSize="12" fill="#374151">Availability</text>
                                                <rect x={startX+170} y={pad-18} width="10" height="10" fill="#d97706" />
                                                <text x={startX+186} y={pad-8} fontSize="12" fill="#374151">Performance</text>
                                                <rect x={startX+276} y={pad-18} width="10" height="10" fill="#0284c7" />
                                                <text x={startX+292} y={pad-8} fontSize="12" fill="#374151">Quality</text>
                                            </>
                                        );
                                    })()}
                                </g>
                            </svg>
                        );
                    })()}
                </div>
            </div>
        </section>
        </>
    );
};

export default KeyMetrics;

