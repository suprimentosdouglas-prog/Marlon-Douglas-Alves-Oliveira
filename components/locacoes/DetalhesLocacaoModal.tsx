import React, { useState, useEffect } from 'react';
import { Solicitacao, SolicitacaoLocacao } from '../../types';
import { format } from '../../utils/dateUtils';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { calcularDuracao, getStatusLocacao } from '../../utils/statusCalculations';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Save, FileText } from '../icons';


interface DetalhesLocacaoModalProps {
    locacao: SolicitacaoLocacao | null;
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

export default function DetalhesLocacaoModal({ locacao, open, onClose, onUpdate, isAdmin }: DetalhesLocacaoModalProps) {
    const [titulo, setTitulo] = useState('');
    const [observacoes, setObservacoes] = useState('');

    useEffect(() => {
        if (locacao) {
            setTitulo(locacao.titulo);
            setObservacoes(locacao.observacoes || '');
        }
    }, [locacao]);

    const handleSave = () => {
        if (!locacao) return;
        onUpdate(locacao.id, { titulo, observacoes });
        onClose();
    };
    
    if (!locacao) return null;

    const statusInfo = getStatusLocacao(locacao);
    const duracao = calcularDuracao(locacao.dataInicio, locacao.dataDevolucaoPrevista);

    return (
        <Dialog open={open} onClose={onClose} title={`Detalhes - ${locacao.id}`}>
            <div className="p-6 space-y-4">
                <div className="pb-4 border-b">
                    {isAdmin ? (
                        <div>
                            <Label htmlFor={`titulo-loc-${locacao.id}`} className="text-xs">Título</Label>
                            <Input id={`titulo-loc-${locacao.id}`} value={titulo} onChange={(e) => setTitulo(e.target.value)} className="text-lg font-bold p-1 border-slate-200" />
                        </div>
                    ) : (
                        <h3 className="text-lg font-bold text-slate-900">{locacao.titulo}</h3>
                    )}
                    <p className="text-sm text-slate-600">{locacao.descricao}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <DetailRow label="Status" value={<span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusInfo.cor} ${statusInfo.textoCor}`}>{statusInfo.status}</span>} />
                    <DetailRow label="Obra / Setor" value={locacao.obraSetor} />
                    <DetailRow label="Solicitante" value={locacao.solicitante} />
                    <DetailRow label="Quantidade" value={`${locacao.quantidade} unidade(s)`} />
                    <DetailRow label="Data de Início" value={format(locacao.dataInicio, 'dd/MM/yyyy')} />
                    <DetailRow label="Devolução Prevista" value={format(locacao.dataDevolucaoPrevista, 'dd/MM/yyyy')} />
                    {locacao.dataDevolucaoReal && <DetailRow label="Devolução Real" value={format(locacao.dataDevolucaoReal, 'dd/MM/yyyy')} />}
                    <DetailRow label="Duração do Contrato" value={duracao} />
                    <DetailRow label="Prioridade" value={<span className="capitalize">{locacao.prioridade}</span>} />
                </div>
                {locacao.historicoRenovacoes && (
                    <div className="pt-4 border-t">
                        <p className="text-sm text-slate-500 mb-2">Histórico de Renovações</p>
                        <div className="text-sm font-mono bg-slate-100 p-3 rounded-md text-slate-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                           {locacao.historicoRenovacoes}
                        </div>
                    </div>
                )}
                 <div className="pt-4 border-t">
                    <Label htmlFor={`obs-loc-${locacao.id}`} className="text-sm text-slate-500 mb-2">Observações</Label>
                     {isAdmin ? (
                         <Textarea 
                            id={`obs-loc-${locacao.id}`}
                            value={observacoes} 
                            onChange={e => setObservacoes(e.target.value)} 
                            rows={4}
                            placeholder="Adicione observações sobre a locação..."
                        />
                     ) : (
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{locacao.observacoes || 'Nenhuma observação.'}</p>
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