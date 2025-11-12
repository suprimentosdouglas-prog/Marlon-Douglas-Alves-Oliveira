import React, { useState, useEffect } from 'react';
import { Solicitacao, SolicitacaoServico } from '../../types';
import { format } from '../../utils/dateUtils';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { calcularDuracao, getStatusServico, formatCurrency } from '../../utils/statusCalculations';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Save, FileText } from '../icons';

interface DetalhesServicoModalProps {
    servico: SolicitacaoServico | null;
    open: boolean;
    onClose: () => void;
    onUpdate: (id: string, data: Partial<Solicitacao>) => void;
    isAdmin: boolean;
}

const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="font-medium text-slate-800">{value}</p>
    </div>
);

export default function DetalhesServicoModal({ servico, open, onClose, onUpdate, isAdmin }: DetalhesServicoModalProps) {
    const [titulo, setTitulo] = useState('');
    const [observacoes, setObservacoes] = useState('');

    useEffect(() => {
        if (servico) {
            setTitulo(servico.titulo);
            setObservacoes(servico.observacoes || '');
        }
    }, [servico]);
    
    const handleSave = () => {
        if (!servico) return;
        onUpdate(servico.id, { titulo, observacoes });
        onClose();
    };

    if (!servico) return null;

    const statusInfo = getStatusServico(servico);
    const duracao = calcularDuracao(servico.dataInicio, servico.dataFinal);

    return (
        <Dialog open={open} onClose={onClose} title={`Detalhes - ${servico.id}`}>
            <div className="p-6 space-y-4">
                <div className="pb-4 border-b">
                    {isAdmin ? (
                        <div>
                             <Label htmlFor={`titulo-serv-${servico.id}`} className="text-xs">Título</Label>
                             <Input id={`titulo-serv-${servico.id}`} value={titulo} onChange={(e) => setTitulo(e.target.value)} className="text-lg font-bold p-1 border-slate-200" />
                        </div>
                    ) : (
                        <h3 className="text-lg font-bold text-slate-900">{servico.titulo}</h3>
                    )}
                    <p className="text-sm text-slate-600">{servico.descricao}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <DetailRow label="Status" value={<span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusInfo.cor} ${statusInfo.textoCor}`}>{statusInfo.status}</span>} />
                    <DetailRow label="Obra / Setor" value={servico.obraSetor} />
                    <DetailRow label="Solicitante" value={servico.solicitante} />
                    <DetailRow label="Fornecedor" value={servico.fornecedorNome} />
                    <DetailRow label="Valor" value={formatCurrency(servico.valor)} />
                    <DetailRow label="Data de Início" value={format(servico.dataInicio, 'dd/MM/yyyy')} />
                    <DetailRow label="Término Previsto" value={format(servico.dataFinal, 'dd/MM/yyyy')} />
                    {servico.dataConclusaoReal && <DetailRow label="Conclusão Real" value={format(servico.dataConclusaoReal, 'dd/MM/yyyy')} />}
                    <DetailRow label="Duração do Contrato" value={duracao} />
                    <DetailRow label="Prioridade" value={<span className="capitalize">{servico.prioridade}</span>} />
                </div>
                 <div className="pt-4 border-t">
                    <Label htmlFor={`obs-serv-${servico.id}`} className="text-sm text-slate-500 mb-2">Observações</Label>
                     {isAdmin ? (
                         <Textarea 
                            id={`obs-serv-${servico.id}`}
                            value={observacoes} 
                            onChange={e => setObservacoes(e.target.value)} 
                            rows={4}
                            placeholder="Adicione observações sobre o serviço..."
                        />
                     ) : (
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{servico.observacoes || 'Nenhuma observação.'}</p>
                     )}
                </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end items-center">
                <div className="flex justify-end gap-3">
                    {isAdmin && (
                        <Button variant="primary" onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar
                        </Button>
                    )}
                    <Button variant="outline" onClick={onClose}>Fechar</Button>
                </div>
            </div>
        </Dialog>
    );
}