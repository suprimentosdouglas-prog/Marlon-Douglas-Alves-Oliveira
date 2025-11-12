import React, { useState, useEffect } from 'react';
import { SolicitacaoLocacao } from '../../types';
import { format } from '../../utils/dateUtils';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';

interface DevolverModalProps {
    locacao: SolicitacaoLocacao | null;
    open: boolean;
    onClose: () => void;
    onConfirm: (id: string, dataDevolucao: Date, observacoes: string) => void;
}

export default function DevolverModal({ locacao, open, onClose, onConfirm }: DevolverModalProps) {
    const [dataDevolucao, setDataDevolucao] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [observacoes, setObservacoes] = useState('');

    useEffect(() => {
        if (open) {
            setDataDevolucao(format(new Date(), 'yyyy-MM-dd'));
            setObservacoes('');
        }
    }, [open]);

    const handleSubmit = () => {
        if (!dataDevolucao) {
            alert('Por favor, informe a data de devolução.');
            return;
        }
        onConfirm(locacao!.id, new Date(dataDevolucao + 'T00:00:00'), observacoes);
        onClose();
    };

    if (!locacao) return null;

    return (
        <Dialog open={open} onClose={onClose} title="Marcar como Devolvido">
            <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                    Você está confirmando a devolução de <strong>{locacao.titulo}</strong>.
                </p>
                <div className="space-y-2">
                    <Label htmlFor="data_devolucao">Data da Devolução *</Label>
                    <Input
                        id="data_devolucao"
                        type="date"
                        value={dataDevolucao}
                        onChange={(e) => setDataDevolucao(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações (opcional)</Label>
                    <Textarea
                        id="observacoes"
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        placeholder="Ex: equipamento entregue em perfeitas condições."
                        rows={3}
                    />
                </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Button variant="primary" onClick={handleSubmit}>Confirmar Devolução</Button>
            </div>
        </Dialog>
    );
}