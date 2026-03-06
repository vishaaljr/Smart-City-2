import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function ToastNotification({ toast, onDismiss }) {

    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                onDismiss();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast, onDismiss]);

    if (!toast.visible) return null;

    return (
        <div className="absolute bottom-6 right-6 z-50 animate-[slideUp_0.4s_ease-out]">
            <div className="bg-dark/90 text-white rounded-lg shadow-2xl border border-white/20 p-4 pr-12 min-w-[300px] flex items-start gap-3 glass-panel relative">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-sm tracking-wide text-white/90">Assignment Confirmed</h4>
                    <p className="text-xs text-gray-300 mt-1">{toast.message}</p>
                </div>

                <button
                    onClick={onDismiss}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
