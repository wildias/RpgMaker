import { useState } from 'react';
import '../styles/TrocarSenhaModal.css';

interface TrocarSenhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (novaSenha: string) => Promise<void>;
}

export default function TrocarSenhaModal({ isOpen, onClose, onSubmit }: TrocarSenhaModalProps) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novaSenha) {
      alert('Por favor, digite a nova senha.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    if (novaSenha.length < 3) {
      alert('A senha deve ter pelo menos 3 caracteres.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(novaSenha);
      setNovaSenha('');
      setConfirmarSenha('');
      onClose();
    } catch (error) {
      console.error('Erro ao trocar senha:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNovaSenha('');
    setConfirmarSenha('');
    setMostrarSenha(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="trocar-senha-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Trocar Senha</h2>
          <button onClick={handleClose} className="close-button" type="button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="trocar-senha-form">
          <div className="form-group">
            <label htmlFor="novaSenha">Nova Senha</label>
            <div className="password-input-container">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                id="novaSenha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Digite a nova senha"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
            <div className="password-input-container">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                id="confirmarSenha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirme a nova senha"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-secondary" disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
