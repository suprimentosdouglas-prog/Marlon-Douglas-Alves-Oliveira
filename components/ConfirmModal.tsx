
import React from 'react';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { AlertTriangle } from './icons';

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmButtonText?: string;
    isDestructive?: boolean;
}

export default function ConfirmModal({ open, onClose, onConfirm, title, description, confirmButtonText = 'Confirmar', isDestructive = false }: ConfirmModalProps) {
    if (!open) return null;

    const confirmButtonClasses = isDestructive
        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

    return (
        <Dialog open={open} onClose={onClose} title={title}>
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-0 text-left">
                        <p className="text-sm text-slate-600">{description}</p>
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Button onClick={onConfirm} className={confirmButtonClasses}>
                    {confirmButtonText}
                </Button>
            </div>
        </Dialog>
    );
}
