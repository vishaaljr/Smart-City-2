export function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'critical': return 'text-red-500';
        case 'high': return 'text-orange-500';
        case 'medium': return 'text-yellow-500';
        case 'low': return 'text-blue-500';
        case 'incoming': return 'text-blue-400';
        case 'active': return 'text-amber-500';
        case 'assigned': return 'text-emerald-500';
        case 'available': return 'text-emerald-500';
        case 'staged': return 'text-indigo-400';
        case 'deployed': return 'text-amber-500';
        case 'offline': return 'text-gray-500';
        default: return 'text-gray-400';
    }
}

export function getPriorityColor(score) {
    if (score >= 80) return '#ef4444'; // red-500
    if (score >= 60) return '#f97316'; // orange-500
    if (score >= 40) return '#eab308'; // yellow-500
    return '#3b82f6'; // blue-500
}

export function getTypeIcon(type) {
    switch (type.toLowerCase()) {
        case 'fire': return 'Flame';
        case 'flood': return 'Droplets';
        case 'medical': return 'Heart';
        case 'police': return 'Shield';
        case 'crime': return 'Shield';
        case 'hazmat': return 'FlaskConical';
        case 'rescue': return 'Zap';
        case 'infrastructure': return 'Zap'; // User specified generic ones, picking similar
        default: return 'AlertTriangle';
    }
}

export function formatTimeAgo(minutesAgo) {
    if (minutesAgo < 60) return `${minutesAgo} min ago`;
    const hrs = Math.floor(minutesAgo / 60);
    return `${hrs} hr ago`;
}

export function getPriorityLabel(score) {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
}
