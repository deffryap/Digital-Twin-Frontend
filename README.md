# Digital Twin Flexo Machine

A web-based monitoring system for flexographic printing machines that provides real-time health monitoring, predictive maintenance, and historical analysis.

## Features

- **Real-time Machine Monitoring**
  - Component health status visualization
  - Interactive machine diagram with hotspots
  - Status indicators for critical components

- **Predictive Maintenance**
  - Machine learning-based health prediction
  - CSV data processing and analysis
  - Next month maintenance forecasting

- **Historical Analysis**
  - Yearly health trends visualization
  - Monthly performance tracking
  - Component-wise health history

- **Reporting System**
  - Yearly health report generation
  - Predictive maintenance report
  - PDF export functionality

## Technology Stack

- React.js
- Chart.js for data visualization
- TailwindCSS for styling
- PDF generation with jsPDF
- CSV parsing capabilities

## Installation

1. Clone the repository
```bash
git clone [repository-url]
cd digital-twin-flexo-machine
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Project Structure

```
src/
├── api/
│   └── authService.js      # Authentication service
├── assets/
│   └── react.svg          # Static assets
├── components/
│   ├── AIProcessorCard.jsx    # ML prediction component
│   ├── ComponentCard.jsx      # Machine component display
│   ├── Header.jsx            # Application header
│   ├── HistoryModal.jsx      # Historical data viewer
│   ├── Hotspot.jsx          # Interactive machine points
│   ├── HotspotPopover.jsx   # Hotspot information display
│   ├── Icons.jsx            # SVG icons
│   ├── SummaryPanel.jsx     # Status summary
│   └── YearlyHealthChart.jsx # Annual health trends
├── data/
│   └── mockData.js         # Demo data
├── pages/
│   ├── DashboardPage.jsx    # Main dashboard
│   ├── LoginPage.jsx        # User login
│   └── RegisterPage.jsx     # User registration
└── utils/
    └── helpers.js          # Utility functions
```

## Usage

1. **Login/Register**
   - Use credentials to access the system
   - New users can register for access

2. **Dashboard Navigation**
   - View machine components status
   - Interact with hotspots for detailed info
   - Monitor real-time health scores

3. **Predictive Analysis**
   - Upload CSV files for analysis
   - View prediction results
   - Generate prediction reports

4. **Historical Data**
   - Access past performance data
   - View yearly trends
   - Generate annual reports

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.