import React, { useState } from 'react';
import { User } from '../types';
import { Shield, Trash2 } from './icons';
import ConfirmModal from './ConfirmModal';
import { Button } from './ui/Button';

interface AdminPanelProps {
  users: User[];
  currentUser: User;
  onUpdateUserRole: (userId: string, role: 'admin' | 'user') => void;
  onDeleteUser: (userId: string) => void;
}

export default function AdminPanel({ users, currentUser, onUpdateUserRole, onDeleteUser }: AdminPanelProps) {
  const [userToModify, setUserToModify] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = (user: User) => {
    setUserToModify(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToModify) {
      onDeleteUser(userToModify.id);
      setIsDeleteModalOpen(false);
      setUserToModify(null);
    }
  };

  const handleRoleChange = (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    onUpdateUserRole(user.id, newRole);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gray-100 min-h-full">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Usuários</h1>
        <p className="text-gray-500">Adicione, remova e edite as permissões dos usuários.</p>
      </header>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Nome Completo</th>
                <th scope="col" className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                        Admin
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-800">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.email}</td>
                  <td className="px-6 py-4">{user.fullName}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRoleChange(user)}
                      disabled={user.id === currentUser.id}
                      title={user.id === currentUser.id ? "Você não pode alterar sua própria permissão." : `Tornar ${user.role === 'admin' ? 'usuário' : 'admin'}`}
                    >
                      {user.role === 'admin' ? 'Rebaixar' : 'Promover'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-100"
                      onClick={() => openDeleteModal(user)}
                      disabled={user.id === currentUser.id}
                      title={user.id === currentUser.id ? "Você não pode excluir sua própria conta." : "Excluir usuário"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão de Usuário"
        description={`Tem certeza que deseja excluir permanentemente o usuário ${userToModify?.fullName} (${userToModify?.email})? Esta ação não pode ser desfeita.`}
        confirmButtonText="Excluir Usuário"
        isDestructive
      />
    </div>
  );
}