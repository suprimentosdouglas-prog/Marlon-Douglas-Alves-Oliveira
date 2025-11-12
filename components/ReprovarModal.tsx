import React, { useState, useEffect } from 'react';
import { Solicitacao, StatusAprovacao } from '../types';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Label } from './ui/Label';

interface ReprovarModalProps {
    solicitacao: Solicitacao | null;
    open: boolean;
    onClose: () => void;
    onConfirm: (id: string, status: StatusAprovacao, motivo: string) => void;
}

export default function ReprovarModal({ solicitacao, open, onClose, onConfirm }: ReprovarModalProps) {
    const [motivo, setMotivo] = useState('');

    useEffect(() => {
        if (open) {
            setMotivo('');
        }
    }, [open]);

    const handleSubmit = () => {
        if (!motivo.trim()) {
            alert('Por favor, informe o motivo da reprovação.');
            return;
        }
        onConfirm(solicitacao!.id, StatusAprovacao.REPROVADA, motivo);
        onClose();
    };

    if (!solicitacao) return null;

    return (
        <Dialog open={open} onClose={onClose} title="Reprovar Solicitação">
            <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                    Você está reprovando a solicitação <strong>{solicitacao.id}</strong> ({solicitacao.titulo}).
                </p>
                <div className="space-y-2">
                    <Label htmlFor="motivo_reprovacao">Motivo da Reprovação *</Label>
                    <Textarea
                        id="motivo_reprovacao"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Descreva o motivo da reprovação..."
                        rows={4}
                        required
                    />
                </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Button variant="primary" onClick={handleSubmit} className="bg-red-600 hover:bg-red-700 focus:ring-red-500">Confirmar Reprovação</Button>
            </div>
        </Dialog>
    );
}
