export const machineSlides = [
  { id: 0, src: "tcy_flexo_machine_1.png", name: "Flexo Machine" },
];

export const initialComponentsTemplate = [
  { id: "stacker", name: "Stacker", health: "good", healthScore: 92, maintenanceDueInDays: 180, position: { top: "50%", left: "95%" } },
  { id: "Pre-feeder", name: "Pre-feeder", health: "good", healthScore: 98, maintenanceDueInDays: 250, position: { top: "50%", left: "10%" } },
  { id: "Feeder Unit", name: "Feeder Unit", health: "warning", healthScore: 65, maintenanceDueInDays: 25, position: { top: "50%", left: "20%" } },
  { id: "Printing Unit", name: "Printing Unit", health: "critical", healthScore: 20, maintenanceDueInDays: 3, position: { top: "50%", left: "70%" } },
  { id: "Slotter Unit", name: "Slotter Unit", health: "warning", healthScore: 75, maintenanceDueInDays: 40, position: { top: "50%", left: "45%" } }
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

