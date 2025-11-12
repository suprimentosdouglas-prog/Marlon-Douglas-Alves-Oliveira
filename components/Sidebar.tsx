

import React from 'react';
import { User } from '../types';
import { Shield } from './icons';

const LayoutDashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M5 18H3c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v11" /><path d="M14 9h4l4 4v4h-2" /><circle cx="7" cy="18" r="2" /><path d="M15 18H9" /><circle cx="17" cy="18" r="2" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>;
const UserIcon = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;


interface SidebarProps {
    currentPage: string;
    setPage: (page: 'dashboard' | 'painel' | 'nova-solicitacao' | 'gerenciar-solicitacoes' | 'admin-panel') => void;
    stats: {
      locacoesVencidas: number;
      criticasTotal: number;
      solicitacoesPendentes: number;
      totalSolicitacoes: number;
      servicosEmAndamento: number;
    },
    user: User;
    onLogout: () => void;
}

export default function Sidebar({ currentPage, setPage, stats, user, onLogout }: SidebarProps) {
    const isAdmin = user.role === 'admin';

    const navItems = [
      { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
      { page: 'painel', label: 'Painel de Loc/Serv', icon: TruckIcon, badge: stats.criticasTotal, badgeColor: stats.locacoesVencidas > 0 ? 'bg-red-600 text-white' : 'bg-amber-500 text-white', adminOnly: true },
      { page: 'nova-solicitacao', label: 'Nova Solicitação', icon: PlusIcon },
      { page: 'gerenciar-solicitacoes', label: 'Gerenciar Solic.', icon: SettingsIcon, adminOnly: true, badge: stats.solicitacoesPendentes, badgeColor: 'bg-emerald-600 text-white' },
      { page: 'admin-panel', label: 'Painel Admin', icon: Shield, adminOnly: true }
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
            <header className="h-20 flex items-center gap-3 px-6 border-b border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ShoppingCartIcon />
                </div>
                <div>
                    <h1 className="font-bold text-slate-900">Gestão de Obras</h1>
                    <p className="text-xs text-slate-500">Solicitações</p>
                </div>
            </header>
            
            <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-6">
                <nav>
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                        Menu Principal
                    </h2>
                    <ul className="space-y-1">
                        {navItems.map(item => {
                            if (item.adminOnly && !isAdmin) return null;
                            const isActive = currentPage === item.page;
                            return (
                                <li key={item.page}>
                                    <button 
                                        type="button" 
                                        onClick={() => setPage(item.page as any)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors duration-200 ${
                                            isActive 
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                                        }`}
                                    >
                                        <item.icon />
                                        <span>{item.label}</span>
                                        {item.badge != null && item.badge > 0 && (
                                            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div>
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                        Resumo Rápido
                    </h2>
                    <div className="space-y-2 px-1">
                        <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                           <span className="text-sm text-slate-600">Total</span>
                           <span className="font-bold text-slate-900">{stats.totalSolicitacoes}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                           <span className="text-sm text-amber-700">Aguardando</span>
                           <span className="font-bold text-amber-700">{stats.solicitacoesPendentes}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                           <span className="text-sm text-blue-700">Serviços Ativos</span>
                           <span className="font-bold text-blue-700">{stats.servicosEmAndamento}</span>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="p-4 border-t border-slate-200">
                 <div className="flex items-center gap-3">
                    {user.avatar ? (
                        <img src={user.avatar} alt="User avatar" className="w-9 h-9 rounded-full" />
                    ) : (
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            isAdmin ? 'bg-gradient-to-br from-emerald-400 to-emerald-500' : 'bg-gradient-to-br from-slate-200 to-slate-300'
                        }`}>
                            <UserIcon className={`w-5 h-5 ${isAdmin ? 'text-white' : 'text-slate-600'}`} />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">{user.fullName}</p>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            {isAdmin && (
                                <span className="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-medium rounded-md">
                                    Admin
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-200 text-slate-600 hover:bg-red-50 hover:text-red-700 font-medium"
                >
                    <LogOutIcon />
                    <span>Sair da Conta</span>
                </button>
            </footer>
        </aside>
    );
}