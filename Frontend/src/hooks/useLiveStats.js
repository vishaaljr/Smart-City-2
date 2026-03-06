import { useState, useEffect } from 'react';

export function useLiveStats() {
    const [stats, setStats] = useState({
        activeIncidents: 12,
        unitsDeployed: 4,
        criticalZones: 2,
        avgResponse: '4m 12s'
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => {
                // Simple random variances
                const variance = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
                return {
                    ...prev,
                    activeIncidents: Math.max(8, prev.activeIncidents + variance),
                    unitsDeployed: Math.max(2, prev.unitsDeployed + variance),
                    criticalZones: Math.max(1, prev.criticalZones + (Math.random() > 0.8 ? 1 : (Math.random() > 0.8 ? -1 : 0))),
                    // update avg response string slightly if needed, keeping it mostly static for demo
                    avgResponse: `4m ${Math.floor(Math.random() * 30 + 10)}s`
                };
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return stats;
}
