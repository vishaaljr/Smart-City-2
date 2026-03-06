import React, { useState } from 'react';
import TopBar from './components/TopBar';
import MapPanel from './components/MapPanel';
import IncidentQueue from './components/IncidentQueue';
import ResourceBoard from './components/ResourceBoard';
import IncidentDetailOverlay from './components/IncidentDetailOverlay';
import IncidentModal from './components/IncidentModal';
import ToastNotification from './components/ToastNotification';
import { INCIDENTS } from './data/incidents';
import { RESOURCES } from './data/resources';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [toast, setToast] = useState({ message: '', visible: false });
  const [warningBanner, setWarningBanner] = useState({ message: '', visible: false });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Enforce intentional loader delay for aesthetics and UI expectation
        await new Promise(resolve => setTimeout(resolve, 1500));

        const [incidentsRes, resourcesRes] = await Promise.all([
          fetch('/api/incidents/'),
          fetch('/api/resources/')
        ]);

        if (!incidentsRes.ok || !resourcesRes.ok) {
          throw new Error('Failed to fetch from Django API');
        }

        const incidentsData = await incidentsRes.json();
        const resourcesData = await resourcesRes.json();

        setIncidents(incidentsData);
        setResources(resourcesData);
        setIsLoading(false);
      } catch (err) {
        console.warn('Backend unavailable or CORS dropped. Engaging dummy data fallback:', err);
        setIncidents(INCIDENTS);
        setResources(RESOURCES);

        setError(null); // Clear hard error screen since we're using fallback
        setWarningBanner({
          message: 'LIVE CONNECTION LOST. Operating on cached tactical data.',
          visible: true
        });

        // Hide banner after 5 seconds to not obstruct the UI permanently
        setTimeout(() => setWarningBanner({ message: '', visible: false }), 5000);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
  };

  const handleStageResource = (resourceId, incidentId) => {
    const resourceIndex = resources.findIndex(r => r.id === resourceId);
    const incidentIndex = incidents.findIndex(i => i.id === incidentId);

    if (resourceIndex === -1 || incidentIndex === -1) return;

    const resource = resources[resourceIndex];
    if (resource.status !== 'available') return;

    // Change resource to staged
    const newResources = [...resources];
    newResources[resourceIndex] = { ...resource, status: 'staged' };
    setResources(newResources);

    // Add to incident's stagedResources array
    const newIncidents = [...incidents];
    const incident = newIncidents[incidentIndex];
    const staged = incident.stagedResources || [];

    newIncidents[incidentIndex] = {
      ...incident,
      stagedResources: [...staged, resource]
    };

    setIncidents(newIncidents);
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(newIncidents[incidentIndex]);
    }
  };

  const handleRemoveStaged = (resourceId, incidentId) => {
    const resourceIndex = resources.findIndex(r => r.id === resourceId);
    const incidentIndex = incidents.findIndex(i => i.id === incidentId);

    if (resourceIndex !== -1) {
      const newResources = [...resources];
      newResources[resourceIndex] = { ...resources[resourceIndex], status: 'available' };
      setResources(newResources);
    }

    if (incidentIndex !== -1) {
      const newIncidents = [...incidents];
      newIncidents[incidentIndex] = {
        ...newIncidents[incidentIndex],
        stagedResources: (newIncidents[incidentIndex].stagedResources || []).filter(r => r.id !== resourceId)
      };
      setIncidents(newIncidents);
      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident(newIncidents[incidentIndex]);
      }
    }
  };

  const handleConfirmAllocation = (incidentId) => {
    const incidentIndex = incidents.findIndex(i => i.id === incidentId);
    if (incidentIndex === -1) return;

    const incident = incidents[incidentIndex];
    const staged = incident.stagedResources || [];
    if (staged.length === 0) return;

    // Change staged resources to deployed
    const newResources = resources.map(r => {
      if (staged.find(sr => sr.id === r.id)) {
        return { ...r, status: 'deployed' };
      }
      return r;
    });
    setResources(newResources);

    const newIncidents = [...incidents];
    newIncidents[incidentIndex] = {
      ...incident,
      status: 'assigned',
      assignedResources: staged, // Keep full array for UI
      assignedResource: staged.length > 1 ? `${staged.length} Units` : staged[0].name, // For backwards compatibility
      stagedResources: []
    };
    setIncidents(newIncidents);
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(newIncidents[incidentIndex]);
    }

    // Show toast
    const eta = Math.floor(Math.random() * 6) + 3; // 3-8 min
    setToast({
      message: `${staged.length} unit(s) dispatched to ${incidentId} (ETA: ${eta} min)`,
      visible: true
    });

    // Check if last of any staged type
    staged.forEach(resource => {
      const remainingOfType = newResources.filter(r => r.type === resource.type && r.status === 'available');
      if (remainingOfType.length === 0) {
        setWarningBanner({
          message: `WARNING: No remaining ${resource.type.toUpperCase()} units available in sector.`,
          visible: true
        });
        setTimeout(() => setWarningBanner({ message: '', visible: false }), 8000);
      }
    });
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleDismissToast = () => {
    setToast({ ...toast, visible: false });
  };

  // Filter incidents based on activeFilter
  const filteredIncidents = incidents.filter(inc => {
    if (activeFilter === 'all') return true;
    return inc.priorityScore >= (activeFilter === 'critical' ? 80 : activeFilter === 'high' ? 60 : 40) &&
      inc.priorityScore < (activeFilter === 'critical' ? 101 : activeFilter === 'high' ? 80 : 60);
  });

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-dark text-white font-mono">
        <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
        <p className="tracking-widest capitalize opacity-70">Initializing NEXUS Systems...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-dark text-red-500 font-mono">
        <p className="tracking-widest text-lg font-bold">SYSTEM ERROR</p>
        <p className="tracking-widest">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-dark bg-grid-pattern relative">
      <TopBar />

      {/* Warning Banner */}
      {warningBanner.visible && (
        <div className="absolute top-14 left-0 w-full z-50 bg-red-600/90 text-white text-center py-1 text-sm font-semibold tracking-wide backdrop-blur-sm border-b border-red-500 animate-[slideDown_0.3s_ease-out]">
          {warningBanner.message}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">
        {/* LEFT ZONE: Map */}
        <div className="w-[60%] h-full relative border-r border-white/10">
          <MapPanel
            incidents={incidents}
            onSelectIncident={handleSelectIncident}
          />

          {selectedIncident && (
            <IncidentDetailOverlay
              incident={selectedIncident}
              onClose={() => setSelectedIncident(null)}
              onExpand={() => setIsModalOpen(true)}
              onStageResource={(resId) => handleStageResource(resId, selectedIncident.id)}
              onConfirmAllocation={() => handleConfirmAllocation(selectedIncident.id)}
              onRemoveStaged={(resId) => handleRemoveStaged(resId, selectedIncident.id)}
            />
          )}

          {selectedIncident && isModalOpen && (
            <IncidentModal
              incident={selectedIncident}
              onClose={() => setIsModalOpen(false)}
              onStageResource={(resId) => handleStageResource(resId, selectedIncident.id)}
              onConfirmAllocation={() => handleConfirmAllocation(selectedIncident.id)}
              onRemoveStaged={(resId) => handleRemoveStaged(resId, selectedIncident.id)}
            />
          )}
        </div>

        {/* RIGHT ZONE: Sidebar container */}
        <div className="w-[40%] h-full flex flex-col bg-dark/50 backdrop-blur-md">
          {/* Top Half: Incident Queue */}
          <div className="flex-1 flex flex-col min-h-0 border-b border-white/10">
            <IncidentQueue
              incidents={filteredIncidents}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              onSelectIncident={handleSelectIncident}
              onAssignResource={handleStageResource}
            />
          </div>

          {/* Bottom Half: Resource Board */}
          <div className="h-[40%] min-h-0 flex flex-col bg-black/20">
            <ResourceBoard resources={resources} />
          </div>
        </div>
      </div>

      <ToastNotification toast={toast} onDismiss={handleDismissToast} />
    </div>
  );
}

export default App;
