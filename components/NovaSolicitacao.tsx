import React, { useState } from "react";
import { differenceInDays } from "../utils/dateUtils";
// FIX: Import specific solicitation types to correctly type objects before assigning to the union type.
import { TipoSolicitacao, Solicitacao, Prioridade, SolicitacaoCompra, SolicitacaoLocacao, SolicitacaoServico, User } from '../types';
import { Select } from "./ui/Select";

// Icons
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const Save = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const ShoppingCart = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>;
const Truck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 18H3c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v11"/><path d="M14 9h4l4 4v4h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/></svg>;
const Wrench = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;


interface NovaSolicitacaoProps {
    addSolicitacao: (solicitacao: Omit<Solicitacao, 'id' | 'dataCriacao' | 'statusAprovacao' | 'motivoReprovacao'>) => void;
    setPage: (page: 'dashboard' | 'painel' | 'nova-solicitacao' | 'gerenciar-solicitacoes') => void;
    currentUser: User;
}

const obras = [
    { codigo: 44, nome: 'BIESEK - SUPRIMENTOS E MANUTENÇÔES ADMINISTRATIVAS' },
    { codigo: 12, nome: 'Buenos Aires' },
    { codigo: 41, nome: 'GALPÃO VENEZUELA' },
    { codigo: 21, nome: 'LAGUNAS RESIDENCIAL CLUBE' },
    { codigo: 16, nome: 'LAKE BOULEVARD' },
    { codigo: 32, nome: 'OBRA BIE 4' },
    { codigo: 25, nome: 'OBRA IMPERIAL - ECBIESEK07' },
    { codigo: 29, nome: 'OBRA LAGOA CLUB RESORT' },
    { codigo: 30, nome: 'OBRA LAGOA CLUB RESORT - DIÁRIO DE OBRA' },
    { codigo: 34, nome: 'Obra PLANALTO' },
    { codigo: 43, nome: 'Obra Salas Comerciais - Silvio' },
    { codigo: 37, nome: 'PÓS OBRAS - GERAL' },
    { codigo: 6, nome: 'RESIDENCIAL PARINTINS' },
    { codigo: 36, nome: 'RESIDENCIAL VALENÇA' },
];

