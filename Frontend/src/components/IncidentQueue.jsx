import React from 'react';
import IncidentCard from './IncidentCard';
import { Filter } from 'lucide-react';

export default function IncidentQueue({ incidents, activeFilter, onFilterChange, onSelectIncident, onAssignResource }) {
    const tabs = [
        { id: 'all', label: 'ALL' },
        { id: 'critical', label: 'CRITICAL' },
        { id: 'high', label: 'HIGH' },
        { id: 'medium', label: 'MEDIUM' }
    ];

    // Sort by priority score descending
    const sortedIncidents = [...incidents].sort((a, b) => b.priorityScore - a.priorityScore);

    return (
        <div className="flex flex-col h-full w-full bg-black/40 backdrop-blur-sm">

            {/* Header & Filters */}
            <div className="p-4 border-b border-white/10 shrink-0 bg-white/5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold tracking-widest text-white/90">INCIDENT QUEUE</h2>
                    <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-gray-300">
                        {sortedIncidents.length} items
                    </span>
                </div>

                <div className="flex bg-dark/50 rounded-lg p-1 border border-white/5">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onFilterChange(tab.id)}
                            className={`flex-1 text-[10px] font-bold tracking-wider py-1.5 rounded transition-all-300 ${activeFilter === tab.id
                                    ? 'bg-white/15 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {sortedIncidents.map(inc => (
                    <IncidentCard
                        key={inc.id}
                        incident={inc}
                        onClick={() => onSelectIncident(inc)}
                        onDropResource={(resId) => onAssignResource(resId, inc.id)}
                    />
                ))}
                {sortedIncidents.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2 opacity-50">
                        <Filter className="w-8 h-8" />
                        <p className="text-sm">No incidents match filter.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
