import React, { useState, useEffect } from 'react';
import { SolicitacaoCompra, Prioridade } from '../../types';
import { format } from '../../utils/dateUtils';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Label } from '../ui/Label';
import { Save, FileText } from '../icons';

interface EditarCompraModalProps {
    solicitacao: SolicitacaoCompra | null;
    open: boolean;
    onClose: () => void;
    onSave: (id: string, updatedData: Partial<SolicitacaoCompra>) => void;
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

// FIX: A better way to initialize state for the form.
const getInitialFormData = (solicitacao: SolicitacaoCompra | null) => {
    if (!solicitacao) {
        return {};
    }
    return {
        ...solicitacao,
        prazoNecessario: solicitacao.prazoNecessario ? format(new Date(solicitacao.prazoNecessario), 'yyyy-MM-dd') : '',
    };
};

export default function EditarCompraModal({ solicitacao, open, onClose, onSave }: EditarCompraModalProps) {
    const [formData, setFormData] = useState<any>(getInitialFormData(solicitacao));

    useEffect(() => {
        setFormData(getInitialFormData(solicitacao));
    }, [solicitacao]);

    const handleChange = (field: keyof SolicitacaoCompra, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!formData.titulo || !formData.descricao || !formData.prazoNecessario) {
            alert('Título, Descrição e Prazo Necessário são obrigatórios.');
            return;
        }

        const dataToSave: Partial<SolicitacaoCompra> = {
            ...formData,
            prazoNecessario: new Date(formData.prazoNecessario + 'T00:00:00'),
        };

        onSave(solicitacao!.id, dataToSave);
        onClose();
    };

    if (!open || !solicitacao) return null;

    return (
        <Dialog open={open} onClose={onClose} title={`Editar Solicitação - ${solicitacao.id}`}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                 <div className="grid md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <Label htmlFor="edit_titulo">Título *</Label>
                        <Input id="edit_titulo" value={formData.titulo || ''} onChange={(e) => handleChange('titulo', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="edit_obraSetor">Obra / Setor *</Label>
                        <Select id="edit_obraSetor" value={formData.obraSetor || ''} onChange={(e) => handleChange('obraSetor', e.target.value)}>
                            {obras.map(obra => (
                                <option key={obra.codigo} value={obra.nome}>{obra.nome}</option>
                            ))}
                        </Select>
                    </div>
                 </div>

                <div className="space-y-1">
                    <Label htmlFor="edit_descricao">Descrição *</Label>
                    <Textarea id="edit_descricao" value={formData.descricao || ''} onChange={(e) => handleChange('descricao', e.target.value)} rows={3} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="edit_prazo">Prazo Necessário *</Label>
                        <Input id="edit_prazo" type="date" value={formData.prazoNecessario || ''} onChange={(e) => handleChange('prazoNecessario', e.target.value)} />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="edit_fornecedor">Fornecedor Sugerido</Label>
                        <Input id="edit_fornecedor" value={formData.fornecedorSugerido || ''} onChange={(e) => handleChange('fornecedorSugerido', e.target.value)} />
                    </div>
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="edit_prioridade">Prioridade</Label>
                    <Select id="edit_prioridade" value={formData.prioridade || 'media'} onChange={(e) => handleChange('prioridade', e.target.value)}>
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="edit_justificativa">Justificativa</Label>
                    <Textarea id="edit_justificativa" value={formData.justificativa || ''} onChange={(e) => handleChange('justificativa', e.target.value)} rows={2} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="edit_observacoes">Observações</Label>
                    <Textarea id="edit_observacoes" value={formData.observacoes || ''} onChange={(e) => handleChange('observacoes', e.target.value)} rows={2} />
                </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end items-center border-t">
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}