import React, { useState } from 'react';
import { Cpu, UploadCloud, Calendar } from './Icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import jsPDF from 'jspdf';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const parseCSV = (text) => {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = (cols[i] ?? '').trim());
    return obj;
  });
};

const buildSnapshotFromRows = (rows) => {
  const values = {};
  rows.forEach(r => {
    const id = r.componentid || r.id || r.name || r.component || '';
    if (!id) return;
    const healthScore = r.healthscore ? Number(r.healthscore) : (r.score ? Number(r.score) : null);
    const status = r.status || (healthScore !== null ? (healthScore >= 85 ? 'normal' : healthScore >= 70 ? 'warning' : 'critical') : 'unknown');
    values[id] = { healthScore: healthScore ?? 0, status };
  });
  return { timestamp: new Date().toISOString(), values };
};

const AIProcessorCard = ({ analysisResult, fileName, apiUploadUrl, onPredict, onAddToHistory }) => {
    const [file, setFile] = useState(null);
    const [localFileName, setLocalFileName] = useState(fileName || 'Belum ada file');
    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState(analysisResult || '');
    const [error, setError] = useState('');
    const [analysisDate, setAnalysisDate] = useState('');
    const [showYearlyGraph, setShowYearlyGraph] = useState(false);
    const [yearlyData, setYearlyData] = useState(null);

    // Yearly graph data
    const graphData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
        datasets: [{
            label: 'Skor Kesehatan Rata-rata',
            data: yearlyData?.monthlyScores || Array(12).fill(0),
            borderColor: 'rgb(14, 165, 233)',
            backgroundColor: 'rgba(14, 165, 233, 0.5)',
            tension: 0.3
        }]
    };

    const handleFileChange = (e) => {
        setError('');
        const f = e.target.files && e.target.files[0];
        if (!f) {
            setFile(null);
            setLocalFileName('Belum ada file');
            return;
        }
        setFile(f);
        setLocalFileName(f.name);
    };

    const handleRun = async () => {
        if (!file || !analysisDate) {
            setError('Pilih file CSV dan tanggal analisis terlebih dahulu.');
            return;
        }

        setLoading(true);
        setError('');
        setResultText('');

        try {
            const text = await file.text();
            const rows = parseCSV(text);
            if (rows.length === 0) throw new Error('CSV kosong atau format tidak dikenali');
            
            const snapshot = {
                ...buildSnapshotFromRows(rows),
                date: analysisDate,
                fileName: localFileName
            };

            // Update yearly data
            const month = new Date(analysisDate).getMonth();
            const healthScores = Object.values(snapshot.values).map(v => v.healthScore);
            const avgScore = healthScores.reduce((a, b) => a + b, 0) / healthScores.length;

            setYearlyData(prev => {
                const newData = prev || { monthlyScores: Array(12).fill(0) };
                newData.monthlyScores[month] = avgScore;
                return newData;
            });

            setResultText(JSON.stringify(snapshot, null, 2));
            setShowYearlyGraph(true);

            // Send to parent components
            if (onPredict) onPredict(snapshot);
            if (onAddToHistory) onAddToHistory(snapshot);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Terjadi kesalahan saat memproses file');
        } finally {
            setLoading(false);
        }
    };

    const handlePrintPrediction = async () => {
        if (!resultText) {
            setError('Jalankan prediksi terlebih dahulu');
            return;
        }

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const snapshot = JSON.parse(resultText);
            
            // Add title
            pdf.setFontSize(16);
            pdf.text('Laporan Prediksi Kesehatan Mesin', 10, 10);
            
            // Add prediction details
            pdf.setFontSize(12);
            const nextMonth = new Date(analysisDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const monthName = nextMonth.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
            
            // Calculate average health score
            const healthScores = Object.values(snapshot.values).map(v => v.healthScore);
            const avgScore = Math.round(healthScores.reduce((a, b) => a + b, 0) / healthScores.length);
            
            const getStatus = (score) => {
                if (score >= 85) return 'Baik';
                if (score >= 70) return 'Perhatian';
                return 'Kritis';
            };

            const criticalComponents = Object.entries(snapshot.values)
                .filter(([_, v]) => v.healthScore < 70)
                .map(([k, v]) => `- ${k}: ${v.healthScore}%`)
                .join('\n');
            
            pdf.text([
                `Periode: ${monthName}`,
                `Skor Kesehatan Rata-rata: ${avgScore}%`,
                `Status: ${getStatus(avgScore)}`,
                '\nKomponen Kritis:',
                criticalComponents || '- Tidak ada komponen kritis',
                '\nRekomendasi:',
                avgScore < 70 ? '- Perlu perawatan segera bulan depan' : 
                avgScore < 85 ? '- Perlu pemantauan lebih ketat' : 
                '- Lanjutkan pemantauan rutin',
                avgScore < 85 ? '- Siapkan komponen pengganti' : '',
                avgScore < 70 ? '- Koordinasi dengan tim maintenance' : ''
            ].filter(Boolean), 10, 30);
            
            pdf.save(`prediction-report-${monthName.replace(' ', '-')}.pdf`);
        } catch (err) {
            console.error('Error generating prediction PDF:', err);
            setError('Gagal membuat laporan prediksi');
        }
    };

    return (
        <div className="bg-[#ffffff] p-6 rounded-lg border border-[#e2e8f0]">
            <div className="flex items-center mb-4">
                <Cpu className="w-6 h-6 mr-3 text-[#38bdf8]" />
                <h3 className="text-xl font-bold text-[#1e293b]">Prediksi Machine Learning</h3>
            </div>
            
            <p className="text-[#64748b] mb-4">
                Unggah file CSV dan pilih tanggal analisis untuk menghasilkan snapshot kesehatan mesin
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <label className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-gray-600 bg-slate-100 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer">
                    <UploadCloud className="w-5 h-5 mr-2 text-slate-500" />
                    <span className="truncate">{localFileName}</span>
                    <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
                </label>

                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <input
                        type="date"
                        value={analysisDate}
                        onChange={(e) => setAnalysisDate(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:outline-none text-gray-600"
                    />
                </div>

                <button 
                    onClick={handleRun}
                    disabled={loading || !file || !analysisDate}
                    className={`px-6 py-2.5 text-white ${loading || !file || !analysisDate ? 'bg-sky-300 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'} rounded-lg font-semibold flex items-center justify-center`}
                >
                    {loading ? 'Memproses...' : 'Jalankan Prediksi'}
                </button>
            </div>

            {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

            {showYearlyGraph && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-[#1e293b] mb-4">Grafik Kesehatan Mesin Tahunan</h4>
                    <div className="h-[300px]">
                        <Line 
                            data={graphData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 100,
                                        title: {
                                            display: true,
                                            text: 'Skor Kesehatan (%)'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            )}

            {(resultText || (analysisResult && !resultText)) && (
                <div className="mt-6 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-semibold text-[#1e293b] mb-2">Hasil Analisis:</h4>
                        <pre className="text-sm text-[#64748b] whitespace-pre-wrap max-h-48 overflow-auto">
                            {resultText || analysisResult}
                        </pre>
                    </div>

                    <button
                        onClick={handlePrintPrediction}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                        </svg>
                        Cetak Prediksi Bulan Depan
                    </button>
                </div>
            )}
        </div>
    );
};

export default AIProcessorCard;
