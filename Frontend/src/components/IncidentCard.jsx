import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { getTypeIcon, getPriorityColor, formatTimeAgo, getStatusColor } from '../utils/priorityHelpers';

export default function IncidentCard({ incident, onClick, onDropResource }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
        setIsDragOver(true);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        // Only allow dropping if incident isn't assigned
        if (incident.status === 'assigned') return;

        const resourceId = e.dataTransfer.getData('resourceId') || e.dataTransfer.getData('text/plain');
        if (resourceId) {
            onDropResource(resourceId);
        }
    };

    const RIcon = Icons[getTypeIcon(incident.type)] || Icons.AlertTriangle;
    const barColor = getPriorityColor(incident.priorityScore);
    const isCritical = incident.priorityScore >= 80;

    return (
        <div
            onClick={onClick}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-xl overflow-hidden glass-panel glass-panel-hover cursor-pointer transition-all-300 group
        ${isDragOver ? 'ring-2 ring-amber-500 ring-dashed scale-[1.02] bg-amber-500/10' : ''}
        ${isCritical && !isDragOver ? 'hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]' : ''}
      `}
        >
            {/* Left colored urgency bar */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all-300 ${isCritical ? 'animate-pulse-critical' : ''}`}
                style={{ backgroundColor: barColor }}
            />

            <div className="p-3 pl-4 flex gap-3">
                {/* Icon / Score */}
                <div className="flex flex-col items-center justify-center shrink-0 w-12 gap-1.5">
                    <div className={`p-2 rounded-lg bg-dark/60 border border-white/5 group-hover:bg-white/10 transition-colors`}>
                        <RIcon className="w-5 h-5" style={{ color: barColor }} />
                    </div>
                    <div className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-black/40 border border-white/10 shadow-inner">
                        {incident.priorityScore}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                        <div className="flex justify-between items-start gap-2 mb-0.5">
                            <h3 className="font-semibold text-sm truncate text-white/90 group-hover:text-white">{incident.title}</h3>
                            <div className="flex items-center gap-1 shrink-0 mt-0.5">
                                <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap">
                                    {formatTimeAgo(incident.timeAgo)}
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                                    className="text-gray-400 hover:text-white transition-colors p-0.5 rounded hover:bg-white/10"
                                >
                                    {isExpanded ? <Icons.ChevronUp className="w-3.5 h-3.5" /> : <Icons.ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 truncate w-full pr-4">{incident.location}</p>

                        {isExpanded && (
                            <div className="mt-2 p-2 bg-dark/50 rounded border border-white/5 animate-[slideDown_0.2s_ease-out]">
                                <p className="text-xs text-gray-300 leading-relaxed whitespace-normal break-words">
                                    {incident.description}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-white/5 ${incident.status === 'assigned' ? 'bg-emerald-500/20 text-emerald-400'
                            : incident.status === 'critical' ? 'bg-red-500/20 text-red-500'
                                : 'bg-white/10 text-gray-300'
                            }`}>
                            {incident.status}
                        </span>

                        {incident.status === 'assigned' && incident.assignedResource && (
                            <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                                {incident.assignedResource}
                            </span>
                        )}

                        {incident.status !== 'assigned' && incident.stagedResources && incident.stagedResources.length > 0 && (
                            <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                Staged: {incident.stagedResources.length}
                            </span>
                        )}

                        {/* Drag helper hint */}
                        {!incident.assignedResource && (
                            <span className="ml-auto text-[10px] text-gray-400 italic opacity-0 group-hover:opacity-100 transition-opacity">
                                Drop to Assign
                            </span>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}
