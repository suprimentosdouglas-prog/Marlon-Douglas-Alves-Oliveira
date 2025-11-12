import React, { useState } from 'react';
import { Mail } from './icons';

const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>;

interface LoginPageProps {
    onLogin: (email: string) => string | null;
    onRegister: (newUser: { name: string; email: string }) => string | null;
}

export default function LoginPage({ onLogin, onRegister }: LoginPageProps) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('O campo de e-mail é obrigatório.');
            return;
        }

        let result = null;
        if (isRegistering) {
            if (!name) {
                setError('O campo de nome é obrigatório.');
                return;
            }
            result = onRegister({ name, email });
        } else {
            result = onLogin(email);
        }

        if (result) {
            setError(result);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-xl border">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <ShoppingCartIcon />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Gestão de Obras</h1>
                    <p className="text-slate-500">{isRegistering ? 'Crie sua conta para começar' : 'Acesse sua conta para continuar'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegistering && (
                        <div>
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Nome Completo
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Endereço de e-mail
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {isRegistering ? 'Cadastrar e Entrar' : 'Entrar'}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError('');
                        }}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        {isRegistering ? 'Já tem uma conta? Faça o login' : 'Não tem uma conta? Cadastre-se'}
                    </button>
                </div>

                <div className="text-center text-xs text-slate-500 pt-2">
                    <p>Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.</p>
                </div>
            </div>
        </div>
    );
}