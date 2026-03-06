import React from 'react';
import { X, ShieldAlert, Cpu, Activity, Clock, Maximize2 } from 'lucide-react';
import { getTypeIcon, getStatusColor, getPriorityLabel, formatTimeAgo } from '../utils/priorityHelpers';
import * as Icons from 'lucide-react';

export default function IncidentDetailOverlay({ incident, onClose, onExpand, onStageResource, onConfirmAllocation, onRemoveStaged }) {
    const [isDragOver, setIsDragOver] = React.useState(false);

    if (!incident) return null;

    const TypeIcon = Icons[getTypeIcon(incident.type)] || Icons.AlertTriangle;
    const isCritical = incident.priorityScore >= 80;

    // Calculate stroke dasharray for SVG ring
    const circleRadius = 24;
    const circumference = 2 * Math.PI * circleRadius;
    const strokeDashoffset = circumference - (incident.priorityScore / 100) * circumference;
    const ringColor = isCritical ? 'text-red-500' : incident.priorityScore >= 60 ? 'text-orange-500' : incident.priorityScore >= 40 ? 'text-yellow-500' : 'text-blue-500';

    const handleDragOver = (e) => {
        e.preventDefault();
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
        if (incident.status === 'assigned') return;

        const resourceId = e.dataTransfer.getData('resourceId') || e.dataTransfer.getData('text/plain');
        if (resourceId && onStageResource) {
            onStageResource(resourceId);
        }
    };

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`absolute bottom-6 left-6 z-50 w-96 rounded-2xl glass-panel shadow-2xl border transition-all duration-300 animate-[slideUp_0.4s_ease-out] overflow-hidden pointer-events-auto ${isDragOver ? 'border-amber-500 bg-amber-500/10 scale-[1.02]' : 'border-white/10'
                }`}>

            {/* Header */}
            <div className={`p-4 border-b border-white/10 relative overflow-hidden ${isCritical ? 'bg-red-500/10' : 'bg-white/5'}`}>
                <div className="absolute top-3 right-3 flex items-center gap-1">
                    <button
                        onClick={onExpand}
                        className="p-1.5 text-gray-400 hover:text-white rounded bg-black/20 hover:bg-black/40 transition-all-300"
                        title="View Full Details"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-white rounded bg-black/20 hover:bg-black/40 transition-all-300"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-start gap-4 pr-16 mt-2">
                    <div className={`p-2 rounded-xl bg-dark/50 ${isCritical ? 'critical-node-glow' : ''}`}>
                        <TypeIcon className={`w-6 h-6 ${ringColor}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight mb-1 truncate mr-2" title={incident.title}>
                            {incident.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                            <span className={getStatusColor(incident.status)}>{incident.status.toUpperCase()}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTimeAgo(incident.timeAgo)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body Content */}
            <div className="p-4 bg-dark/70 space-y-4">

                {/* Priority Score & Location */}
                <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                        <svg className="w-16 h-16 transform -rotate-90">
                            <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                            <circle cy="32" cx="32" r="24" stroke="currentColor" strokeWidth="4" fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                className={`${ringColor} transition-all duration-1000 ease-out`} />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center font-mono">
                            <span className="text-lg font-bold leading-none">{incident.priorityScore}</span>
                        </div>
                    </div>

                    <div className="text-sm text-gray-300 leading-snug">
                        <p className="font-medium text-white mb-1"><Activity className="w-3 h-3 inline mr-1 opacity-70" />{incident.location}</p>
                        <p className="line-clamp-2 opacity-80">{incident.description}</p>
                    </div>
                </div>

                {/* AI Reasoning */}
                <div>
                    <h4 className="flex items-center gap-1 text-[10px] tracking-widest text-gray-400 uppercase mb-2 font-semibold">
                        <Cpu className="w-3 h-3" /> AI Analysis
                    </h4>
                    <div className="space-y-1.5">
                        {incident.aiReasoning.map((reason, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white/5 rounded px-2 py-1 text-xs">
                                <span className="text-gray-300">{reason.factor}</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-white/90">{reason.value}</span>
                                    <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500" style={{ width: `${reason.weight * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action/Resources */}
                <div className="pt-2 border-t border-white/10">
                    <h4 className="flex items-center gap-1 text-[10px] tracking-widest text-gray-400 uppercase mb-2 font-semibold">
                        <ShieldAlert className="w-3 h-3" /> Required Resources
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                        {incident.requiredResources.map((req, idx) => {
                            const RIcon = Icons[getTypeIcon(req.type)] || Icons.AlertTriangle;
                            return (
                                <div key={idx} className="flex items-center gap-1.5 bg-white/5 border border-white/10 py-1 px-2.5 rounded-md hover:bg-white/10 transition-colors">
                                    <RIcon className="w-3.5 h-3.5 text-gray-300" />
                                    <span className="text-xs text-gray-300 capitalize">{req.type}</span>
                                    <span className="text-[10px] font-mono font-medium ml-1 bg-white/10 px-1.5 py-0.5 rounded text-white">{req.count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Staged Resources */}
                {(incident.stagedResources && incident.stagedResources.length > 0) && (
                    <div className="pt-2 border-t border-white/10">
                        <h4 className="flex items-center gap-1 text-[10px] tracking-widest text-indigo-400 uppercase mb-2 font-semibold">
                            <Icons.Layers className="w-3 h-3" /> Staged Allocations
                        </h4>
                        <div className="flex flex-col gap-2">
                            {incident.stagedResources.map((stagedRes) => {
                                const RIcon = Icons[getTypeIcon(stagedRes.type)] || Icons.Activity;
                                return (
                                    <div key={stagedRes.id} className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-md">
                                        <div className="flex items-center gap-2">
                                            <RIcon className="w-4 h-4 text-indigo-400" />
                                            <span className="text-xs font-mono font-bold text-white/90">{stagedRes.name}</span>
                                        </div>
                                        <button
                                            onClick={() => onRemoveStaged(stagedRes.id)}
                                            className="text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

            </div>

            {/* Footer Action */}
            <div className="p-3 bg-white/5 border-t border-white/10">
                {incident.status === 'assigned' ? (
                    <div className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-all-300 shadow-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default animate-[pulse_2s_ease-out_1]">
                        <Icons.CheckCircle className="w-4 h-4" />
                        Allocated: {incident.assignedResources ? incident.assignedResources.map(r => r.name).join(', ') : incident.assignedResource}
                    </div>
                ) : incident.stagedResources && incident.stagedResources.length > 0 ? (
                    <button
                        onClick={onConfirmAllocation}
                        className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-all-300 shadow-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20 animate-pulse">
                        <Icons.ShieldCheck className="w-4 h-4" />
                        Confirm Allocation ({incident.stagedResources.length})
                    </button>
                ) : (
                    <button className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-all-300 shadow-lg ${isDragOver
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 scale-[1.02] animate-pulse'
                        : isCritical
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                            : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20'
                        }`}>
                        {isDragOver ? <><Icons.Download className="w-4 h-4" /> Drop to Assign</> : 'Drag Unit Here to Assign'}
                    </button>
                )}
            </div>

        </div>
    );
}
