import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SetDescriptionProps {
    descricaoAtual: any;
    imagemId: number;
    onSuccess: () => void;
    onClose: () => void;
}

export default function SetDescription({imagemId, descricaoAtual, onSuccess, onClose }: SetDescriptionProps) {

    const url = "http://localhost:8080";

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
        <div className='sticky inset-44 w-full md:w-auto'>
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-6">
            <div className="flex justify-between items-center mb-4">
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
                    {isSubmitting ? 'Atualizando...' : 'Atualizar descrição'}
                </button>
            </form>
        </div>
        </div>
    );
}