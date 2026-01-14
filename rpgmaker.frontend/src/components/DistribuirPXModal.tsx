import { useState } from 'react';
import type { PersonagemResponse } from '../types/types';
import '../styles/DistribuirPXModal.css';

interface DistribuirPXModalProps {
  isOpen: boolean;
  onClose: () => void;
  personagens: PersonagemResponse[];
  onDistribuir: (distribuicoes: { personagemId: number; px: number }[]) => void;
}

// Função para garantir que a imagem base64 tenha o formato correto
const formatImageSrc = (imageData: string | null | undefined): string | null => {
  if (!imageData || imageData.trim() === '') return null;
  
  if (imageData.startsWith('data:image')) {
    return imageData;
  }
  
  return `data:image/jpeg;base64,${imageData}`;
};

export default function DistribuirPXModal({ isOpen, onClose, personagens, onDistribuir }: DistribuirPXModalProps) {
  const [pxValues, setPxValues] = useState<{ [key: number]: number }>({});

  const handlePXChange = (personagemId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setPxValues(prev => ({
      ...prev,
      [personagemId]: numValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filtrar apenas personagens com PX > 0
    const distribuicoes = Object.entries(pxValues)
      .filter(([_, px]) => px > 0)
      .map(([personagemId, px]) => ({
        personagemId: parseInt(personagemId),
        px
      }));

    if (distribuicoes.length === 0) {
      alert('Digite um valor de PX para pelo menos um personagem');
      return;
    }

    onDistribuir(distribuicoes);
    setPxValues({});
  };

  const handleCancel = () => {
    setPxValues({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="distribuir-px-overlay" onClick={handleCancel}>
      <div className="distribuir-px-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-px">
          <h2>Distribuir PX</h2>
          <button className="close-btn-px" onClick={handleCancel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-px">
          <div className="personagens-list-px">
            {personagens.map((personagem) => {
              const imageSrc = formatImageSrc(personagem.imagem);
              
              return (
                <div key={personagem.personagemId} className="personagem-item-px">
                  <div className="personagem-info-px">
                    <div className="personagem-avatar-px">
                      {imageSrc ? (
                        <img src={imageSrc} alt={personagem.nome} />
                      ) : (
                        <div className="avatar-placeholder-px">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="personagem-nome-px">
                      {personagem.nome}
                    </div>
                  </div>
                  
                  <div className="px-input-container">
                    <label>PX:</label>
                    <input
                      type="number"
                      min="0"
                      value={pxValues[personagem.personagemId] || ''}
                      onChange={(e) => handlePXChange(personagem.personagemId, e.target.value)}
                      placeholder="0"
                      className="px-input"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="modal-actions-px">
            <button type="button" onClick={handleCancel} className="btn-cancel-px">
              Cancelar
            </button>
            <button type="submit" className="btn-submit-px">
              Enviar PX
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
