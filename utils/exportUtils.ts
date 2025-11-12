import { Solicitacao, TipoSolicitacao, SolicitacaoLocacao, SolicitacaoServico, SolicitacaoCompra } from '../types';
import { format } from './dateUtils';
import { getStatusLocacao, getStatusServico, formatCurrency } from './statusCalculations';

export const exportToCsv = (data: Solicitacao[], filename: string = 'relatorio_solicitacoes.csv') => {
    const header = [
        'ID', 'Tipo', 'Título', 'Solicitante', 'Obra/Setor', 'Fornecedor', 'Valor Total',
        'Data Início', 'Data Final/Devolução', 'Status', 'Dias Restantes/Atraso'
    ];

    const rows = data.map(s => {
        const row: (string | number | undefined)[] = [
            s.id, s.tipo, s.titulo, s.solicitante, s.obraSetor
        ];

        let fornecedor = '';
        let valor = '';
        let dataInicio = '';
        let dataFinal = '';
        let status = '';
        let dias = '';

        if (s.tipo === TipoSolicitacao.LOCACAO) {
            const loc = s as SolicitacaoLocacao;
            const statusInfo = getStatusLocacao(loc);
            dataInicio = format(loc.dataInicio, 'dd/MM/yyyy');
            dataFinal = format(loc.dataDevolucaoPrevista, 'dd/MM/yyyy');
            status = statusInfo.status;
            dias = statusInfo.dias !== undefined ? statusInfo.dias.toString() : '';
            valor = 'N/A';
            fornecedor = 'N/A';
        } else if (s.tipo === TipoSolicitacao.SERVICO) {
            const serv = s as SolicitacaoServico;
            const statusInfo = getStatusServico(serv);
            fornecedor = serv.fornecedorNome;
            valor = formatCurrency(serv.valor);
            dataInicio = format(serv.dataInicio, 'dd/MM/yyyy');
            dataFinal = format(serv.dataFinal, 'dd/MM/yyyy');
            status = statusInfo.status;
        } else if (s.tipo === TipoSolicitacao.COMPRA) {
            valor = 'N/A';
            status = 'N/A';
        }
        
        row.push(fornecedor, valor, dataInicio, dataFinal, status, dias);
        return row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [header.join(','), ...rows].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};