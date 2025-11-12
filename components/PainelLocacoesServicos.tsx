import React, { useState, useMemo } from 'react';
import { Solicitacao, TipoSolicitacao, SolicitacaoLocacao, SolicitacaoServico, StatusLocacao, StatusServico, User } from '../types';
import { getStatusLocacao, getStatusServico } from '../utils/statusCalculations';
import { exportToCsv } from '../utils/exportUtils';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';
import LocacaoCard from './locacoes/LocacaoCard';
import ServicoCard from './servicos/ServicoCard';
import RenovarModal from './locacoes/RenovarModal';
import DevolverModal from './locacoes/DevolverModal';
import DetalhesLocacaoModal from './locacoes/DetalhesLocacaoModal';
import DetalhesServicoModal from './servicos/DetalhesServicoModal';
import { Truck, AlertTriangle, CheckCircle, Clock, Search, Download, Building2, Wrench } from './icons';

type Aba = 'locacoes_vencidas' | 'locacoes_proximas' | 'locacoes_prazo' | 'servicos_andamento' | 'servicos_concluidos' | 'locacoes_devolvidas' | 'servicos_iniciar';

interface PainelProps {
    solicitacoes: Solicitacao[];
    onRenovar: (id: string, novaData: Date, motivo: string) => void;
    onDevolver: (id: string, dataDevolucao: Date, observacoes: string) => void;
    onConcluirServico: (id: string) => void;
    onUpdateSolicitacao: (id: string, updatedData: Partial<Solicitacao>) => void;
    currentUser: User;
}

