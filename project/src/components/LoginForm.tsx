import React, { useState } from 'react';
import { User, Lock, Loader2, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import type { LoginFormData } from '../types';

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    senha: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      navigate('/album');
    } catch (err) {
      setError('Nome ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    localStorage.setItem('user_role', 'guest');
    navigate('/album');
  };

  return (
    <div className="w-full max-w-md h-svh">
      <div className="text-center mb-8">
        <Sun className="h-16 w-16 text-yellow-400 mx-auto animate-pulse lantern-glow" />
        <h1 className="text-4xl font-bold text-white mt-4 text-shadow">Só minha princesa pode entrar</h1>
      </div>

      <form onSubmit={handleSubmit} className="backdrop-blur-md bg-white/10 shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4 border border-purple-300/30">
        {error && (
          <div className="mb-4 p-3 bg-red-400/80 border border-red-500 text-white rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
            Nome
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-purple-200" />
            </div>
            <input
              className="appearance-none border rounded-lg w-full py-3 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
              id="email"
              type="text"
              name="email"
              placeholder="Nome"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-purple-200" />
            </div>
            <input
              className="appearance-none border rounded-lg w-full py-3 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
              id="senha"
              type="password"
              name="senha"
              placeholder="••••••••"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Iluminando o caminho...
            </span>
          ) : (
            'Entrar no reino'
          )}
        </button>
        <button
            type="button"
            onClick={handleGuestAccess}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 mt-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all transform hover:scale-[1.02] border border-white/30"
          >
            Acesso para convidados
          </button>
      </form>
    </div>
  );
}