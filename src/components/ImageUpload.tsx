import React, { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import API_URL from '../utils/config';

interface ImageUploadProps {
  muralId: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function ImageUpload({ muralId, onSuccess, onClose }: ImageUploadProps) {
  const url = API_URL;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

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
          resetForm();
        }
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const resetForm = () => {
    setDescricao('');
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className='sticky inset-36 w-full max-w-lg mx-4 p-6 bg-white rounded-lg shadow-lg'
      style={{ animation: 'imageExpandIn 0.3s forwards' }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Adicionar Imagem</h3>
        <button
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição (opcional)
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={2}
            placeholder="Adicione uma descrição para a imagem (opcional)..."
          />
        </div>

        {previewImage ? (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden flex justify-center">
              <img
                src={previewImage}
                alt="Pré-visualização"
                className="w-auto h-32 object-contain"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmUpload}
                disabled={isUploading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              >
                {isUploading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : (
                  <Check className="h-5 w-5" />
                )}
                Confirmar Envio
              </button>
              <button
                onClick={resetForm}
                disabled={isUploading}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <label className="block w-full">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <div className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Upload className="h-5 w-5" />
              Selecionar Imagem
            </div>
          </label>
        )}
      </div>
    </div>
  );
}