export default function PainelLocacoesServicos({ solicitacoes, onRenovar, onDevolver, onConcluirServico, onUpdateSolicitacao, currentUser }: PainelProps) {
  const [busca, setBusca] = useState("");
  const [filtroObra, setFiltroObra] = useState("todas");
  const [abaAtiva, setAbaAtiva] = useState<Aba>("locacoes_vencidas");
  
  const [itemSelecionado, setItemSelecionado] = useState<SolicitacaoLocacao | SolicitacaoServico | null>(null);
  const [modalRenovar, setModalRenovar] = useState(false);
  const [modalDevolver, setModalDevolver] = useState(false);
  const [modalDetalhesLocacao, setModalDetalhesLocacao] = useState(false);
  const [modalDetalhesServico, setModalDetalhesServico] = useState(false);

  const isAdmin = currentUser.role === 'admin';

  const aprovadas = useMemo(() => solicitacoes.filter(s => s.statusAprovacao === 'Aprovada'), [solicitacoes]);
  const locacoes = useMemo(() => aprovadas.filter(s => s.tipo === TipoSolicitacao.LOCACAO) as SolicitacaoLocacao[], [aprovadas]);
  const servicos = useMemo(() => aprovadas.filter(s => s.tipo === TipoSolicitacao.SERVICO) as SolicitacaoServico[], [aprovadas]);

  const {
      locacoes_vencidas, locacoes_proximas, locacoes_prazo, locacoes_devolvidas,
      servicos_andamento, servicos_concluidos, servicos_iniciar
  } = useMemo(() => {
      const data = {
          locacoes_vencidas: locacoes.filter(l => getStatusLocacao(l).status === StatusLocacao.VENCIDA),
          locacoes_proximas: locacoes.filter(l => getStatusLocacao(l).status === StatusLocacao.PROXIMA_VENCIMENTO),
          locacoes_prazo: locacoes.filter(l => getStatusLocacao(l).status === StatusLocacao.DENTRO_PRAZO),
          locacoes_devolvidas: locacoes.filter(l => getStatusLocacao(l).status === StatusLocacao.DEVOLVIDO),
          servicos_andamento: servicos.filter(s => getStatusServico(s).status === StatusServico.EM_ANDAMENTO),
          servicos_concluidos: servicos.filter(s => getStatusServico(s).status === StatusServico.CONCLUIDO),
          servicos_iniciar: servicos.filter(s => getStatusServico(s).status === StatusServico.A_INICIAR),
      };
      return data;
  }, [locacoes, servicos]);

  const obras = useMemo(() => [...new Set(aprovadas.map(item => item.obraSetor).filter(Boolean))], [aprovadas]);

  const todosFiltrados = useMemo(() => {
      const listas: Record<Aba, (SolicitacaoLocacao | SolicitacaoServico)[]> = {
          locacoes_vencidas, locacoes_proximas, locacoes_prazo, locacoes_devolvidas,
          servicos_andamento, servicos_concluidos, servicos_iniciar
      };

      let resultado = listas[abaAtiva] || [];

      if (busca) {
          resultado = resultado.filter(item =>
              item.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
              item.obraSetor?.toLowerCase().includes(busca.toLowerCase()) ||
              item.solicitante?.toLowerCase().includes(busca.toLowerCase()) ||
              (item.tipo === TipoSolicitacao.SERVICO && (item as SolicitacaoServico).fornecedorNome?.toLowerCase().includes(busca.toLowerCase()))
          );
      }
      if (filtroObra !== "todas") {
          resultado = resultado.filter(item => item.obraSetor === filtroObra);
      }
      return resultado;
  }, [abaAtiva, busca, filtroObra, locacoes_vencidas, locacoes_proximas, locacoes_prazo, locacoes_devolvidas, servicos_andamento, servicos_concluidos, servicos_iniciar]);

  const TABS: { id: Aba, label: string, count: number, className: string }[] = [
      { id: 'locacoes_vencidas', label: "Loc. Vencidas", count: locacoes_vencidas.length, className: "data-[state=active]:bg-red-100 data-[state=active]:text-red-900" },
      { id: 'locacoes_proximas', label: "Loc. Próximas", count: locacoes_proximas.length, className: "data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900" },
      { id: 'locacoes_prazo', label: "Loc. no Prazo", count: locacoes_prazo.length, className: "data-[state=active]:bg-green-100 data-[state=active]:text-green-900" },
      { id: 'servicos_andamento', label: "Serv. Andamento", count: servicos_andamento.length, className: "data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900" },
      { id: 'servicos_iniciar', label: "Serv. a Iniciar", count: servicos_iniciar.length, className: "data-[state=active]:bg-sky-100 data-[state=active]:text-sky-900" },
      { id: 'servicos_concluidos', label: "Serv. Concluídos", count: servicos_concluidos.length, className: "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900" },
      { id: 'locacoes_devolvidas', label: "Loc. Devolvidas", count: locacoes_devolvidas.length, className: "data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900" },
  ];

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Painel de Locações e Serviços</h1>
              <p className="text-slate-600">Gerencie todas as locações e serviços aprovados</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-red-50 border-red-200"><h3 className="text-sm text-red-700 font-medium mb-1">Locações Vencidas</h3><p className="text-3xl font-bold text-red-900">{locacoes_vencidas.length}</p></Card>
          <Card className="p-4 bg-amber-50 border-amber-200"><h3 className="text-sm text-amber-700 font-medium mb-1">Vence em 7 dias</h3><p className="text-3xl font-bold text-amber-900">{locacoes_proximas.length}</p></Card>
          <Card className="p-4 bg-yellow-50 border-yellow-200"><h3 className="text-sm text-yellow-700 font-medium mb-1">Serviços em Andamento</h3><p className="text-3xl font-bold text-yellow-900">{servicos_andamento.length}</p></Card>
          <Card className="p-4 bg-blue-50 border-blue-200"><h3 className="text-sm text-blue-700 font-medium mb-1">Serviços Concluídos</h3><p className="text-3xl font-bold text-blue-900">{servicos_concluidos.length}</p></Card>
        </div>
        
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9" /></div>
            {/* FIX: The native `select` element uses the `onChange` event, not `onValueChange`. */}
            <Select value={filtroObra} onChange={(e) => setFiltroObra(e.target.value)}><option value="todas">Todas as Obras</option>{obras.map(o => <option key={o} value={o}>{o}</option>)}</Select>
            <Button variant="outline" onClick={() => exportToCsv(solicitacoes)}><Download className="w-4 h-4 mr-2" />Exportar</Button>
          </div>
        </Card>

        <Tabs value={abaAtiva} onValueChange={(v) => setAbaAtiva(v as Aba)}>
          <TabsList className="bg-white shadow-sm flex-wrap h-auto">
            {TABS.map(tab => tab.count > 0 && <TabsTrigger key={tab.id} value={tab.id} className={tab.className}>{tab.label} ({tab.count})</TabsTrigger>)}
          </TabsList>
        </Tabs>

        <div className="mt-6">
          {todosFiltrados.length === 0 ? (
            <Card className="p-12 text-center"><h3 className="text-xl font-semibold text-slate-900">Nenhum item encontrado</h3><p className="text-slate-600">Não há locações ou serviços com os filtros selecionados.</p></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todosFiltrados.map(item => (
                item.tipo === 'Locação' ? (
                  <LocacaoCard key={item.id} locacao={item as SolicitacaoLocacao}
                    onRenovar={(loc) => { setItemSelecionado(loc); setModalRenovar(true); }}
                    onDevolver={(loc) => { setItemSelecionado(loc); setModalDevolver(true); }}
                    onDetalhes={(loc) => { setItemSelecionado(loc); setModalDetalhesLocacao(true); }}
                  />
                ) : (
                  <ServicoCard key={item.id} servico={item as SolicitacaoServico}
                    onConcluir={onConcluirServico}
                    onDetalhes={(serv) => { setItemSelecionado(serv); setModalDetalhesServico(true); }}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </div>

      <RenovarModal locacao={itemSelecionado as SolicitacaoLocacao} open={modalRenovar} onClose={() => setModalRenovar(false)} onConfirm={onRenovar} />
      <DevolverModal locacao={itemSelecionado as SolicitacaoLocacao} open={modalDevolver} onClose={() => setModalDevolver(false)} onConfirm={onDevolver} />
      <DetalhesLocacaoModal locacao={itemSelecionado as SolicitacaoLocacao} open={modalDetalhesLocacao} onClose={() => setModalDetalhesLocacao(false)} onUpdate={onUpdateSolicitacao} isAdmin={isAdmin} />
      <DetalhesServicoModal servico={itemSelecionado as SolicitacaoServico} open={modalDetalhesServico} onClose={() => setModalDetalhesServico(false)} onUpdate={onUpdateSolicitacao} isAdmin={isAdmin} />
    </div>
  );
}