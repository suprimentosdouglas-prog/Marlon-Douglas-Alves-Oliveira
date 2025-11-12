
import React from 'react';
import { Solicitacao, TipoSolicitacao, SolicitacaoLocacao, SolicitacaoServico } from '../types';
import { getStatusLocacao, getStatusServico } from '../utils/statusCalculations';
import { format } from '../utils/dateUtils';

const TruckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ExclamationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
);

interface DashboardProps {
    solicitacoes: Solicitacao[];
    setPage: (page: 'dashboard' | 'painel' | 'nova-solicitacao' | 'gerenciar-solicitacoes') => void;
    stats: {
        locacoesVencidas: number;
        servicosEmAndamento: number;
        totalAtivas: number;
    };
    isAdmin: boolean;
}

const StatCard = ({ title, value, icon, color, onClick }: { title: string, value: number, icon: React.ReactNode, color: string, onClick?: () => void }) => (
    <div className={`p-6 rounded-xl shadow-md flex items-center justify-between ${color} ${onClick ? 'cursor-pointer hover:opacity-90' : ''}`} onClick={onClick}>
        <div>
            <p className="text-sm font-medium text-white opacity-90">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="bg-white/30 p-3 rounded-full">
            {icon}
        </div>
    </div>
);


export default function Dashboard({ solicitacoes, setPage, stats, isAdmin }: DashboardProps) {
    const recentes = solicitacoes.slice(0, 5);

    return (
        <div className="p-8 bg-gray-50">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">Visão geral das suas solicitações.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Locações Vencidas" value={stats.locacoesVencidas} icon={<ExclamationIcon />} color="bg-red-500" onClick={isAdmin ? () => setPage('painel') : undefined} />
                <StatCard title="Serviços em Andamento" value={stats.servicosEmAndamento} icon={<ClockIcon />} color="bg-yellow-500" onClick={isAdmin ? () => setPage('painel') : undefined} />
                <StatCard title="Total Loc/Serv Ativos" value={stats.totalAtivas} icon={<TruckIcon />} color="bg-sky-500" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Solicitações Recentes</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-gray-200">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide">ID</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Tipo</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Descrição</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Solicitante</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentes.map(s => (
                                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-700 font-mono">{s.id}</td>
                                    <td className="p-3 text-sm text-gray-700">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            s.tipo === TipoSolicitacao.COMPRA ? 'bg-indigo-100 text-indigo-700' :
                                            s.tipo === TipoSolicitacao.LOCACAO ? 'bg-green-100 text-green-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>{s.tipo}</span>
                                    </td>
                                    <td className="p-3 text-sm text-gray-700">{s.descricao}</td>
                                    <td className="p-3 text-sm text-gray-700">{s.solicitante}</td>
                                    <td className="p-3 text-sm text-gray-700">{format(s.dataCriacao, 'dd/MM/yyyy')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
