import React, { useState, useEffect } from 'react';
import { SolicitacaoLocacao } from '../../types';
import { format } from '../../utils/dateUtils';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';

interface RenovarModalProps {
    locacao: SolicitacaoLocacao | null;
    open: boolean;
    onClose: () => void;
    onConfirm: (id: string, novaData: Date, motivo: string) => void;
}

export default function RenovarModal({ locacao, open, onClose, onConfirm }: RenovarModalProps) {
    const [novaData, setNovaData] = useState('');
    const [motivo, setMotivo] = useState('');

    useEffect(() => {
        if (locacao) {
            // Reset fields when a new item is selected
            setNovaData('');
            setMotivo('');
        }
    }, [locacao]);

    const handleSubmit = () => {
        if (!novaData || !motivo) {
            alert('Por favor, preencha a nova data e o motivo.');
            return;
        }
        const dataDevolucao = new Date(novaData + 'T00:00:00');
        if (isNaN(dataDevolucao.getTime()) || dataDevolucao <= locacao!.dataDevolucaoPrevista) {
            alert('Data inválida. A nova data deve ser posterior à data de devolução atual.');
            return;
        }
        onConfirm(locacao!.id, dataDevolucao, motivo);
        onClose();
    };

    if (!locacao) return null;

    return (
        <Dialog open={open} onClose={onClose} title="Renovar Locação">
            <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                    Você está renovando a locação para <strong>{locacao.titulo}</strong>.
                    A data de devolução atual é {format(locacao.dataDevolucaoPrevista, 'dd/MM/yyyy')}.
                </p>
                <div className="space-y-2">
                    <Label htmlFor="nova_data">Nova Data de Devolução *</Label>
                    <Input
                        id="nova_data"
                        type="date"
                        value={novaData}
                        onChange={(e) => setNovaData(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="motivo">Motivo da Renovação *</Label>
                    <Textarea
                        id="motivo"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Descreva o motivo da renovação..."
                        rows={3}
                    />
                </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Button variant="primary" onClick={handleSubmit}>Confirmar Renovação</Button>
            </div>
        </Dialog>
    );
}