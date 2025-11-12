

import React from 'react';
import { SolicitacaoServico } from '../../types';
import { getStatusServico, formatCurrency } from '../../utils/statusCalculations';
import { format } from '../../utils/dateUtils';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Mail, CheckCircle, FileText } from '../icons';

interface ServicoCardProps {
    servico: SolicitacaoServico;
    onConcluir: (id: string) => void;
    onDetalhes: (servico: SolicitacaoServico) => void;
}

// FIX: Changed component definition to use React.FC to resolve issue with 'key' prop typing.
const ServicoCard: React.FC<ServicoCardProps> = ({ servico, onConcluir, onDetalhes }) => {
    const statusInfo = getStatusServico(servico);
    const isAtivo = !servico.dataConclusaoReal;

    const handleContatar = () => {
        const assunto = encodeURIComponent(`Serviço: ${servico.titulo} - ${servico.obraSetor}`);
        const corpo = encodeURIComponent(`
Olá ${servico.fornecedorNome},
Referente ao serviço:
- Descrição: ${servico.titulo}
- Obra: ${servico.obraSetor}
- Data de início: ${format(new Date(servico.dataInicio), 'dd/MM/yyyy')}
- Data de término: ${format(new Date(servico.dataFinal), 'dd/MM/yyyy')}
- Valor: ${formatCurrency(servico.valor)}
- Status: ${statusInfo.status}
        `);
        window.location.href = `mailto:${servico.solicitante}?subject=${assunto}&body=${corpo}`;
    };

    return (
        <Card className="p-4 flex flex-col justify-between h-full border-l-4" style={{ borderLeftColor: statusInfo.borderColor }}>
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-slate-900">{servico.titulo}</h3>
                        <p className="text-xs text-slate-500">{servico.id} • {servico.obraSetor}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.cor} ${statusInfo.textoCor}`}>
                        {statusInfo.status}
                    </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{servico.fornecedorNome} • {formatCurrency(servico.valor)}</p>
                
                <div className="text-sm space-y-2 mb-3">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Início:</span>
                        <span className="font-medium text-slate-800">{format(new Date(servico.dataInicio), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Término Previsto:</span>
                        <span className="font-medium text-slate-800">{format(new Date(servico.dataFinal), 'dd/MM/yyyy')}</span>
                    </div>
                </div>

                <div className={`p-2 rounded text-center text-sm font-medium ${statusInfo.cor} ${statusInfo.textoCor}`}>
                    {statusInfo.diasInfo}
                </div>
            </div>

            <div className="mt-4 pt-3 border-t flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onDetalhes(servico)} className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Detalhes
                </Button>
                {isAtivo && statusInfo.status === 'Em Andamento' ? (
                     <Button variant="primary" size="sm" onClick={() => onConcluir(servico.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Concluir
                    </Button>
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

export default ServicoCard;