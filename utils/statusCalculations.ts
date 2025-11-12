import { SolicitacaoLocacao, SolicitacaoServico, StatusLocacao, StatusServico, StatusInfo } from '../types';
import { differenceInDays, isBefore, isAfter, format } from './dateUtils';

export const formatCurrency = (value: number | undefined | null): string => {
    if (typeof value !== 'number') {
        return 'N/A';
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const calcularDuracao = (dataInicio?: Date, dataFinal?: Date): string => {
  if (!dataInicio || !dataFinal) return 'N/A';
  try {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFinal);
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) return 'N/A';
    
    const dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    if (dias < 0) return 'N/A';
    if (dias > 30) {
      const meses = Math.floor(dias / 30);
      const diasRestantes = dias % 30;
      return diasRestantes > 0 ? `${meses} meses e ${diasRestantes} dias` : `${meses} meses`;
    }
    return `${dias} dias`;
  } catch (e) {
    return 'N/A';
  }
};


export const calcularDiasRestantesOuAtraso = (dataFinal: Date, dataReal: Date | null | undefined = null): number | null => {
    if (dataReal || !dataFinal) return null;
    try {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const final = new Date(dataFinal);
        if (isNaN(final.getTime())) return null;
        final.setHours(0, 0, 0, 0);
        return Math.ceil((final.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    } catch (e) {
        return null;
    }
};


export const getStatusLocacao = (locacao: SolicitacaoLocacao): StatusInfo => {
    if (locacao.dataDevolucaoReal) {
        return { 
            status: StatusLocacao.DEVOLVIDO, 
            cor: 'bg-gray-100 border-gray-300', 
            textoCor: 'text-gray-700',
            borderColor: '#6b7280',
            diasInfo: `Devolvido em ${format(locacao.dataDevolucaoReal, 'dd/MM/yyyy')}`
        };
    }
    
    const dias = calcularDiasRestantesOuAtraso(locacao.dataDevolucaoPrevista);

    if (dias === null) {
         return { status: StatusLocacao.DENTRO_PRAZO, cor: 'bg-gray-100', textoCor: 'text-gray-700', borderColor: '#6b7280', diasInfo: 'Data inválida' };
    }

    if (dias < 0) {
        return { 
            status: StatusLocacao.VENCIDA, 
            cor: 'bg-red-100 border-red-300', 
            textoCor: 'text-red-700',
            borderColor: '#ef4444',
            dias: Math.abs(dias),
            diasInfo: `Vencido há ${Math.abs(dias)} dias`
        };
    }
    if (dias <= 7) {
        return { 
            status: StatusLocacao.PROXIMA_VENCIMENTO, 
            cor: 'bg-yellow-100 border-yellow-300', 
            textoCor: 'text-yellow-700',
            borderColor: '#f59e0b',
            dias: dias,
            diasInfo: dias > 0 ? `Vence em ${dias} dias` : 'Vence hoje'
        };
    }
    return { 
        status: StatusLocacao.DENTRO_PRAZO, 
        cor: 'bg-green-100 border-green-300', 
        textoCor: 'text-green-700',
        borderColor: '#22c55e',
        dias: dias,
        diasInfo: `Restam ${dias} dias`
    };
};

export const getStatusServico = (servico: SolicitacaoServico): StatusInfo => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataInicio = new Date(servico.dataInicio);
    dataInicio.setHours(0, 0, 0, 0);
    
    const dataFinal = new Date(servico.dataFinal);
    dataFinal.setHours(0, 0, 0, 0);

    const diasParaIniciar = differenceInDays(dataInicio, hoje);
    const diasParaFinalizar = differenceInDays(dataFinal, hoje);

    if (servico.dataConclusaoReal || isAfter(hoje, dataFinal)) {
        const info = servico.dataConclusaoReal 
            ? `Concluído em ${format(servico.dataConclusaoReal, 'dd/MM/yyyy')}` 
            : "Serviço finalizado";
        return { 
            status: StatusServico.CONCLUIDO, 
            cor: 'bg-blue-100 border-blue-300', 
            textoCor: 'text-blue-700',
            borderColor: '#3b82f6',
            diasInfo: info
        };
    }

    if (isBefore(hoje, dataInicio)) {
        return { 
            status: StatusServico.A_INICIAR, 
            cor: 'bg-green-100 border-green-300', 
            textoCor: 'text-green-700',
            borderColor: '#22c55e',
            dias: diasParaIniciar,
            diasInfo: `Inicia em ${diasParaIniciar} dias`
        };
    }

    // Em Andamento
    return { 
        status: StatusServico.EM_ANDAMENTO, 
        cor: 'bg-yellow-100 border-yellow-300', 
        textoCor: 'text-yellow-700',
        borderColor: '#eab308',
        dias: diasParaFinalizar,
        diasInfo: diasParaFinalizar > 0 ? `Faltam ${diasParaFinalizar} dias` : 'Termina hoje'
    };
};