import React, { useState } from 'react';
import { X } from 'lucide-react';
import API_URL from '../utils/config';

interface SetDescriptionProps {
    descricaoAtual: any;
    imagemId: number;
    onSuccess: () => void;
    onClose: () => void;
}

export default function SetDescription({ imagemId, descricaoAtual, onSuccess, onClose }: SetDescriptionProps) {

    const url = API_URL;

    const [descricao, setDescricao] = useState(descricaoAtual);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('jwt_token');
            const response = await fetch(`${url}/imagens/${imagemId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: descricao
            });

            if (response.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Erro ao atualizar descricão:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='sticky inset-44 w-full max-w-lg mx-4 p-6 bg-white rounded-lg shadow-lg'
            style={{ animation: 'imageExpandIn 0.3s forwards' }}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Alterar descrição</h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        id="nome"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Digite a nova descrição..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting && (
                        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            Atualizando...
                        </div>
                    )}
                    Atualizar descrição
                </button>
            </form>
        </div>
    );
}