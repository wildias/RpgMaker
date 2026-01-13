import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { personagemService } from '../services/personagemService';
import type { PersonagemResponse, JWTClaims } from '../types/types';
import PersonagemCard from '../components/PersonagemCard';
import PersonagemModal from '../components/PersonagemModal';
import backgroundImage from '../assets/images/telaInicial.jpg';
import '../styles/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<JWTClaims | null>(null);
  const [personagem, setPersonagem] = useState<PersonagemResponse | null>(null);
  const [personagens, setPersonagens] = useState<PersonagemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create');

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
          try {
            const userId = parseInt(userClaims.userId);
            const personagemData = await personagemService.buscarPersonagem(userId);
            setPersonagem(personagemData);
          } catch (err) {
            console.error('Erro ao buscar personagem:', err);
            // Mesmo com erro, permite que o usuário veja a opção de criar personagem
            setPersonagem(null);
          }
        } 
        // Se for Mestre, buscar todos os personagens
        else if (userClaims.role === 'Mestre') {
          try {
            const personagensData = await personagemService.buscarPersonagens();
            setPersonagens(personagensData);
          } catch (err) {
            console.error('Erro ao buscar personagens:', err);
            // Mesmo com erro, mostra lista vazia
            setPersonagens([]);
          }
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
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleSavePersonagem = async (data: any) => {
    try {
      // TODO: Implementar chamada à API para salvar personagem
      console.log('Salvando personagem:', data);
      setIsModalOpen(false);
      // Recarregar dados após salvar
      // await loadData();
    } catch (err) {
      console.error('Erro ao salvar personagem:', err);
    }
  };

  const handleLogout = () => {
    authService.removeToken();
    navigate('/login');
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
          <button onClick={handleLogout} className="logout-button" title="Sair">
            <svg viewBox="0 0 24 24" fill="currentColor" className="logout-icon">
              {/* Porta medieval com arco */}
              <path d="M4 22h16V9c0-2-1-3-3-3h-2V4c0-1-1-2-2-2h-2c-1 0-2 1-2 2v2H7C5 6 4 7 4 9v13z" fill="#654321"/>
              <path d="M6 8h12v14H6z" fill="#8B4513"/>
              <rect x="6" y="8" width="6" height="14" fill="#6B4423"/>
              <rect x="12" y="8" width="6" height="14" fill="#5A3615"/>
              <circle cx="10" cy="15" r="0.7" fill="#2C1810"/>
              <circle cx="14" cy="15" r="0.7" fill="#2C1810"/>
              {/* Dobradiças */}
              <rect x="11.5" y="9" width="1" height="2" fill="#1a1a1a" rx="0.3"/>
              <rect x="11.5" y="13" width="1" height="2" fill="#1a1a1a" rx="0.3"/>
              <rect x="11.5" y="17" width="1" height="2" fill="#1a1a1a" rx="0.3"/>
              {/* Pregos/detalhes */}
              <circle cx="8" cy="10" r="0.4" fill="#2C1810"/>
              <circle cx="8" cy="12" r="0.4" fill="#2C1810"/>
              <circle cx="8" cy="14" r="0.4" fill="#2C1810"/>
              <circle cx="8" cy="16" r="0.4" fill="#2C1810"/>
              <circle cx="8" cy="18" r="0.4" fill="#2C1810"/>
              <circle cx="16" cy="10" r="0.4" fill="#2C1810"/>
              <circle cx="16" cy="12" r="0.4" fill="#2C1810"/>
              <circle cx="16" cy="14" r="0.4" fill="#2C1810"/>
              <circle cx="16" cy="16" r="0.4" fill="#2C1810"/>
              <circle cx="16" cy="18" r="0.4" fill="#2C1810"/>
            </svg>
          </button>
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


      {/* Modal de Personagem */}
      <PersonagemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        personagem={personagem}
        mode={modalMode}
        onSave={handleSavePersonagem}
      />
        {/* Rodapé */}
        <footer className="home-footer">
          <p>© 2026 RPG Maker.</p>
          <p className="by-line"><span className="wd-text">Wil Dias</span></p>
          <a href="https://wildiasdev.com.br/" target="_blank" rel="noopener noreferrer" className="site-link">
            <svg className="button-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
            Visitar Site
          </a>
        </footer>
      </div>
    </div>
  );
}
