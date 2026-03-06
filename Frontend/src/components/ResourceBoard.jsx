import React from 'react';
import ResourceCard from './ResourceCard';
import { Layers } from 'lucide-react';

export default function ResourceBoard({ resources }) {
    // Group resources by type
    const groupedResources = resources.reduce((acc, curr) => {
        const type = curr.type.toUpperCase();
        if (!acc[type]) acc[type] = [];
        acc[type].push(curr);
        return acc;
    }, {});

    const groupKeys = Object.keys(groupedResources).sort();

    return (
        <div className="flex flex-col h-full w-full">

            {/* Header */}
            <div className="p-3 border-b border-white/10 shrink-0 bg-dark/80 backdrop-blur flex justify-between items-center">
                <h2 className="text-sm font-bold tracking-widest text-white/90 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    RESOURCE UNITS
                </h2>
                <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-gray-300">
                    {resources.filter(r => r.status === 'available').length} / {resources.length} AVAIL
                </span>
            </div>

            {/* Grouped Lists (Horizontal Scroll horizontally, or vertical? 
          "grouped by type... scrollable" 
          Let's do horizontal scroll of vertical columns, or just a vertical list of horizontal rows.
          Let's do vertical scroll with grouped sections. */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {groupKeys.map(type => (
                    <div key={type} className="space-y-3">
                        <h3 className="text-xs font-semibold tracking-widest text-gray-500 border-b border-white/5 pb-1 uppercase flex justify-between">
                            <span>{type}</span>
                            <span>{groupedResources[type].filter(r => r.status === 'available').length} Available</span>
                        </h3>

                        <div className="grid grid-cols-2 gap-3 xl:grid-cols-2">
                            {groupedResources[type].map(resource => (
                                <ResourceCard key={resource.id} resource={resource} />
                            ))}
                        </div>
                    </div>
                ))}
                {groupKeys.length === 0 && (
                    <div className="text-gray-500 text-sm text-center py-4">No resources loaded</div>
                )}
            </div>

        </div>
    );
}
