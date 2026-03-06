<div align="center">

# NEXUS — City Intelligence Response System
**Frontend Web Application**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)

The frontend for the **NEXUS Command Center**, a state-of-the-art decision-support platform designed for emergency response teams. Built entirely as a Single Page Application (SPA), this interface offers a seamless, real-time command perspective to city administrators.

</div>

---

## 📸 Overview of Features

- **Live Dynamic Heatmap**: Powered by Leaflet.js, featuring color-coded prioritization and real-time panning.
- **Draggable Resource Board**: Allocate resources across the map using a built-in highly optimized HTML5 drag-and-drop mechanism.
- **Incident Modal & Overlays**: Highly interactive overlays giving deep tactical insights, AI calculation scores, and transparent reasoning.
- **Real-time Status Bar**: Active clocks and ticking statistics visualizing deployed resources versus available assets.
- **Staged Allocations Workflow**: Stage multiple resources to an incident before pushing a "Confirm Allocation" button.
- **Dark UI Aesthetics**: A modern, low-glare dark mode utilizing Tailwind CSS v4 and glass-morphism techniques to maintain commander focus.

---

## 📂 Project Structure

```bash
Frontend/
├── public/                 # Static assets (favicons, boilerplate images)
├── src/                    # Main Source Directory
│   ├── components/         # Reusable React UI Components
│   │   ├── IncidentCard.jsx
│   │   ├── IncidentDetailOverlay.jsx
│   │   ├── IncidentModal.jsx
│   │   ├── IncidentQueue.jsx
│   │   ├── MapPanel.jsx
│   │   ├── ResourceBoard.jsx
│   │   ├── ResourceCard.jsx
│   │   ├── ToastNotification.jsx
│   │   └── TopBar.jsx
│   ├── data/               # Local static JSON (used as fallbacks or seed data)
│   ├── hooks/              # Custom React Hooks
│   ├── utils/              # Helper functions (priority calculation, formatting)
│   ├── index.css           # Global Tailwind V4 styles and standard resets
│   ├── main.jsx            # Entry point for the Vite React renderer
│   └── App.jsx             # Core application state logic and event propagation
├── .gitignore
├── eslint.config.js        # Linting rules for component uniformity
├── index.html              # Main HTML application shell
├── package.json            # Scripts and dependencies list
├── postcss.config.js       # PostCSS processing (required by Tailwind V4)
├── tailwind.config.js      # Tailwind customization config
└── vite.config.js          # Vite web-bundler configuration
```

---

## ⚙️ Core Dependencies

The NEXUS Frontend relies primarily on the following libraries:

- **React (`^18.x`)**: Functional components and robust state-driven UI hooks.
- **Tailwind CSS (`^4.x`)**: Complete rapid UI prototyping framework.
- **Lucide React (`^0.x`)**: Sleek and consistent SVG iconography across the dashboard.
- **Leaflet & React-Leaflet**: Open-source, flexible multi-layer interactive mapping components.

---

## 🚀 Getting Started

Ensure you have **Node.js (>= 18.0.0)** installed on your machine.

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Configure Environment

If running the Django backend concurrently, ensure you configure Vite to talk to the local API. Create a `.env` in the root of the `Frontend` directory if necessary:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Start the Development Server
```bash
npm run dev
```
The console will display the local port (usually `http://localhost:5173`).

---

## 🏗️ Building for Production

To create an optimized production build:
```bash
npm run build
```
This will compile all React components, minify CSS/JS, and output a deployable bundle into the `dist/` directory. You can preview the optimized build locally utilizing:
```bash
npm run preview
```

---

## 🎨 UI Guidelines & Philosophy

The user interface of the NEXUS dashboard adheres strictly to the following parameters:
- **Zero-Clutter Policy**: Emergency dispatchers have high cognitive loads. Use high-contrast color palettes strategically on priority elements only. Critical = Pulse-Red, High = Orange/Amber, Medium = Yellow, Low = Blue.
- **Graceful Error States**: Missing API structures or failed allocations yield a `ToastNotification` component gracefully returning state defaults.
- **Fluid Animation Sequences**: Components such as `IncidentModal.jsx` use hardware-accelerated animations (`animate-bounce`, `slideUp`) to bring attention directly where the administrator needs it without jarring frame skips.
