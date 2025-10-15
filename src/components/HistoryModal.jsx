import React, { useState } from 'react';
import { mockHistoryData } from '../data/mockData';

const formatDateLabel = (d) => {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return d;
  }
};

const HistoryModal = ({ isOpen = false, onClose = () => {}, onSelectHistory = () => {} }) => {
  const [selectedDate, setSelectedDate] = useState('');

  if (!isOpen) return null;

  const keys = Object.keys(mockHistoryData).sort((a,b) => (a < b ? 1 : -1)); // newest first
  const filtered = keys.filter(k => !selectedDate || k.includes(selectedDate));

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">Riwayat Analisis</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 && (
            <div className="text-sm text-slate-500 text-center py-4">
              Tidak ada riwayat untuk tanggal yang dipilih.
            </div>
          )}
          {filtered.map(key => {
            const item = mockHistoryData[key];
            return (
              <button
                key={key}
                onClick={() => { onSelectHistory(key); onClose(); }}
                className="w-full text-left p-3 rounded-lg border hover:bg-slate-50 flex justify-between items-center transition-colors"
              >
                <div>
                  <div className="font-medium text-slate-800">{formatDateLabel(item.date || key)}</div>
                  <div className="text-sm text-slate-500">{item.time ? `Waktu: ${item.time}` : key}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status?.toLowerCase() === 'normal' ? 'bg-green-100 text-green-800' : 
                  item.status?.toLowerCase() === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t">
          <button 
            onClick={onClose} 
            className="w-full px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;