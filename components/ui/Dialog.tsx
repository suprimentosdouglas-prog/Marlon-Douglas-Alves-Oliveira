import React from 'react';
import { X } from '../icons';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onClose, title, children }) => {
    if (!open) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </header>
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
};