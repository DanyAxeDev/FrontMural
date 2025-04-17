import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, PencilLine, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';
import ImageUpload from '../components/ImageUpload';
import { truncateText } from '../utils/stringUtils';
import MuralCreate from '../components/MuralCreate';
import Modal from '../components/Modal';
import SetDescription from '../components/SetDescription';

export default function PhotoAlbum() {
  const [murais, setMurais] = useState<any[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showMuralModal, setShowMuralModal] = useState(false);
  const [showDescricaoModal, setShowDescricaoModal] = useState(false);
  const [currentMuralId, setCurrentMuralId] = useState<number | null>(null);
  const [selectedMural, setSelectedMural] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const isGuest = localStorage.getItem('user_role') === 'guest';
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const url = import.meta.env.VITE_API_URL;

  const handleAddImage = () => {
    setCurrentMuralId(selectedMural);
    setShowImageModal(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token && !isGuest) {
      navigate('/');
      return;
    }
    carregarMurais();
  }, [navigate]);

  useEffect(() => {
    if (selectedImage || showImageModal || showMuralModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage, showImageModal, showMuralModal]);

  const carregarMurais = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${url}/murais`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setMurais(data);
      } else if (response.status === 401 && !isGuest) {
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao carregar murais:', error);
      if (!isGuest) {
        navigate('/');
      }
    }
  };

  const deletarMural = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este mural?')) return;

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${url}/murais/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        if (selectedMural === id) {
          setSelectedMural(null);
        }
        carregarMurais();
      }
    } catch (error) {
      console.error('Erro ao deletar mural:', error);
    }
  };

  const deletarImagem = async (muralId: number | null, id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar esta imagem?')) return;

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${url}/imagens/${muralId}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setSelectedImage(null);
        carregarMurais();
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
    }
  };

  const getDisplayedImages = () => {
    if (!selectedMural) return [];
    const mural = murais.find(m => m.id === selectedMural);
    return mural?.imagens || [];
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleClick = (img: any) => {
    if (!isMobile) {
      setSelectedImage(img); // Defina a URL da imagem ou algum outro valor
    }
  };

  const handleDoubleClick = (img: any) => {
    if (isMobile) {
      setSelectedImage(img);
    }
  };

  return (
    <div className='w-full'>
      <div className="min-h-screen relative bg-gradient-to-b from-purple-900/50 to-purple-600/50">
        <ParticlesBackground />

        {/* Header with folders/murals */}
        <div className="sticky top-0 z-20 bg-white/10 backdrop-blur-md border-b border-purple-300/30 p-4">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
              {/* Create new mural button */}
              {!isGuest && (
                <button
                  onClick={() => setShowMuralModal(true)}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Novo Mural
                </button>
              )}

              {/* Mural folders */}
              {murais.map(mural => (
                <div
                  key={mural.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-all ${selectedMural === mural.id
                      ? 'bg-white/30 hover:bg-white/40'
                      : 'bg-white/10 hover:bg-white/20'
                    }`}
                  onClick={() => setSelectedMural(mural.id)}
                >
                  <span className="text-white font-medium whitespace-nowrap">{truncateText(mural.nome, 25)}</span>
                  {!isGuest && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletarMural(mural.id);
                      }}
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="whitespace-nowrap">Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image grid */}
        <div className="container mx-auto p-4">
          {!selectedMural ? (
            <div className="text-center text-white/70 mt-20">
              Selecione um mural para ver as imagens
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getDisplayedImages().map((img: any, idx: number) => (
                <div
                  key={idx}
                  className="aspect-square group relative overflow-hidden rounded-lg cursor-pointer drop-shadow-lg hover:ring-yellow-300 hover:ring"
                  onClick={() => {
                    handleClick(img);
                  }}
                  onDoubleClick={() => {
                    handleDoubleClick(img);
                  }}
                >
                  <img
                    src={`data:image/jpeg;base64,${img.base64Data}`}
                    alt=""
                    className="w-full h-full object-cover transition-transform"
                  />
                  {img.descricao && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white text-sm line-clamp-3">{img.descricao}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Image Card */}
              {!isGuest && (
                <button
                  onClick={handleAddImage}
                  className="aspect-square rounded-lg border-2 border-dashed border-white/30 flex flex-col items-center justify-center gap-2 text-white/70 hover:text-white hover:border-white/50 transition-colors cursor-pointer group bg-white/5 hover:bg-white/10 z-20"
                >
                  <Plus className="transition-transform group-hover:scale-110" />
                  <span className="text-sm font-medium">Adicionar imagem</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Image preview modal */}
        {selectedImage && (
          <div className='fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-8'>
            <div
              className="sticky inset-10"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="max-w-3xl w-full relative flex flex-col gap-4 items-center"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'imageExpandIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              >
                <button
                  className="absolute -top-2 -right-2 text-white/70 hover:text-white bg-black/50 rounded-full p-1"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-6 w-6" />
                </button>
                {!isGuest && (
                  <button
                    className='absolute -top-2 -left-2 text-red-500 hover:text-red-400 bg-black/50 rounded-full p-1'
                    onClick={() => deletarImagem(selectedMural, selectedImage.id)}
                  >
                    <Trash2 className='h-6 w-6' />
                  </button>
                )}
                <div className="flex-1 flex items-center justify-center">
                  <img
                    src={`data:image/jpeg;base64,${selectedImage.base64Data}`}
                    alt=""
                    className="max-h-[70vh] w-auto object-contain rounded-lg"
                  />
                </div>
                {!selectedImage.descricao && !isGuest && (
                  <div>
                    <button
                      className='text-white/70 hover:text-white'
                      onClick={() => setShowDescricaoModal(true)}
                    >
                      <Plus />
                    </button>
                  </div>
                )}
                {selectedImage.descricao && (
                  <div className="flex justify-between bg-white/10 backdrop-blur-md rounded-lg p-4 break-words w-full" style={{ animation: 'imageExpandIn 0.3s 0.1s both' }}>
                    <p className="text-white">{selectedImage.descricao}</p>
                    {!isGuest && (
                      <button
                        className='text-white/70 hover:text-white'
                        onClick={() => setShowDescricaoModal(true)}
                      >
                        <PencilLine />
                      </button>
                    )}
                  </div>
                )}
                <Modal isOpen={showDescricaoModal}>
                  <SetDescription
                    descricaoAtual={selectedImage.descricao}
                    imagemId={selectedImage.id}
                    onSuccess={() => {
                      setSelectedImage(null);
                      carregarMurais();
                    }}
                    onClose={() => setShowDescricaoModal(false)}
                  />
                </Modal>
              </div>
            </div>
          </div>
        )}

        <Modal isOpen={showImageModal}>
          <ImageUpload
            muralId={currentMuralId!}
            onSuccess={() => {
              setShowImageModal(false);
              carregarMurais();
            }}
            onClose={() => setShowImageModal(false)}
          />
        </Modal>

        <Modal isOpen={showMuralModal}>
          <MuralCreate
            onSuccess={carregarMurais}
            onClose={() => setShowMuralModal(false)}
          />
        </Modal>
      </div>
      <footer className="mt-auto py-4 bg-white/5 backdrop-blur-sm border-t border-purple-300/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-white/70 text-sm">
            Developed by{' '}
            <span className="font-medium text-white hover:text-yellow-400 transition-colors">
              Daniel Machado
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}