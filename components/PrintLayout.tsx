import React from 'react';
import { Solicitacao, TipoSolicitacao, SolicitacaoCompra, SolicitacaoLocacao, SolicitacaoServico } from '../types';
import { format } from '../utils/dateUtils';
import { formatCurrency } from '../utils/statusCalculations';

interface PrintLayoutProps {
    solicitacao: Solicitacao;
}

const PrintDetail: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <p className="detail-label">{label}</p>
        <p className="detail-value">{children || 'N/A'}</p>
    </div>
);


const PrintLayout: React.FC<PrintLayoutProps> = ({ solicitacao }) => {
    
    const renderSpecificDetails = () => {
        switch (solicitacao.tipo) {
            case TipoSolicitacao.COMPRA:
                const compra = solicitacao as SolicitacaoCompra;
                return (
                    <div className="section">
                        <h3 className="section-title">Detalhes da Compra</h3>
                        <div className="print-grid">
                            <PrintDetail label="Prazo Necessário">{format(compra.prazoNecessario, 'dd/MM/yyyy')}</PrintDetail>
                            {compra.fornecedorSugerido && (
                                <PrintDetail label="Fornecedor Sugerido">{compra.fornecedorSugerido}</PrintDetail>
                            )}
                        </div>
                    </div>
                );
            case TipoSolicitacao.LOCACAO:
                const locacao = solicitacao as SolicitacaoLocacao;
                return (
                     <div className="section">
                        <h3 className="section-title">Detalhes da Locação</h3>
                        <div className="print-grid">
                            <PrintDetail label="Data de Início">{format(locacao.dataInicio, 'dd/MM/yyyy')}</PrintDetail>
                            <PrintDetail label="Data de Devolução">{format(locacao.dataDevolucaoPrevista, 'dd/MM/yyyy')}</PrintDetail>
                            <PrintDetail label="Quantidade">{locacao.quantidade}</PrintDetail>
                        </div>
                    </div>
                );
            case TipoSolicitacao.SERVICO:
                const servico = solicitacao as SolicitacaoServico;
                return (
                    <div className="section">
                        <h3 className="section-title">Detalhes do Serviço</h3>
                        <div className="print-grid">
                            <PrintDetail label="Fornecedor">{servico.fornecedorNome}</PrintDetail>
                            <PrintDetail label="Valor">{formatCurrency(servico.valor)}</PrintDetail>
                            <PrintDetail label="Data de Início">{format(servico.dataInicio, 'dd/MM/yyyy')}</PrintDetail>
                            <PrintDetail label="Data Final">{format(servico.dataFinal, 'dd/MM/yyyy')}</PrintDetail>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div id="print-content">
            <header className="print-header">
                <div>
                    <h1>Solicitação de {solicitacao.tipo}</h1>
                    <p>EC BIESEK CONSTRUÇÕES</p>
                </div>
                <h2>{solicitacao.titulo}</h2>
            </header>
            <main className="print-main">
                 <div className="print-grid">
                    <PrintDetail label="ID da Solicitação">{solicitacao.id}</PrintDetail>
                    <PrintDetail label="Data de Criação">{format(solicitacao.dataCriacao, 'dd/MM/yyyy')}</PrintDetail>
                    <PrintDetail label="Solicitante">{solicitacao.solicitante}</PrintDetail>
                    <PrintDetail label="Obra / Setor">{solicitacao.obraSetor}</PrintDetail>
                </div>
                <div className="detail-group">
                    <PrintDetail label="Descrição">{solicitacao.descricao}</PrintDetail>
                </div>
                {solicitacao.justificativa && (
                     <div className="detail-group">
                        <PrintDetail label="Justificativa">{solicitacao.justificativa}</PrintDetail>
                    </div>
                )}
                {solicitacao.observacoes && (
                     <div className="detail-group">
                        <PrintDetail label="Observações">{solicitacao.observacoes}</PrintDetail>
                    </div>
                )}
                {renderSpecificDetails()}
            </main>
            <footer className="print-footer">
                <p>Documento gerado em {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
            </footer>
        </div>
    );
};

export default PrintLayout;
