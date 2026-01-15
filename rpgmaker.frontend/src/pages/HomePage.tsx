import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { personagemService } from '../services/personagemService';
import type { PersonagemResponse, JWTClaims } from '../types/types';
import PersonagemCard from '../components/PersonagemCard';
import PersonagemModal from '../components/PersonagemModal';
import DistribuirPXModal from '../components/DistribuirPXModal';
import { useSignalR } from '../hooks/useSignalR';
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
  const [selectedPersonagem, setSelectedPersonagem] = useState<PersonagemResponse | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPXModalOpen, setIsPXModalOpen] = useState(false);

  // Configurar SignalR para atualização em tempo real
  useSignalR({
    enabled: true,
    
    // Quando um personagem é criado
    onPersonagemCriado: (novoPersonagem) => {
      console.log('Novo personagem criado via SignalR:', novoPersonagem);
      
      if (claims?.role === 'Mestre') {
        // Adiciona o novo personagem à lista
        setPersonagens(prev => [...prev, novoPersonagem]);
        toast.info(`Novo personagem criado: ${novoPersonagem.nome}`);
      }
    },
    
    // Quando um personagem é atualizado
    onPersonagemAtualizado: (personagemAtualizado) => {
      console.log('Personagem atualizado via SignalR:', personagemAtualizado);
      
      if (claims?.role === 'Player') {
        // Se for o personagem do player, atualiza
        if (personagem && personagem.personagemId === personagemAtualizado.personagemId) {
          setPersonagem(personagemAtualizado);
          toast.info('Seu personagem foi atualizado');
        }
      } else if (claims?.role === 'Mestre') {
        // Atualiza na lista de personagens
        setPersonagens(prev => 
          prev.map(p => p.personagemId === personagemAtualizado.personagemId ? personagemAtualizado : p)
        );
        toast.info(`Personagem atualizado: ${personagemAtualizado.nome}`);
      }
    },
    
    // Quando um personagem é excluído
    onPersonagemExcluido: (personagemId) => {
      console.log('Personagem excluído via SignalR:', personagemId);
      
      if (claims?.role === 'Player') {
        // Se for o personagem do player, remove
        if (personagem && personagem.personagemId === personagemId) {
          setPersonagem(null);
          toast.warning('Seu personagem foi excluído');
        }
      } else if (claims?.role === 'Mestre') {
        // Remove da lista
        setPersonagens(prev => prev.filter(p => p.personagemId !== personagemId));
        toast.info('Um personagem foi excluído');
      }
    },
    
    // Quando PX é distribuído
    onPXDistribuido: (personagemId, pxAtual, pxTotal) => {
      console.log('PX distribuído via SignalR:', { personagemId, pxAtual, pxTotal });
      
      if (claims?.role === 'Player') {
        // Se for o personagem do player, atualiza PX
        if (personagem && personagem.personagemId === personagemId) {
          setPersonagem(prev => prev ? { ...prev, pX_Atual: pxAtual, pX_Total: pxTotal } : null);
          toast.success(`Você recebeu PX! Total: ${pxTotal}`);
        }
      } else if (claims?.role === 'Mestre') {
        // Atualiza PX na lista
        setPersonagens(prev =>
          prev.map(p =>
            p.personagemId === personagemId ? { ...p, pX_Atual: pxAtual, pX_Total: pxTotal } : p
          )
        );
      }
    },
  });

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
    setSelectedPersonagem(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleVisualizarPersonagem = (personagemData: PersonagemResponse) => {
    setSelectedPersonagem(personagemData);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSavePersonagem = async (data: any) => {
    try {
      if (!claims) {
        toast.error('Usuário não autenticado');
        return;
      }

      const userId = parseInt(claims.userId);
      
      if (modalMode === 'create') {
        // Criar novo personagem
        await personagemService.criarPersonagem(userId, data);
        
        // Recarregar o personagem após criar
        const personagemData = await personagemService.buscarPersonagem(userId);
        setPersonagem(personagemData);
        
        toast.success('Personagem criado com sucesso!');
        setIsModalOpen(false);
      } else if (modalMode === 'edit') {
        // Atualizar personagem existente
        if (!selectedPersonagem) {
          toast.error('Nenhum personagem selecionado');
          return;
        }

        await personagemService.atualizarPersonagem(selectedPersonagem.personagemId, data);
        
        // Recarregar dados
        if (claims.role === 'Player') {
          const personagemData = await personagemService.buscarPersonagem(userId);
          setPersonagem(personagemData);
        } else {
          const personagensData = await personagemService.buscarPersonagens();
          setPersonagens(personagensData);
        }
        
        toast.success('Personagem atualizado com sucesso!');
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Erro ao salvar personagem:', err);
      toast.error('Erro ao salvar personagem. Tente novamente.');
    }
  };

  const handleLogout = () => {
    authService.removeToken();
    navigate('/login');
  };

  const handleDistribuirPX = () => {
    setIsMenuOpen(false);
    setIsPXModalOpen(true);
  };

  const handleSubmitDistribuirPX = async (distribuicoes: { personagemId: number; px: number }[]) => {
    try {
      await personagemService.distribuirPX(distribuicoes);
      toast.success('PX distribuído com sucesso!');
      setIsPXModalOpen(false);
      
      // Recarregar lista de personagens
      if (claims?.role === 'Mestre') {
        const personagensData = await personagemService.buscarPersonagens();
        setPersonagens(personagensData);
      }
    } catch (error) {
      console.error('Erro ao distribuir PX:', error);
      toast.error('Erro ao distribuir PX. Tente novamente.');
    }
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
          
          {/* Menu Dropdown */}
          <div className="menu-container">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="menu-button" 
              title="Menu"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="menu-icon">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </button>

            {isMenuOpen && (
              <div className="dropdown-menu">
                {claims?.role === 'Mestre' && (
                  <button onClick={handleDistribuirPX} className="menu-item">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="menu-item-icon">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                    </svg>
                    Distribuir PX
                  </button>
                )}
                <button onClick={handleLogout} className="menu-item menu-item-logout">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="menu-item-icon">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="home-main">
          {claims?.role === 'Player' && (
            <>
              {personagem ? (
                <div className="player-personagem">
                  <PersonagemCard 
                    personagem={personagem} 
                    onClick={() => handleVisualizarPersonagem(personagem)}
                  />
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
                    <PersonagemCard 
                      key={p.personagemId} 
                      personagem={p}
                      onClick={() => handleVisualizarPersonagem(p)}
                    />
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
        personagem={selectedPersonagem || personagem}
        mode={modalMode}
        onSave={handleSavePersonagem}
      />

      {/* Modal de Distribuir PX */}
      <DistribuirPXModal
        isOpen={isPXModalOpen}
        onClose={() => setIsPXModalOpen(false)}
        personagens={personagens}
        onDistribuir={handleSubmitDistribuirPX}
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
