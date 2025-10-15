export const machineSlides = [
  { id: 0, src: "tcy_flexo_machine.png", name: "Tampak Samping" },
  { id: 1, src: "Gemini_Generated_Image_kbgsb8kbgsb8kbgs.png", name: "Sistem Tinta" },
];

export const initialComponentsTemplate = [
  { id: "stacker", name: "Stacker", slideIndex: 0, health: "good", healthScore: 92, maintenanceDueInDays: 180, position: { top: "50%", left: "75%" } },
  { id: "Pre-feeder", name: "Pre-feeder", slideIndex: 0, health: "good", healthScore: 98, maintenanceDueInDays: 250, position: { top: "50%", left: "10%" } },
  { id: "Feeder Unit", name: "Feeder Unit", slideIndex: 0, health: "warning", healthScore: 65, maintenanceDueInDays: 25, position: { top: "50%", left: "20%" } },
  { id: "Printing Unit", name: "Printing Unit", slideIndex: 0, health: "critical", healthScore: 20, maintenanceDueInDays: 3, position: { top: "50%", left: "36%" } },
  { id: "Slotter Unit", name: "Slotter Unit", slideIndex: 0, health: "warning", healthScore: 75, maintenanceDueInDays: 40, position: { top: "50%", left: "60%" } }
];

export const generateInitialData = () => {
    let criticalCount = 0;
    let warningCount = 0;
    const components = initialComponentsTemplate.map(c => {
        const newHealthScore = Math.floor(Math.random() * 81) + 20; // 20-100
        
        // Logika baru untuk maintenanceDueInDays berdasarkan healthScore
        let newMaintenanceDays;
        if (newHealthScore < 40) { // critical
            newMaintenanceDays = Math.floor(Math.random() * 7) + 1; // 1-7 hari
        } else if (newHealthScore < 75) { // warning
            newMaintenanceDays = Math.floor(Math.random() * 23) + 8; // 8-30 hari
        } else { // good
            newMaintenanceDays = Math.floor(Math.random() * 170) + 31; // 31-200 hari
        }
        
        // Tentukan status kesehatan
        let newHealth;
        if (newHealthScore < 40) {
            newHealth = 'critical';
            criticalCount++;
        } else if (newHealthScore < 75) {
            newHealth = 'warning';
            warningCount++;
        } else {
            newHealth = 'good';
        }
        
        return { 
            ...c, 
            healthScore: newHealthScore, 
            maintenanceDueInDays: newMaintenanceDays, 
            health: newHealth 
        };
    });
    
    const analysisResult = `Analisis selesai. Status mesin telah diperbarui.\n- Komponen Kritis: ${criticalCount}\n- Komponen Perhatian: ${warningCount}`;
    return { components, analysisResult };
};

