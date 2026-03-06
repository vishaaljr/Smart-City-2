import React from 'react';
import { useLiveClock } from '../hooks/useLiveClock';
import { useLiveStats } from '../hooks/useLiveStats';
import { Activity, Radio, AlertTriangle, ShieldCheck, UserCircle } from 'lucide-react';

export default function TopBar() {
    const time = useLiveClock();
    const stats = useLiveStats();

    return (
        <div className="h-14 w-full bg-[#0a0e1a]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-40 relative">

            {/* LEFT: Logo */}
            <div className="flex items-center gap-3">
                <Activity className="text-amber-500 w-6 h-6 animate-pulse" />
                <span className="font-bold tracking-widest text-lg bg-gradient-to-r from-amber-500 to-amber-200 bg-clip-text text-transparent">
                    NEXUS
                </span>
                <span className="text-xs text-gray-400 border-l border-white/20 pl-3 ml-1 tracking-widest uppercase hidden md:block">
                    City Intelligence
                </span>
            </div>

            {/* CENTER: Live Stats pills */}
            <div className="flex items-center gap-4">
                <StatPill icon={<AlertTriangle className="w-4 h-4 text-red-400" />} label="ACTIVE" value={stats.activeIncidents} />
                <StatPill icon={<Radio className="w-4 h-4 text-amber-400" />} label="DEPLOYED" value={stats.unitsDeployed} />
                <StatPill icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />} label="CRIT ZONES" value={stats.criticalZones} />
                <StatPill icon={<Activity className="w-4 h-4 text-blue-400" />} label="AVG RESP" value={stats.avgResponse} />
            </div>

            {/* RIGHT: Clock & Operator */}
            <div className="flex items-center gap-6">
                <div className="font-mono text-amber-500 tracking-wider text-sm bg-black/40 px-3 py-1 rounded border border-white/10">
                    {time}
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded transition-all-300">
                    <UserCircle className="w-6 h-6 text-gray-300" />
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold leading-none">OP-774</span>
                        <span className="text-[10px] text-emerald-400 font-mono leading-none mt-1">ONLINE</span>
                    </div>
                </div>
            </div>

        </div>
    );
}

function StatPill({ icon, label, value }) {
    // flash effect triggered by keying the value could be added
    return (
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 transition-all-300 hover:bg-white/10">
            {icon}
            <span className="text-xs text-gray-400 font-medium tracking-wide">{label}</span>
            <span className="font-mono text-sm font-semibold">{value}</span>
        </div>
    );
}
