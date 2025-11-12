import React, { useMemo, useState } from 'react';
import { Solicitacao, StatusAprovacao, TipoSolicitacao, SolicitacaoCompra, SolicitacaoLocacao, SolicitacaoServico } from '../types';
import { format } from '../utils/dateUtils';
import { formatCurrency } from '../utils/statusCalculations';
import EditarCompraModal from './compra/EditarCompraModal';
import { Edit, Trash2, FileText } from './icons';
import ReprovarModal from './ReprovarModal';
import ConfirmModal from './ConfirmModal';

const getStatusStyles = (status: StatusAprovacao) => {
    switch (status) {
        case StatusAprovacao.APROVADA:
            return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
        case StatusAprovacao.REPROVADA:
            return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
        case StatusAprovacao.EM_ANALISE:
            return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
        case StatusAprovacao.PENDENTE:
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
    }
};

interface SolicitacaoGerenciaCardProps {
    solicitacao: Solicitacao;
    onUpdateStatus: (id: string, status: StatusAprovacao, motivo?: string) => void;
    onEdit: (solicitacao: SolicitacaoCompra) => void;
    onReprovar: (solicitacao: Solicitacao) => void;
    onDelete: (solicitacao: Solicitacao) => void;
    isAdmin: boolean;
}

// FIX: Changed component definition to use React.FC to resolve issue with 'key' prop typing.
const SolicitacaoGerenciaCard: React.FC<SolicitacaoGerenciaCardProps> = ({ solicitacao, onUpdateStatus, onEdit, onReprovar, onDelete, isAdmin }) => {
    const styles = getStatusStyles(solicitacao.statusAprovacao);

    const renderValor = () => {
        switch (solicitacao.tipo) {
            case TipoSolicitacao.SERVICO:
                return formatCurrency((solicitacao as SolicitacaoServico).valor);
            case TipoSolicitacao.COMPRA:
            case TipoSolicitacao.LOCACAO:
                return 'N/A';
        }
    };

    const renderDetails = () => {
        switch(solicitacao.tipo) {
            case TipoSolicitacao.COMPRA:
                const s = solicitacao as SolicitacaoCompra;
                return (
                    <>
                        <div><p className="text-gray-500">Prioridade</p><p className="font-semibold text-gray-700 capitalize">{s.prioridade}</p></div>
                        <div><p className="text-gray-500">Prazo Necessário</p><p className="font-semibold text-gray-700">{format(s.prazoNecessario, 'dd/MM/yyyy')}</p></div>
                        {s.fornecedorSugerido && <div><p className="text-gray-500">Fornecedor Sugerido</p><p className="font-semibold text-gray-700">{s.fornecedorSugerido}</p></div>}
                    </>
                );
            case TipoSolicitacao.LOCACAO:
                const l = solicitacao as SolicitacaoLocacao;
                return (
                    <>
                         <div><p className="text-gray-500">Período</p><p className="font-semibold text-gray-700">{format(l.dataInicio, 'dd/MM/yy')} - {format(l.dataDevolucaoPrevista, 'dd/MM/yy')}</p></div>
                         <div><p className="text-gray-500">Quantidade</p><p className="font-semibold text-gray-700">{l.quantidade}</p></div>
                         <div><p className="text-gray-500">Prioridade</p><p className="font-semibold text-gray-700 capitalize">{l.prioridade}</p></div>
                    </>
                );
            case TipoSolicitacao.SERVICO:
                const serv = solicitacao as SolicitacaoServico;
                 return (
                    <>
                         <div><p className="text-gray-500">Período</p><p className="font-semibold text-gray-700">{format(serv.dataInicio, 'dd/MM/yy')} - {format(serv.dataFinal, 'dd/MM/yy')}</p></div>
                         <div><p className="text-gray-500">Fornecedor</p><p className="font-semibold text-gray-700">{serv.fornecedorNome}</p></div>
                         <div><p className="text-gray-500">Prioridade</p><p className="font-semibold text-gray-700 capitalize">{serv.prioridade}</p></div>
                    </>
                );
        }
    }

    return (
        <div className={`bg-white p-5 rounded-lg border ${styles.border} shadow-sm`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <span className="font-bold text-gray-800 text-lg">{solicitacao.id}</span>
                    <p className="text-sm text-gray-500">{solicitacao.tipo} - {solicitacao.obraSetor}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles.bg} ${styles.text}`}>
                    {solicitacao.statusAprovacao}
                </span>
            </div>

            <p className="text-gray-800 font-medium mb-3">{solicitacao.titulo}</p>
            <p className="text-sm text-gray-600 mb-4">{solicitacao.descricao}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 pb-4 border-b">
                <div>
                    <p className="text-gray-500">Solicitante</p>
                    <p className="font-semibold text-gray-700">{solicitacao.solicitante}</p>
                </div>
                <div>
                    <p className="text-gray-500">Data Criação</p>
                    <p className="font-semibold text-gray-700">{format(solicitacao.dataCriacao, 'dd/MM/yyyy')}</p>
                </div>
                <div>
                    <p className="text-gray-500">Valor Total</p>
                    <p className="font-semibold text-green-700">{renderValor()}</p>
                </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-md mb-4 space-y-3">
                 <h4 className="font-semibold text-gray-700 text-sm">Resumo para Análise</h4>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {renderDetails()}
                 </div>
            </div>


            {solicitacao.statusAprovacao === StatusAprovacao.REPROVADA && solicitacao.motivoReprovacao && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                    <strong>Motivo da Reprovação:</strong> {solicitacao.motivoReprovacao}
                </div>
            )}
            
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {isAdmin && solicitacao.statusAprovacao !== StatusAprovacao.APROVADA && solicitacao.statusAprovacao !== StatusAprovacao.REPROVADA && (
                        <>
                            <button onClick={() => onUpdateStatus(solicitacao.id, StatusAprovacao.APROVADA)} className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Aprovar</button>
                            <button onClick={() => onReprovar(solicitacao)} className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Reprovar</button>
                            {solicitacao.statusAprovacao === StatusAprovacao.PENDENTE && (
                                <button onClick={() => onUpdateStatus(solicitacao.id, StatusAprovacao.EM_ANALISE)} className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">Analisar</button>
                            )}
                        </>
                    )}
                    {isAdmin && solicitacao.tipo === TipoSolicitacao.COMPRA && (
                        <button onClick={() => onEdit(solicitacao as SolicitacaoCompra)} className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-1">
                            <Edit className="w-3 h-3"/>
                            Editar
                        </button>
                    )}
                </div>
                <div>
                    {isAdmin && (
                        <button onClick={() => onDelete(solicitacao)} className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 flex items-center gap-1">
                            <Trash2 className="w-3 h-3"/>
                            Excluir
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

interface GerenciarSolicitacoesProps {
    solicitacoes: Solicitacao[];
    updateStatus: (id: string, status: StatusAprovacao, motivo?: string) => void;
    onUpdateSolicitacao: (id: string, updatedData: Partial<Solicitacao>) => void;
    onDeleteSolicitacao: (id: string) => void;
    onResetarSolicitacoes: () => void;
    isAdmin: boolean;
}


export default function GerenciarSolicitacoes({ solicitacoes, updateStatus, onUpdateSolicitacao, isAdmin, onDeleteSolicitacao, onResetarSolicitacoes }: GerenciarSolicitacoesProps) {
    const [filter, setFilter] = useState<StatusAprovacao | 'todos'>('todos');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [solicitacaoParaEditar, setSolicitacaoParaEditar] = useState<SolicitacaoCompra | null>(null);
    const [isReprovarModalOpen, setIsReprovarModalOpen] = useState(false);
    const [solicitacaoParaReprovar, setSolicitacaoParaReprovar] = useState<Solicitacao | null>(null);
    const [solicitacaoParaExcluir, setSolicitacaoParaExcluir] = useState<Solicitacao | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

    const handleOpenEditModal = (solicitacao: SolicitacaoCompra) => {
        setSolicitacaoParaEditar(solicitacao);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSolicitacaoParaEditar(null);
    };
    
    const handleOpenReprovarModal = (solicitacao: Solicitacao) => {
        setSolicitacaoParaReprovar(solicitacao);
        setIsReprovarModalOpen(true);
    };

    const handleCloseReprovarModal = () => {
        setIsReprovarModalOpen(false);
        setSolicitacaoParaReprovar(null);
    };
    
    const handleOpenDeleteModal = (solicitacao: Solicitacao) => {
        setSolicitacaoParaExcluir(solicitacao);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (solicitacaoParaExcluir) {
            onDeleteSolicitacao(solicitacaoParaExcluir.id);
            setIsDeleteConfirmOpen(false);
            setSolicitacaoParaExcluir(null);
        }
    };
    
    const handleConfirmReset = () => {
        onResetarSolicitacoes();
        setIsResetConfirmOpen(false);
    };

    const handleSaveChanges = (id: string, updatedData: Partial<SolicitacaoCompra>) => {
        onUpdateSolicitacao(id, updatedData);
    };

    const filteredSolicitacoes = useMemo(() => {
        if (filter === 'todos') {
            return solicitacoes;
        }
        return solicitacoes.filter(s => s.statusAprovacao === filter);
    }, [solicitacoes, filter]);

    const TABS: { id: StatusAprovacao | 'todos', label: string }[] = [
        { id: 'todos', label: 'Todas' },
        { id: StatusAprovacao.PENDENTE, label: 'Pendentes' },
        { id: StatusAprovacao.EM_ANALISE, label: 'Em Análise' },
        { id: StatusAprovacao.APROVADA, label: 'Aprovadas' },
        { id: StatusAprovacao.REPROVADA, label: 'Reprovadas' },
    ];

    return (
        <div className="p-4 md:p-8 space-y-6 bg-gray-100 min-h-full">
             <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Gerenciar Solicitações</h1>
                    <p className="text-gray-500">Aprove, reprove ou analise as solicitações pendentes.</p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => setIsResetConfirmOpen(true)} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                        Zerar Banco de Dados
                    </button>
                )}
            </header>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`${
                                filter === tab.id
                                    ? 'border-sky-500 text-sky-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="space-y-4">
                {filteredSolicitacoes.length > 0 ? (
                    filteredSolicitacoes.map(s => <SolicitacaoGerenciaCard key={s.id} solicitacao={s} onUpdateStatus={updateStatus} onEdit={handleOpenEditModal} onReprovar={handleOpenReprovarModal} onDelete={handleOpenDeleteModal} isAdmin={isAdmin} />)
                ) : (
                     <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                        <p className="text-gray-500">Nenhuma solicitação encontrada para este filtro.</p>
                    </div>
                )}
            </div>

            <EditarCompraModal
                solicitacao={solicitacaoParaEditar}
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSaveChanges}
            />
            <ReprovarModal
                solicitacao={solicitacaoParaReprovar}
                open={isReprovarModalOpen}
                onClose={handleCloseReprovarModal}
                onConfirm={updateStatus}
            />
            <ConfirmModal
                open={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                description={`Tem certeza que deseja excluir permanentemente a solicitação ${solicitacaoParaExcluir?.id}? Esta ação não pode ser desfeita.`}
                confirmButtonText="Excluir"
                isDestructive
            />
             <ConfirmModal
                open={isResetConfirmOpen}
                onClose={() => setIsResetConfirmOpen(false)}
                onConfirm={handleConfirmReset}
                title="Zerar Banco de Dados"
                description="Tem certeza que deseja excluir TODAS as solicitações? Esta é uma ação irreversível e limpará todos os registros existentes no sistema."
                confirmButtonText="Sim, Zerar Tudo"
                isDestructive
            />
        </div>
    );
}