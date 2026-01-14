import type { PersonagemResponse } from '../types/types';
import '../styles/PersonagemCard.css';

interface PersonagemCardProps {
  personagem: PersonagemResponse;
  onClick?: () => void;
}

// Função para garantir que a imagem base64 tenha o formato correto
const formatImageSrc = (imageData: string | null | undefined): string | null => {
  if (!imageData || imageData.trim() === '') return null;
  
  // Se já tem o prefixo data:image, retorna como está
  if (imageData.startsWith('data:image')) {
    return imageData;
  }
  
  // Se for apenas a string base64, adiciona o prefixo
  // Assume JPEG por padrão, mas pode ser ajustado
  return `data:image/jpeg;base64,${imageData}`;
};

export default function PersonagemCard({ personagem, onClick }: PersonagemCardProps) {
  const imageSrc = formatImageSrc(personagem.imagem);
  
  return (
    <div className="personagem-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="personagem-image">
        {imageSrc ? (
          <img src={imageSrc} alt={personagem.nome} />
        ) : (
          <div className="placeholder-image">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        )}
      </div>
      
      <div className="personagem-info">
        <div className="personagem-header">
          <h3 className="personagem-nome">{personagem.nome || 'Sem nome'}</h3>
          <div className="personagem-level">Nv. {personagem.level ?? 0}</div>
        </div>
        
        <div className="personagem-details">
          <div className="detail-item">
            <span className="detail-label">Reino:</span>
            <span className="detail-value">{personagem.reino || 'Não definido'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Idade:</span>
            <span className="detail-value">{personagem.idade || 0} anos</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Aptidão:</span>
            <span className="detail-value">{personagem.aptidao || 'Não definida'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