export const mockHistoryData = {
    '2025-01-15': {
        date: '2025-01-15',
        time: '10:30',
        status: 'Normal',
        temperature: 62,
        pressure: 2.2,
        speed: 185,
        vibration: 0.12,
        components: {
            stacker: { status: 'good', health: 96 },
            'Pre-feeder': { status: 'good', health: 95 },
            'Feeder Unit': { status: 'good', health: 94 },
            'Printing Unit': { status: 'good', health: 93 },
            'Slotter Unit': { status: 'good', health: 97 }
        }
    },
    '2025-02-15': {
        date: '2025-02-15',
        time: '11:45',
        status: 'Normal',
        temperature: 64,
        pressure: 2.3,
        speed: 182,
        vibration: 0.14,
        components: {
            stacker: { status: 'good', health: 92 },
            'Pre-feeder': { status: 'good', health: 94 },
            'Feeder Unit': { status: 'good', health: 90 },
            'Printing Unit': { status: 'good', health: 91 },
            'Slotter Unit': { status: 'good', health: 93 }
        }
    },
    '2025-03-15': {
        date: '2025-03-15',
        time: '09:15',
        status: 'Warning',
        temperature: 69,
        pressure: 2.6,
        speed: 175,
        vibration: 0.18,
        components: {
            stacker: { status: 'good', health: 88 },
            'Pre-feeder': { status: 'warning', health: 74 },
            'Feeder Unit': { status: 'good', health: 85 },
            'Printing Unit': { status: 'warning', health: 72 },
            'Slotter Unit': { status: 'good', health: 87 }
        }
    },
    '2025-04-15': {
        date: '2025-04-15',
        time: '14:20',
        status: 'Warning',
        temperature: 72,
        pressure: 2.8,
        speed: 170,
        vibration: 0.22,
        components: {
            stacker: { status: 'warning', health: 71 },
            'Pre-feeder': { status: 'warning', health: 70 },
            'Feeder Unit': { status: 'warning', health: 73 },
            'Printing Unit': { status: 'warning', health: 69 },
            'Slotter Unit': { status: 'warning', health: 72 }
        }
    },
    '2025-05-15': {
        date: '2025-05-15',
        time: '13:10',
        status: 'Critical',
        temperature: 78,
        pressure: 3.2,
        speed: 155,
        vibration: 0.35,
        components: {
            stacker: { status: 'warning', health: 65 },
            'Pre-feeder': { status: 'critical', health: 38 },
            'Feeder Unit': { status: 'critical', health: 35 },
            'Printing Unit': { status: 'critical', health: 32 },
            'Slotter Unit': { status: 'warning', health: 68 }
        }
    },
    '2025-06-15': {
        date: '2025-06-15',
        time: '08:45',
        status: 'Normal',
        temperature: 65,
        pressure: 2.3,
        speed: 180,
        vibration: 0.15,
        components: {
            stacker: { status: 'good', health: 91 },
            'Pre-feeder': { status: 'good', health: 93 },
            'Feeder Unit': { status: 'good', health: 90 },
            'Printing Unit': { status: 'good', health: 92 },
            'Slotter Unit': { status: 'good', health: 94 }
        }
    },
    '2025-07-15': {
        date: '2025-07-15',
        time: '15:30',
        status: 'Warning',
        temperature: 70,
        pressure: 2.7,
        speed: 172,
        vibration: 0.20,
        components: {
            stacker: { status: 'warning', health: 74 },
            'Pre-feeder': { status: 'warning', health: 71 },
            'Feeder Unit': { status: 'warning', health: 73 },
            'Printing Unit': { status: 'warning', health: 70 },
            'Slotter Unit': { status: 'warning', health: 75 }
        }
    },
    '2025-08-15': {
        date: '2025-08-15',
        time: '12:20',
        status: 'Normal',
        temperature: 66,
        pressure: 2.4,
        speed: 178,
        vibration: 0.16,
        components: {
            stacker: { status: 'good', health: 89 },
            'Pre-feeder': { status: 'good', health: 88 },
            'Feeder Unit': { status: 'good', health: 87 },
            'Printing Unit': { status: 'good', health: 86 },
            'Slotter Unit': { status: 'good', health: 90 }
        }
    },
    '2025-09-15': {
        date: '2025-09-15',
        time: '10:45',
        status: 'Warning',
        temperature: 73,
        pressure: 2.9,
        speed: 168,
        vibration: 0.25,
        components: {
            stacker: { status: 'warning', health: 72 },
            'Pre-feeder': { status: 'warning', health: 70 },
            'Feeder Unit': { status: 'warning', health: 71 },
            'Printing Unit': { status: 'critical', health: 38 },
            'Slotter Unit': { status: 'warning', health: 73 }
        }
    },
    '2025-10-15': {
        date: '2025-10-15',
        time: '09:30',
        status: 'Normal',
        temperature: 65,
        pressure: 2.4,
        speed: 180,
        vibration: 0.15,
        components: {
            stacker: { status: 'good', health: 95 },
            'Pre-feeder': { status: 'good', health: 98 },
            'Feeder Unit': { status: 'good', health: 92 },
            'Printing Unit': { status: 'good', health: 94 },
            'Slotter Unit': { status: 'good', health: 96 }
        }
    },
    '2025-11-15': {
        date: '2025-11-15',
        time: '14:15',
        status: 'Warning',
        temperature: 74,
        pressure: 3.0,
        speed: 165,
        vibration: 0.28,
        components: {
            stacker: { status: 'warning', health: 73 },
            'Pre-feeder': { status: 'warning', health: 71 },
            'Feeder Unit': { status: 'warning', health: 72 },
            'Printing Unit': { status: 'warning', health: 70 },
            'Slotter Unit': { status: 'warning', health: 74 }
        }
    },
    '2025-12-15': {
        date: '2025-12-15',
        time: '11:45',
        status: 'Critical',
        temperature: 79,
        pressure: 3.3,
        speed: 150,
        vibration: 0.38,
        components: {
            stacker: { status: 'critical', health: 35 },
            'Pre-feeder': { status: 'critical', health: 32 },
            'Feeder Unit': { status: 'critical', health: 30 },
            'Printing Unit': { status: 'critical', health: 28 },
            'Slotter Unit': { status: 'warning', health: 65 }
        }
    }
};
