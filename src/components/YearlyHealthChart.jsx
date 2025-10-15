import React from 'react';
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
import annotationPlugin from 'chartjs-plugin-annotation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const YearlyHealthChart = ({ data }) => {
  const averageHealth = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
  const minHealth = Math.min(...data);
  const maxHealth = Math.max(...data);

  const getHealthStatus = (score) => {
    if (score >= 85) return { text: 'Baik', color: 'text-green-500' };
    if (score >= 70) return { text: 'Perhatian', color: 'text-yellow-500' };
    return { text: 'Kritis', color: 'text-red-500' };
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [{
      label: 'Kesehatan Rata-rata',
      data: data,
      borderColor: 'rgb(14, 165, 233)',
      backgroundColor: 'rgba(14, 165, 233, 0.5)',
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: 'white',
      pointBorderWidth: 2,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Grafik Kesehatan Mesin Tahunan',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `Skor: ${context.parsed.y}%`
        }
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 85,
            yMax: 85,
            borderColor: 'rgba(34, 197, 94, 0.3)',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: 'Batas Aman',
              display: true,
              position: 'right'
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(226, 232, 240, 0.5)'
        },
        title: {
          display: true,
          text: 'Skor Kesehatan (%)'
        }
      },
      x: {
        grid: {
          color: 'rgba(226, 232, 240, 0.5)'
        }
      }
    }
  };

  const handlePrintYearlyReport = async () => {
    const chartElement = document.getElementById('yearly-health-chart');
    const summaryElement = document.getElementById('health-summary');
    
    try {
      const canvas = await html2canvas(chartElement);
      const summaryCanvas = await html2canvas(summaryElement);
      
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.setFontSize(16);
      pdf.text('Laporan Tahunan Kesehatan Mesin', 10, 10);
      
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        10,
        20,
        pdfWidth - 20,
        (pdfWidth - 20) * canvas.height / canvas.width
      );
      
      pdf.addImage(
        summaryCanvas.toDataURL('image/png'),
        'PNG',
        10,
        pdfHeight - 60,
        80,
        50
      );
      
      pdf.save('yearly-health-report.pdf');
    } catch (err) {
      console.error('Error generating yearly PDF:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm" id="yearly-health-chart">
        <div className="h-[400px]">
          <Line data={chartData} options={options} />
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm" id="health-summary">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Tahunan</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rata-rata Kesehatan</p>
              <p className={`text-2xl font-bold ${getHealthStatus(averageHealth).color}`}>
                {averageHealth}%
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Skor Tertinggi</p>
              <p className="text-2xl font-bold text-green-500">{maxHealth}%</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Skor Terendah</p>
              <p className="text-2xl font-bold text-red-500">{minHealth}%</p>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-600 mb-2">Status Keseluruhan</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                getHealthStatus(averageHealth).color.replace('text', 'bg')}/10 ${getHealthStatus(averageHealth).color}`}>
                {getHealthStatus(averageHealth).text}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePrintYearlyReport}
          className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          Cetak Laporan Tahunan
        </button>
      </div>
    </div>
  );
};

export default YearlyHealthChart;