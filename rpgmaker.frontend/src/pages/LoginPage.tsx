import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, AuthService, type UsuarioResponse } from '../services/authService';
import backgroundImage from '../assets/images/background.jpg';
import '../styles/LoginPage.css';
import temaSom from '../assets/sons/tema.mp3';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        setLoading(true);
        const usuariosData = await AuthService.getUsuarios();
        setUsuarios(usuariosData);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar usuários. Verifique se a API está rodando.');
        console.error('Erro ao carregar usuários:', err);
        // Mesmo com erro, permitir que a página seja exibida
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };

    carregarUsuarios();
  }, []);

  useEffect(() => {
    // Criar e configurar o áudio
    audioRef.current = new Audio(temaSom);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    // Tentar tocar o áudio
    const playAudio = async () => {
      try {
        await audioRef.current?.play();
        console.log('Música tocando automaticamente');
      } catch (err) {
        console.log('Autoplay bloqueado. Tentando tocar após interação do usuário...');

        // Função para tocar após primeira interação
        const playOnInteraction = async () => {
          try {
            await audioRef.current?.play();
            console.log('Música tocando após interação');
            // Remover listeners após tocar
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('keydown', playOnInteraction);
          } catch (e) {
            console.error('Erro ao tentar tocar música:', e);
          }
        };

        // Adicionar listeners para primeira interação
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('keydown', playOnInteraction, { once: true });
      }
    };

    playAudio();

    // Cleanup: parar o áudio quando desmontar o componente
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      
      // Salvar o token JWT
      if (data.token) {
        authService.saveToken(data.token);
        navigate('/home');
      } else {
        throw new Error('Token não recebido');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Usuário ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="login-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="login-overlay"></div>
      
      <div className="login-box">
        <div className="login-title">
          <h1>As Crônicas de Ilfandyr</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <div className="input-wrapper">
              <svg className="input-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <select
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              >
                <option value="" disabled>Escolha seu usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.username} value={usuario.username}>
                    {usuario.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <svg className="input-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                disabled={!username}
                required
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              'Entrando...'
            ) : (
              <>
                <svg className="button-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h8v16z"/>
                  <circle cx="13" cy="12" r="1"/>
                  <path d="M18 9l4 3-4 3v-2h-6v-2h6z"/>
                </svg>
                Login
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
           <p>© 2026 RPG Maker.</p>
          <p className="by-line"><span className="wd-text">Wil Dias</span></p>
          <a href="https://wildiasdev.com.br/" target="_blank" rel="noopener noreferrer" className="site-link">
            <svg className="button-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
            Visitar Site
          </a>
        </div>
      </div>
    </div>
  );
}
