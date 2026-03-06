import React from 'react';
import { X, ShieldAlert, Cpu, Activity, Clock, Maximize2, MapPin } from 'lucide-react';
import { getTypeIcon, getStatusColor, getPriorityLabel, formatTimeAgo } from '../utils/priorityHelpers';
import * as Icons from 'lucide-react';

export default function IncidentModal({ incident, onClose, onStageResource, onConfirmAllocation, onRemoveStaged }) {
    const [isDragOver, setIsDragOver] = React.useState(false);

    if (!incident) return null;

    const TypeIcon = Icons[getTypeIcon(incident.type)] || Icons.AlertTriangle;
    const isCritical = incident.priorityScore >= 80;

    const circleRadius = 40;
    const circumference = 2 * Math.PI * circleRadius;
    const strokeDashoffset = circumference - (incident.priorityScore / 100) * circumference;
    const ringColor = isCritical ? 'text-red-500' : incident.priorityScore >= 60 ? 'text-orange-500' : incident.priorityScore >= 40 ? 'text-yellow-500' : 'text-blue-500';

    const handleDragEnter = (e) => e.preventDefault();
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    const handleDragLeave = () => setIsDragOver(false);
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-[fadeIn_0.3s_ease-out]">
            <div
                className="w-full max-w-5xl h-[85vh] bg-dark rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col animate-[slideUp_0.4s_ease-out] relative"
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Header */}
                <div className={`shrink-0 p-6 border-b border-white/10 relative overflow-hidden ${isCritical ? 'bg-red-500/10' : 'bg-white/5'}`}>
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all-300 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className={`p-4 rounded-2xl bg-dark/50 shadow-xl ${isCritical ? 'critical-node-glow' : ''}`}>
                            <TypeIcon className={`w-10 h-10 ${ringColor}`} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{incident.title}</h2>
                            <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
                                <span className={`px-2 py-1 rounded-md bg-white/5 border border-white/10 ${getStatusColor(incident.status)}`}>
                                    {incident.status.toUpperCase()}
                                </span>
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formatTimeAgo(incident.timeAgo)}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {incident.location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body - Split View */}
                <div className="flex-1 flex overflow-hidden">

                    {/* LEFT COLUMN */}
                    <div className="w-1/2 p-8 border-r border-white/10 overflow-y-auto custom-scrollbar">
                        <div className="flex items-start gap-8 mb-8">
                            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                                <svg className="w-28 h-28 transform -rotate-90">
                                    <circle cx="56" cy="56" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/10" />
                                    <circle cy="56" cx="56" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        className={`${ringColor} transition-all duration-1000 ease-out`} />
                                </svg>
                                <div className="absolute flex flex-col items-center justify-center font-mono">
                                    <span className="text-3xl font-bold leading-none">{incident.priorityScore}</span>
                                    <span className="text-[10px] text-gray-400 mt-1 uppercase">Priority</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white/90 mb-2">Incident Description</h3>
                                <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">{incident.description}</p>
                            </div>
                        </div>

                        {/* Staged & Allocated Resources */}
                        <div className="space-y-6">
                            {(incident.stagedResources && incident.stagedResources.length > 0) && (
                                <div>
                                    <h4 className="flex items-center gap-2 text-xs tracking-widest text-indigo-400 uppercase mb-3 font-semibold">
                                        <Icons.Layers className="w-4 h-4" /> Staged Allocations
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                        {incident.stagedResources.map((stagedRes) => {
                                            const RIcon = Icons[getTypeIcon(stagedRes.type)] || Icons.Activity;
                                            return (
                                                <div key={stagedRes.id} className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/30 px-4 py-3 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <RIcon className="w-5 h-5 text-indigo-400" />
                                                        <span className="text-sm font-mono font-bold text-white/90">{stagedRes.name}</span>
                                                    </div>
                                                    <button onClick={() => onRemoveStaged(stagedRes.id)} className="text-gray-400 hover:text-red-400 transition-colors p-1 bg-black/20 rounded hover:bg-black/40">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {(incident.status === 'assigned') && (
                                <div>
                                    <h4 className="flex items-center gap-2 text-xs tracking-widest text-emerald-400 uppercase mb-3 font-semibold">
                                        <Icons.CheckCircle className="w-4 h-4" /> Officially Deployed
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                        {(incident.assignedResources || [{ name: incident.assignedResource, id: 'legacy' }]).map((r, i) => (
                                            <div key={r.id || i} className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 rounded-lg">
                                                <Icons.ShieldCheck className="w-5 h-5 text-emerald-400" />
                                                <span className="text-sm font-mono font-bold text-emerald-100">{r.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="w-1/2 p-8 bg-black/20 overflow-y-auto custom-scrollbar flex flex-col">
                        <div className="mb-8">
                            <h4 className="flex items-center gap-2 text-xs tracking-widest text-amber-400 uppercase mb-4 font-semibold">
                                <ShieldAlert className="w-4 h-4" /> Required Resources
                            </h4>
                            <div className="flex gap-3 flex-wrap">
                                {incident.requiredResources.map((req, idx) => {
                                    const RIcon = Icons[getTypeIcon(req.type)] || Icons.AlertTriangle;
                                    return (
                                        <div key={idx} className="flex items-center gap-2 bg-white/5 border border-white/10 py-2 px-4 rounded-lg">
                                            <RIcon className="w-5 h-5 text-gray-300" />
                                            <span className="text-sm text-gray-300 capitalize">{req.type}</span>
                                            <span className="text-xs font-mono font-bold ml-2 bg-white/10 px-2 py-1 rounded text-white">{req.count} required</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex-1">
                            <h4 className="flex items-center gap-2 text-xs tracking-widest text-blue-400 uppercase mb-4 font-semibold">
                                <Cpu className="w-4 h-4" /> AI Tactical Analysis
                            </h4>
                            <div className="space-y-3">
                                {incident.aiReasoning.map((reason, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 text-sm border border-white/5">
                                        <span className="text-gray-300">{reason.factor}</span>
                                        <div className="flex items-center gap-3 w-48 shrink-0 justify-end">
                                            <span className="font-mono text-white/90 whitespace-nowrap">{reason.value}</span>
                                            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${reason.weight * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Dropzone Action */}
                <div className={`shrink-0 p-6 bg-dark border-t border-white/10 transition-all duration-300 ${isDragOver ? 'bg-amber-500/10 border-amber-500' : ''}`}>
                    {incident.status === 'assigned' ? (
                        <div className="w-full py-4 rounded-xl flex items-center justify-center gap-3 font-medium text-lg transition-all-300 shadow-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default animate-[pulse_2s_ease-out_1]">
                            <Icons.CheckCircle className="w-6 h-6" />
                            Allocated: {incident.assignedResources ? incident.assignedResources.map(r => r.name).join(', ') : incident.assignedResource}
                        </div>
                    ) : incident.stagedResources && incident.stagedResources.length > 0 ? (
                        <button
                            onClick={onConfirmAllocation}
                            className="w-full py-4 rounded-xl flex items-center justify-center gap-3 font-medium text-lg transition-all-300 shadow-2xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/30 animate-pulse">
                            <Icons.ShieldCheck className="w-6 h-6" />
                            Confirm Allocation ({incident.stagedResources.length} Units)
                        </button>
                    ) : (
                        <div className={`w-full py-6 rounded-xl flex flex-col items-center justify-center gap-2 font-medium transition-all-300 border-2 border-dashed ${isDragOver ? 'border-amber-400 bg-amber-500/20 text-amber-100 scale-[1.01]' : 'border-white/20 bg-white/5 text-gray-400 hover:border-white/40'
                            }`}>
                            <Icons.Download className={`w-8 h-8 ${isDragOver ? 'animate-bounce text-amber-400' : 'opacity-50'}`} />
                            <span className="text-lg">{isDragOver ? 'Drop to Assign Resources' : 'Drag Units Here to Assign'}</span>
                            <span className="text-xs font-normal opacity-60">Units will be staged for confirmation</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
