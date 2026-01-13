import type { PersonagemResponse } from '../types/types';
import '../styles/PersonagemCard.css';

interface PersonagemCardProps {
  personagem: PersonagemResponse;
}

export default function PersonagemCard({ personagem }: PersonagemCardProps) {
  return (
    <div className="personagem-card">
      <div className="personagem-image">
        {personagem.Imagem ? (
          <img src={personagem.Imagem} alt={personagem.Nome} />
        ) : (
          <div className="placeholder-image">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        )}
      </div>
      
      <div className="personagem-info">
        <h3 className="personagem-nome">{personagem.Nome}</h3>
        
        <div className="personagem-details">
          <div className="detail-item">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{personagem.NumeroIdentificacao}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Reino:</span>
            <span className="detail-value">{personagem.Reino}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Idade:</span>
            <span className="detail-value">{personagem.Idade} anos</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Aptidão:</span>
            <span className="detail-value">{personagem.Aptidao}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
