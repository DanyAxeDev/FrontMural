import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  muralId: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function ImageUpload({ muralId, onSuccess, onClose }: ImageUploadProps) {
  const url = "http://localhost:8080";

  const [isUploading, setIsUploading] = useState(false);
  const [descricao, setDescricao] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result?.toString().split(',')[1];
      
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`${url}/imagens/${muralId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ base64Data, descricao })
        });

        if (response.ok) {
          onSuccess();
          onClose();
          setDescricao('');
        }
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className='sticky inset-36 w-full md:w-auto'>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Adicionar Imagem</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
            placeholder="Adicione uma descrição para a imagem..."
          />
        </div>

        <label className="block w-full">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <div className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <Upload className="h-5 w-5" />
            {isUploading ? 'Enviando...' : 'Selecionar Imagem'}
          </div>
        </label>
      </div>
    </div>
    </div>
  );
}