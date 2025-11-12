

import React from 'react';
import { SolicitacaoLocacao } from '../../types';
import { getStatusLocacao } from '../../utils/statusCalculations';
import { format } from '../../utils/dateUtils';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Mail, Edit, FileText } from '../icons';

interface LocacaoCardProps {
    locacao: SolicitacaoLocacao;
    onRenovar: (locacao: SolicitacaoLocacao) => void;
    onDevolver: (locacao: SolicitacaoLocacao) => void;
    onDetalhes: (locacao: SolicitacaoLocacao) => void;
}

// FIX: Changed component definition to use React.FC to resolve issue with 'key' prop typing.
const LocacaoCard: React.FC<LocacaoCardProps> = ({ locacao, onRenovar, onDevolver, onDetalhes }) => {
    const statusInfo = getStatusLocacao(locacao);
    const isAtiva = !locacao.dataDevolucaoReal;

    const handleContatar = () => {
        const assunto = encodeURIComponent(`Locação de ${locacao.titulo} - ${locacao.obraSetor}`);
        const corpo = encodeURIComponent(`
Olá,
Referente à locação:
- Equipamento: ${locacao.titulo}
- Obra: ${locacao.obraSetor}
- Data de início: ${format(new Date(locacao.dataInicio), 'dd/MM/yyyy')}
- Data de devolução prevista: ${format(new Date(locacao.dataDevolucaoPrevista), 'dd/MM/yyyy')}
- Status: ${statusInfo.status}
        `);
        window.location.href = `mailto:${locacao.solicitante}?subject=${assunto}&body=${corpo}`;
    };

    return (
        <Card className="p-4 flex flex-col justify-between h-full border-l-4" style={{ borderLeftColor: statusInfo.borderColor }}>
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-slate-900">{locacao.titulo}</h3>
                        <p className="text-xs text-slate-500">{locacao.id} • {locacao.obraSetor}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.cor} ${statusInfo.textoCor}`}>
                        {statusInfo.status}
                    </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{locacao.quantidade} unidade(s) • Solicitante: {locacao.solicitante}</p>
                
                <div className="text-sm space-y-2 mb-3">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Início:</span>
                        <span className="font-medium text-slate-800">{format(new Date(locacao.dataInicio), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Devolução Prevista:</span>
                        <span className="font-medium text-slate-800">{format(new Date(locacao.dataDevolucaoPrevista), 'dd/MM/yyyy')}</span>
                    </div>
                </div>

                <div className={`p-2 rounded text-center text-sm font-medium ${statusInfo.cor} ${statusInfo.textoCor}`}>
                    {statusInfo.diasInfo}
                </div>
            </div>

            <div className="mt-4 pt-3 border-t flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onDetalhes(locacao)} className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Detalhes
                </Button>
                {isAtiva ? (
                    <>
                        <Button variant="outline" size="sm" onClick={() => onRenovar(locacao)}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => onDevolver(locacao)}>
                            Devolver
                        </Button>
                    </>
                ) : (
                    <Button variant="outline" size="sm" onClick={handleContatar} className="flex-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Contatar
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default LocacaoCard;