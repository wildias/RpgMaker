import { useEffect, useRef } from 'react';
import { signalRService } from '../services/signalRService';
import type { PersonagemResponse } from '../types/types';

interface UseSignalRProps {
  onPersonagemCriado?: (personagem: PersonagemResponse) => void;
  onPersonagemAtualizado?: (personagem: PersonagemResponse) => void;
  onPersonagemExcluido?: (personagemId: number) => void;
  onPXDistribuido?: (personagemId: number, pxAtual: number, pxTotal: number) => void;
  enabled?: boolean;
}

export function useSignalR({
  onPersonagemCriado,
  onPersonagemAtualizado,
  onPersonagemExcluido,
  onPXDistribuido,
  enabled = true,
}: UseSignalRProps) {
  const unsubscribersRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (!enabled) {
      console.log('SignalR Hook: Desabilitado');
      return;
    }

    console.log('SignalR Hook: Inicializando...');

    const initializeConnection = async () => {
      try {
        console.log('SignalR Hook: Chamando startConnection...');
        // Inicia a conexão
        await signalRService.startConnection();
        console.log('SignalR Hook: Conexão iniciada com sucesso');

        // Registra os callbacks e guarda as funções de unsubscribe
        const unsubscribers: (() => void)[] = [];

        if (onPersonagemCriado) {
          const unsubscribe = signalRService.onPersonagemCriado(onPersonagemCriado);
          unsubscribers.push(unsubscribe);
        }

        if (onPersonagemAtualizado) {
          const unsubscribe = signalRService.onPersonagemAtualizado(onPersonagemAtualizado);
          unsubscribers.push(unsubscribe);
        }

        if (onPersonagemExcluido) {
          const unsubscribe = signalRService.onPersonagemExcluido(onPersonagemExcluido);
          unsubscribers.push(unsubscribe);
        }

        if (onPXDistribuido) {
          const unsubscribe = signalRService.onPXDistribuido(onPXDistribuido);
          unsubscribers.push(unsubscribe);
        }

        unsubscribersRef.current = unsubscribers;
      } catch (error) {
        console.error('Erro ao inicializar SignalR:', error);
      }
    };

    initializeConnection();

    // Cleanup: remove os callbacks quando o componente desmontar
    return () => {
      unsubscribersRef.current.forEach(unsubscribe => unsubscribe());
      unsubscribersRef.current = [];
    };
  }, [onPersonagemCriado, onPersonagemAtualizado, onPersonagemExcluido, onPXDistribuido, enabled]);

  return {
    isConnected: signalRService.isConnected(),
    getConnectionState: signalRService.getConnectionState,
  };
}
