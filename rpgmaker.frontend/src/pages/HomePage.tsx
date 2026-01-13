import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { personagemService } from '../services/personagemService';
import type { PersonagemResponse, JWTClaims } from '../types/types';
import PersonagemCard from '../components/PersonagemCard';
import backgroundImage from '../assets/images/background.jpg';
import '../styles/HomePage.css';

export default function HomePage() {
  const [claims, setClaims] = useState<JWTClaims | null>(null);
  const [personagem, setPersonagem] = useState<PersonagemResponse | null>(null);
  const [personagens, setPersonagens] = useState<PersonagemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Obter as claims do JWT
        const userClaims = authService.getClaims();
        if (!userClaims) {
          setError('Usuário não autenticado');
          setLoading(false);
          return;
        }

        setClaims(userClaims);

        // Se for Player, buscar o personagem do usuário
        if (userClaims.role === 'Player') {
          const userId = parseInt(userClaims.userId);
          const personagemData = await personagemService.buscarPersonagem(userId);
          setPersonagem(personagemData);
        } 
        // Se for Mestre, buscar todos os personagens
        else if (userClaims.role === 'Mestre') {
          const personagensData = await personagemService.buscarPersonagens();
          setPersonagens(personagensData);
        }

        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCriarPersonagem = () => {
    // TODO: Implementar navegação para página de criação de personagem
    console.log('Criar novo personagem');
  };

  if (loading) {
    return (
      <div 
        className="home-container"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="home-overlay"></div>
        <div className="home-content">
          <div className="loading-message">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="home-container"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="home-overlay"></div>
        <div className="home-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="home-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="home-overlay"></div>
      
      <div className="home-content">
        {/* Cabeçalho */}
        <header className="home-header">
          <h1 className="home-title">As Crônicas de Ilfandyr</h1>
        </header>

        {/* Conteúdo Principal */}
        <main className="home-main">
          {claims?.role === 'Player' && (
            <>
              {personagem ? (
                <div className="player-personagem">
                  <PersonagemCard personagem={personagem} />
                </div>
              ) : (
                <div className="no-personagem">
                  <h2 className="no-personagem-title">Nenhum personagem criado</h2>
                  <button onClick={handleCriarPersonagem} className="criar-button">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="button-icon">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </svg>
                    Criar Personagem
                  </button>
                </div>
              )}
            </>
          )}

          {claims?.role === 'Mestre' && (
            <div className="mestre-personagens">
              <h2 className="section-title">Personagens da Mesa</h2>
              {personagens.length > 0 ? (
                <div className="personagens-grid">
                  {personagens.map((p) => (
                    <PersonagemCard key={p.PersonagemId} personagem={p} />
                  ))}
                </div>
              ) : (
                <div className="no-personagens-message">
                  <p>Nenhum personagem criado ainda</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Rodapé */}
        <footer className="home-footer">
          <p>© 2026 RPG Maker. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