export default function NovaSolicitacao({ addSolicitacao, setPage, currentUser }: NovaSolicitacaoProps) {
  const [formData, setFormData] = useState({
    tipo: TipoSolicitacao.COMPRA,
    solicitante: currentUser.fullName,
    titulo: "",
    descricao: "",
    obraSetor: obras[0].nome,
    prazoNecessario: "",
    dataInicio: "",
    dataDevolucaoPrevista: "",
    dataFinal: "",
    quantidade: 1,
    valor: 0,
    fornecedorNome: "",
    fornecedorCpf: "",
    chavePix: "",
    justificativa: "",
    fornecedorSugerido: "",
    prioridade: "media" as Prioridade,
    observacoes: "",
  });

  const validarCPF = (cpf: string) => /^\d{11}$/.test(cpf.replace(/\D/g, ''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!formData.solicitante || !formData.titulo || !formData.descricao || !formData.obraSetor) {
      alert("Por favor, preencha todos os campos obrigatórios (*)");
      return;
    }

    let solicitacaoFinal: Omit<Solicitacao, 'id' | 'dataCriacao' | 'statusAprovacao' | 'motivoReprovacao'>;

    const base = {
        solicitante: formData.solicitante,
        titulo: formData.titulo,
        descricao: formData.descricao,
        obraSetor: formData.obraSetor,
        justificativa: formData.justificativa,
        prioridade: formData.prioridade,
        observacoes: formData.observacoes,
    };

    if (formData.tipo === TipoSolicitacao.LOCACAO) {
        if (!formData.dataInicio || !formData.dataDevolucaoPrevista || formData.quantidade <= 0) {
            alert("Para locação, preencha data de início, devolução e quantidade.");
            return;
        }
        const inicio = new Date(formData.dataInicio + 'T00:00:00');
        const devolucao = new Date(formData.dataDevolucaoPrevista + 'T00:00:00');
        if (devolucao <= inicio) {
            alert("A data de devolução deve ser posterior à data de início.");
            return;
        }
        // FIX: Create a correctly typed object for the specific solicitation type to avoid issues with discriminated unions.
        const novaLocacao: Omit<SolicitacaoLocacao, 'id' | 'dataCriacao' | 'statusAprovacao' | 'motivoReprovacao'> = { ...base, tipo: TipoSolicitacao.LOCACAO, dataInicio: inicio, dataDevolucaoPrevista: devolucao, quantidade: Number(formData.quantidade) };
        solicitacaoFinal = novaLocacao;
    } else if (formData.tipo === TipoSolicitacao.SERVICO) {
        if (!formData.dataInicio || !formData.dataFinal || formData.valor <= 0 || !formData.fornecedorNome || !formData.fornecedorCpf || !validarCPF(formData.fornecedorCpf) || !formData.chavePix) {
            alert("Preencha todos os dados do serviço, incluindo um CPF válido.");
            return;
        }
        const inicio = new Date(formData.dataInicio + 'T00:00:00');
        const final = new Date(formData.dataFinal + 'T00:00:00');
        if (final <= inicio) {
            alert("A data final deve ser posterior à data de início.");
            return;
        }
        // FIX: Create a correctly typed object for the specific solicitation type to avoid issues with discriminated unions.
        const novoServico: Omit<SolicitacaoServico, 'id' | 'dataCriacao' | 'statusAprovacao' | 'motivoReprovacao'> = { ...base, tipo: TipoSolicitacao.SERVICO, dataInicio: inicio, dataFinal: final, valor: Number(formData.valor), fornecedorNome: formData.fornecedorNome, fornecedorCpf: formData.fornecedorCpf, chavePix: formData.chavePix };
        solicitacaoFinal = novoServico;
    } else { // Compra
        if (!formData.prazoNecessario) {
            alert("Para compra, informe o prazo necessário.");
            return;
        }
        // FIX: Create a correctly typed object for the specific solicitation type to avoid issues with discriminated unions.
        const novaCompra: Omit<SolicitacaoCompra, 'id' | 'dataCriacao' | 'statusAprovacao' | 'motivoReprovacao'> = { ...base, tipo: TipoSolicitacao.COMPRA, prazoNecessario: new Date(formData.prazoNecessario + 'T00:00:00'), fornecedorSugerido: formData.fornecedorSugerido };
        solicitacaoFinal = novaCompra;
    }

    addSolicitacao(solicitacaoFinal);
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calcularDuracao = () => {
    if (formData.tipo === TipoSolicitacao.LOCACAO && formData.dataInicio && formData.dataDevolucaoPrevista) {
        const dias = differenceInDays(new Date(formData.dataDevolucaoPrevista), new Date(formData.dataInicio));
        if (dias > 0) return dias > 30 ? `${Math.floor(dias / 30)} meses e ${dias % 30} dias` : `${dias} dias`;
    }
    if (formData.tipo === TipoSolicitacao.SERVICO && formData.dataInicio && formData.dataFinal) {
        const dias = differenceInDays(new Date(formData.dataFinal), new Date(formData.dataInicio));
        if (dias > 0) return `${dias} dias`;
    }
    return null;
  };
  const duracao = calcularDuracao();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setPage('dashboard')} className="p-2 rounded-full hover:bg-gray-200"><ArrowLeft /></button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Nova Solicitação</h1>
            <p className="text-slate-600 mt-1">Preencha os dados da sua solicitação</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-xl border-0 rounded-lg">
            <div className="p-6 space-y-6">
              {/* Tipo */}
              <div className="space-y-2">
                <label className="text-base font-semibold">Tipo de Solicitação *</label>
                <Select value={formData.tipo} onChange={(e) => handleChange('tipo', e.target.value)}>
                  <option value={TipoSolicitacao.COMPRA}>Compra</option>
                  <option value={TipoSolicitacao.LOCACAO}>Locação</option>
                  <option value={TipoSolicitacao.SERVICO}>Serviço</option>
                </Select>
              </div>

              {/* Informações Comuns */}
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="font-semibold">Solicitante *</label>
                    <input 
                        type="text" 
                        value={formData.solicitante} 
                        readOnly 
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="font-semibold">Obra *</label>
                    <Select value={formData.obraSetor} onChange={e => handleChange('obraSetor', e.target.value)} required>
                        {obras.map(obra => (
                            <option key={obra.codigo} value={obra.nome}>{obra.nome}</option>
                        ))}
                    </Select>
                </div>
              </div>
              <div className="space-y-2"><label className="font-semibold">Título *</label><input type="text" value={formData.titulo} onChange={e => handleChange('titulo', e.target.value)} placeholder={formData.tipo === 'Serviço' ? "Ex: Manutenção elétrica" : "Ex: Betoneira 400 litros"} required className="w-full p-3 border border-gray-300 rounded-md"/></div>
              <div className="space-y-2"><label className="font-semibold">Descrição *</label><textarea value={formData.descricao} onChange={e => handleChange('descricao', e.target.value)} placeholder="Descreva detalhadamente..." required rows={4} className="w-full p-3 border border-gray-300 rounded-md"/></div>
              
              {/* Campos dinâmicos */}
              {formData.tipo === TipoSolicitacao.LOCACAO && (
                <div className="space-y-6 bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <h3 className="font-semibold text-purple-900 flex items-center gap-2"><Truck /> Dados da Locação</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="font-semibold">Data de Início *</label><input type="date" value={formData.dataInicio} onChange={e => handleChange('dataInicio', e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md"/></div>
                    <div className="space-y-2"><label className="font-semibold">Data de Devolução *</label><input type="date" value={formData.dataDevolucaoPrevista} onChange={e => handleChange('dataDevolucaoPrevista', e.target.value)} min={formData.dataInicio} required className="w-full p-3 border border-gray-300 rounded-md"/></div>
                  </div>
                  <div className="space-y-2"><label className="font-semibold">Quantidade *</label><input type="number" min="1" value={formData.quantidade} onChange={e => handleChange('quantidade', e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md"/></div>
                  {duracao && <div className="bg-purple-100 p-3 rounded-lg"><p className="text-sm font-semibold text-purple-900">Duração calculada: {duracao}</p></div>}
                </div>
              )}
              {formData.tipo === TipoSolicitacao.SERVICO && (
                <div className="space-y-6 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                   <h3 className="font-semibold text-blue-900 flex items-center gap-2"><Wrench /> Dados do Serviço</h3>
                   <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2"><label className="font-semibold">Valor (R$) *</label><input type="number" min="0" step="0.01" value={formData.valor} onChange={e => handleChange('valor', e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md"/></div>
                     <div className="space-y-2"><label className="font-semibold">Nome Fornecedor *</label><input type="text" value={formData.fornecedorNome} onChange={e => handleChange('fornecedorNome', e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md"/></div>
                   </div>
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2"><label className="font-semibold">CPF Fornecedor *</label><input type="text" value={formData.fornecedorCpf} onChange={e => handleChange('fornecedorCpf', e.target.value.replace(/\D/g, ''))} maxLength={11} required className="w-full p-3 border border-gray-300 rounded-md"/><p className="text-xs text-slate-500">Apenas números (11 dígitos)</p></div>
                      <div className="space-y-2"><label className="font-semibold">Chave Pix *</label><input type="text" value={formData.chavePix} onChange={e => handleChange('chavePix', e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md"/></div>
                   </div>
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2"><label className="font-semibold">Data de Início *</label><input type="date" value={formData.dataInicio} onChange={e => handleChange('dataInicio', e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md"/></div>
                      <div className="space-y-2"><label className="font-semibold">Data Final *</label><input type="date" value={formData.dataFinal} onChange={e => handleChange('dataFinal', e.target.value)} min={formData.dataInicio} required className="w-full p-3 border border-gray-300 rounded-md"/></div>
                   </div>
                   {duracao && <div className="bg-blue-100 p-3 rounded-lg"><p className="text-sm font-semibold text-blue-900">Duração calculada: {duracao}</p></div>}
                </div>
              )}
              {formData.tipo === TipoSolicitacao.COMPRA && (
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="font-semibold">Prazo Necessário *</label><input type="date" value={formData.prazoNecessario} onChange={e => handleChange('prazoNecessario', e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md"/></div>
                    <div className="space-y-2"><label className="font-semibold">Fornecedor Sugerido</label><input type="text" value={formData.fornecedorSugerido} onChange={e => handleChange('fornecedorSugerido', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md"/></div>
                 </div>
              )}

              {/* Campos Finais */}
              <div className="space-y-2"><label className="font-semibold">Prioridade</label>
                <Select value={formData.prioridade} onChange={e => handleChange('prioridade', e.target.value)}>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                </Select>
              </div>
              <div className="space-y-2"><label className="font-semibold">Justificativa</label><textarea value={formData.justificativa} onChange={e => handleChange('justificativa', e.target.value)} placeholder="Por que esta solicitação é necessária?" rows={3} className="w-full p-3 border border-gray-300 rounded-md"/></div>
              <div className="space-y-2"><label className="font-semibold">Observações</label><textarea value={formData.observacoes} onChange={e => handleChange('observacoes', e.target.value)} placeholder="Qualquer informação adicional..." rows={3} className="w-full p-3 border border-gray-300 rounded-md"/></div>

              <div className="flex gap-4 pt-4 border-t">
                <button type="button" onClick={() => setPage('dashboard')} className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center"><Save /> Criar Solicitação</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}