export enum TipoSolicitacao {
  COMPRA = 'Compra',
  LOCACAO = 'Locação',
  SERVICO = 'Serviço',
}

export enum StatusLocacao {
  VENCIDA = 'Vencida',
  PROXIMA_VENCIMENTO = 'Próxima do vencimento',
  DENTRO_PRAZO = 'Dentro do prazo',
  DEVOLVIDO = 'Devolvida',
}

export enum StatusServico {
  A_INICIAR = 'A Iniciar',
  EM_ANDAMENTO = 'Em Andamento',
  CONCLUIDO = 'Concluído',
}

export enum StatusAprovacao {
    PENDENTE = 'Pendente',
    EM_ANALISE = 'Em Análise',
    APROVADA = 'Aprovada',
    REPROVADA = 'Reprovada',
}

export type Prioridade = 'baixa' | 'media' | 'alta' | 'urgente';

export type User = {
    id: string;
    fullName: string;
    email: string;
    role: 'admin' | 'user';
    avatar?: string;
};

export interface SolicitacaoBase {
  id: string;
  tipo: TipoSolicitacao;
  titulo: string;
  descricao: string;
  solicitante: string;
  obraSetor: string;
  justificativa?: string;
  prioridade: Prioridade;
  observacoes?: string;
  dataCriacao: Date;
  statusAprovacao: StatusAprovacao;
  motivoReprovacao?: string;
}

export interface SolicitacaoCompra extends SolicitacaoBase {
  tipo: TipoSolicitacao.COMPRA;
  prazoNecessario: Date;
  fornecedorSugerido?: string;
}

export interface SolicitacaoLocacao extends SolicitacaoBase {
  tipo: TipoSolicitacao.LOCACAO;
  dataInicio: Date;
  dataDevolucaoPrevista: Date;
  quantidade: number;
  dataDevolucaoReal?: Date;
  historicoRenovacoes?: string;
}

export interface SolicitacaoServico extends SolicitacaoBase {
  tipo: TipoSolicitacao.SERVICO;
  valor: number;
  dataInicio: Date;
  dataFinal: Date;
  fornecedorNome: string;
  fornecedorCpf: string;
  chavePix: string;
  dataConclusaoReal?: Date;
}

export type Solicitacao = SolicitacaoCompra | SolicitacaoLocacao | SolicitacaoServico;

export type StatusInfo = {
    status: StatusLocacao | StatusServico;
    cor: string;
    textoCor: string;
    borderColor?: string;
    dias?: number;
    diasInfo?: string | null;
};