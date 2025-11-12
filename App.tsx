import React, { useState, useMemo, useEffect } from 'react';
import { Solicitacao, TipoSolicitacao, StatusAprovacao, SolicitacaoLocacao, SolicitacaoServico, SolicitacaoCompra, StatusLocacao, StatusServico, User } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PainelLocacoesServicos from './components/PainelLocacoesServicos';
import NovaSolicitacao from './components/NovaSolicitacao';
import GerenciarSolicitacoes from './components/GerenciarSolicitacoes';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel'; // Import AdminPanel
import { getStatusLocacao, getStatusServico } from './utils/statusCalculations';
import { format, subDays, addDays } from './utils/dateUtils';

type Page = 'dashboard' | 'painel' | 'nova-solicitacao' | 'gerenciar-solicitacoes' | 'admin-panel';

const ADMIN_EMAIL = 'suprimentos.douglas@ecbiesek.com';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
      {
        id: 'admin-initial-001',
        fullName: 'Douglas Oliveira',
        email: ADMIN_EMAIL,
        role: 'admin',
      }
  ]);

  const handleLogin = (email: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = users.find(u => u.email === normalizedEmail);
    if (existingUser) {
        setCurrentUser(existingUser);
    } else {
        return "Usuário não encontrado. Por favor, cadastre-se.";
    }
    return null;
  };

  const handleRegister = (newUser: { name: string; email: string }) => {
    const normalizedEmail = newUser.email.toLowerCase().trim();
    const existingUser = users.find(u => u.email === normalizedEmail);

    if (existingUser) {
      return "Este e-mail já está cadastrado. Por favor, faça o login.";
    }

    const isAdmin = normalizedEmail === ADMIN_EMAIL;
    const user: User = {
        id: `user-${Date.now()}`,
        fullName: newUser.name,
        email: normalizedEmail,
        role: isAdmin ? 'admin' : 'user',
    };
    setUsers(prev => [...prev, user]);
    setCurrentUser(user);
    return null;
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setPage('dashboard'); // Reset page on logout
  };

  const addSolicitacao = (novaSolicitacao: Omit<Solicitacao, 'id' | 'dataCriacao' | 'statusAprovacao'>) => {
      const newId = `${novaSolicitacao.tipo.substring(0,3).toUpperCase()}-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`;
      const solicitacaoCompleta: Solicitacao = {
          ...novaSolicitacao,
          id: newId,
          dataCriacao: new Date(),
          statusAprovacao: StatusAprovacao.PENDENTE,
      } as Solicitacao;
      setSolicitacoes(prev => [solicitacaoCompleta, ...prev]);
      setPage('dashboard');
  };
  
  const updateStatusAprovacao = (id: string, status: StatusAprovacao, motivo?: string) => {
      setSolicitacoes(prev => prev.map(s => {
          if (s.id === id) {
              return { ...s, statusAprovacao: status, motivoReprovacao: motivo };
          }
          return s;
      }));
  };

  const updateSolicitacao = (id: string, updatedData: Partial<Solicitacao>) => {
    setSolicitacoes(prev => prev.map(s => {
      if (s.id === id) {
        // FIX: Cast the updated object to Solicitacao to resolve discriminated union type issue.
        return { ...s, ...updatedData } as Solicitacao;
      }
      return s;
    }));
  };

  const deleteSolicitacao = (id: string) => {
    setSolicitacoes(prev => prev.filter(s => s.id !== id));
  };

  const resetarSolicitacoes = () => {
    setSolicitacoes([]);
  };

  const handleRenovarLocacao = (id: string, novaData: Date, motivo: string) => {
    setSolicitacoes(prev => prev.map(s => {
      if (s.id === id && s.tipo === TipoSolicitacao.LOCACAO) {
        const loc = s as SolicitacaoLocacao;
        const dataFormatada = format(loc.dataDevolucaoPrevista, 'dd/MM/yyyy');
        const novoHistorico = `${format(new Date(), 'dd/MM/yyyy HH:mm')} - Data anterior: ${dataFormatada} | Nova data: ${format(novaData, 'dd/MM/yyyy')} | Motivo: ${motivo}`;
        return {
          ...loc,
          dataDevolucaoPrevista: novaData,
          historicoRenovacoes: loc.historicoRenovacoes ? `${loc.historicoRenovacoes}\n${novoHistorico}` : novoHistorico
        };
      }
      return s;
    }));
  };

  const handleMarcarComoDevolvido = (id: string, dataDevolucao: Date, observacoes: string) => {
    setSolicitacoes(prev => prev.map(s => {
      if (s.id === id && s.tipo === TipoSolicitacao.LOCACAO) {
        const loc = s as SolicitacaoLocacao;
        const obs = `\n\nDevolvido em ${format(dataDevolucao, 'dd/MM/yyyy')}: ${observacoes}`;
        return { 
            ...loc, 
            dataDevolucaoReal: dataDevolucao,
            observacoes: (loc.observacoes || '') + obs
        };
      }
      return s;
    }));
  };

  const handleConcluirServico = (id: string) => {
     setSolicitacoes(prev => prev.map(s => {
      if (s.id === id && s.tipo === TipoSolicitacao.SERVICO) {
        return { ...s, dataConclusaoReal: new Date() };
      }
      return s;
    }));
  }

  const updateUserRole = (userId: string, role: 'admin' | 'user') => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role } : u)));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };
  
  const solicitacoesExibidas = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') {
      return solicitacoes;
    }
    return solicitacoes.filter(s => 
      s.solicitante.toLowerCase().trim() === currentUser.fullName.toLowerCase().trim()
    );
  }, [solicitacoes, currentUser]);


  const stats = useMemo(() => {
    const locacoes = solicitacoesExibidas.filter(s => s.tipo === TipoSolicitacao.LOCACAO && s.statusAprovacao === StatusAprovacao.APROVADA) as SolicitacaoLocacao[];
    const servicos = solicitacoesExibidas.filter(s => s.tipo === TipoSolicitacao.SERVICO && s.statusAprovacao === StatusAprovacao.APROVADA) as SolicitacaoServico[];

    const locacoesVencidas = locacoes.filter(s => getStatusLocacao(s).status === StatusLocacao.VENCIDA).length;
    const locacoesProximas = locacoes.filter(s => getStatusLocacao(s).status === StatusLocacao.PROXIMA_VENCIMENTO).length;
    const servicosEmAndamento = servicos.filter(s => getStatusServico(s).status === StatusServico.EM_ANDAMENTO).length;
    const solicitacoesPendentes = solicitacoesExibidas.filter(s => s.statusAprovacao === StatusAprovacao.PENDENTE || s.statusAprovacao === StatusAprovacao.EM_ANALISE).length;
    const totalSolicitacoes = solicitacoesExibidas.length;
    const totalAtivas = solicitacoesExibidas.filter(s => {
        if (s.statusAprovacao !== StatusAprovacao.APROVADA) return false;
        if (s.tipo === TipoSolicitacao.LOCACAO) {
            return !s.dataDevolucaoReal;
        }
        if (s.tipo === TipoSolicitacao.SERVICO) {
            return getStatusServico(s).status !== StatusServico.CONCLUIDO;
        }
        return false;
    }).length;

    return {
        locacoesVencidas,
        locacoesProximas,
        servicosEmAndamento,
        solicitacoesPendentes,
        totalSolicitacoes,
        criticasTotal: locacoesVencidas + locacoesProximas,
        totalAtivas
    };
  }, [solicitacoesExibidas]);

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  }
  
  const isAdmin = currentUser.role === 'admin';

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard solicitacoes={solicitacoesExibidas} setPage={setPage} stats={stats} isAdmin={isAdmin} />;
      case 'painel':
        if (!isAdmin) {
            return <Dashboard solicitacoes={solicitacoesExibidas} setPage={setPage} stats={stats} isAdmin={isAdmin} />;
        }
        return <PainelLocacoesServicos 
                    solicitacoes={solicitacoesExibidas} 
                    onRenovar={handleRenovarLocacao} 
                    onDevolver={handleMarcarComoDevolvido} 
                    onConcluirServico={handleConcluirServico}
                    onUpdateSolicitacao={updateSolicitacao}
                    currentUser={currentUser}
                />;
      case 'nova-solicitacao':
        return <NovaSolicitacao addSolicitacao={addSolicitacao} setPage={setPage} currentUser={currentUser} />;
      case 'gerenciar-solicitacoes':
        if (!isAdmin) {
            // Redirect non-admins to the dashboard
            return <Dashboard solicitacoes={solicitacoesExibidas} setPage={setPage} stats={stats} isAdmin={isAdmin} />;
        }
        return <GerenciarSolicitacoes 
                    solicitacoes={solicitacoesExibidas} 
                    updateStatus={updateStatusAprovacao} 
                    onUpdateSolicitacao={updateSolicitacao} 
                    isAdmin={isAdmin}
                    onDeleteSolicitacao={deleteSolicitacao}
                    onResetarSolicitacoes={resetarSolicitacoes}
                />;
      case 'admin-panel':
        if (!isAdmin) {
          return <Dashboard solicitacoes={solicitacoesExibidas} setPage={setPage} stats={stats} isAdmin={isAdmin} />;
        }
        return <AdminPanel 
                  users={users} 
                  currentUser={currentUser}
                  onUpdateUserRole={updateUserRole}
                  onDeleteUser={deleteUser}
               />;
      default:
        return <Dashboard solicitacoes={solicitacoesExibidas} setPage={setPage} stats={stats} isAdmin={isAdmin} />;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800">
        <Sidebar 
          currentPage={page} 
          setPage={setPage} 
          stats={stats}
          user={currentUser}
          onLogout={handleLogout}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}