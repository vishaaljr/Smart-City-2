import React from 'react';
import * as Icons from 'lucide-react';
import { getTypeIcon } from '../utils/priorityHelpers';

export default function ResourceCard({ resource }) {

    const isAvailable = resource.status === 'available';
    const isOffline = resource.status === 'offline';
    const isDeployed = resource.status === 'deployed';

    const handleDragStart = (e) => {
        if (!isAvailable) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData('resourceId', resource.id);
        e.dataTransfer.setData('text/plain', resource.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const RIcon = Icons[getTypeIcon(resource.type)] || Icons.Activity;

    return (
        <div
            draggable={isAvailable}
            onDragStart={handleDragStart}
            className={`relative p-3 rounded-lg border flex flex-col justify-between min-h-[70px] transition-all-300
        ${isAvailable ? 'bg-white/5 border-white/10 hover:border-white/30 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 shadow-sm' :
                    isDeployed ? 'bg-amber-500/10 border-amber-500/30' :
                        'bg-gray-800/20 border-gray-700/30 opacity-60'}
      `}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 truncate">
                    <RIcon className={`w-4 h-4 shrink-0 ${isAvailable ? 'text-gray-300' : isDeployed ? 'text-amber-500' : 'text-gray-600'}`} />
                    <h4 className={`text-xs font-mono font-bold truncate ${isAvailable ? 'text-white' : 'text-gray-400'}`}>
                        {resource.name}
                    </h4>
                </div>

                {/* Status Dot */}
                <div className="shrink-0 flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' :
                        isDeployed ? 'bg-amber-500 animate-pulse' :
                            'bg-gray-600'
                        }`} />
                </div>
            </div>

            <div className="flex justify-between items-center mt-auto">
                <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                    {resource.zone}
                </span>

                <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${isAvailable ? 'bg-emerald-500/10 text-emerald-500' :
                    isDeployed ? 'bg-amber-500/10 text-amber-500' :
                        'bg-gray-700/50 text-gray-500'
                    }`}>
                    {resource.status}
                </span>
            </div>

            {isAvailable && (
                <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors rounded-lg pointer-events-none" />
            )}
        </div>
    );
}
