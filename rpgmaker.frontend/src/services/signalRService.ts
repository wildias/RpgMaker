import * as signalR from '@microsoft/signalr';
import type { PersonagemResponse } from '../types/types';

const API_BASE_URL = 'http://localhost:5000';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnecting = false;

  // Callbacks para eventos
  private personagemCriadoCallbacks: ((personagem: PersonagemResponse) => void)[] = [];
  private personagemAtualizadoCallbacks: ((personagem: PersonagemResponse) => void)[] = [];
  private personagemExcluidoCallbacks: ((personagemId: number) => void)[] = [];
  private pxDistribuidoCallbacks: ((personagemId: number, pxAtual: number, pxTotal: number) => void)[] = [];

  // Inicializa a conexão com o hub SignalR
  async startConnection(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected || this.isConnecting) {
      console.log('SignalR: Conexão já existe ou está conectando...');
      return;
    }

    this.isConnecting = true;
    console.log('SignalR: Iniciando conexão com o hub...');
    console.log(`SignalR: URL do hub: ${API_BASE_URL}/personagemHub`);

    try {
      const token = localStorage.getItem('jwtToken');
      console.log('SignalR: Token JWT obtido:', token ? 'Presente' : 'Ausente');
      
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}/personagemHub`, {
          accessTokenFactory: () => token || '',
          // Permite negociação automática de transporte
          // skipNegotiation: false permite usar LongPolling como fallback
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Estratégia de reconexão: 0s, 2s, 10s, 30s, depois sempre 30s
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount === 1) return 2000;
            if (retryContext.previousRetryCount === 2) return 10000;
            return 30000;
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      console.log('SignalR: Hub construído, registrando eventos...');
      // Registrar eventos do servidor
      this.registerEvents();

      console.log('SignalR: Tentando conectar...');
      await this.connection.start();
      console.log('✅ SignalR: Conectado com sucesso!');
      console.log(`SignalR: Connection ID: ${this.connection.connectionId}`);
    } catch (err) {
      console.error('❌ SignalR: Erro ao conectar:', err);
      throw err;
    } finally {
      this.isConnecting = false;
    }
  }

  // Registra os eventos que o cliente pode receber do servidor
  private registerEvents(): void {
    if (!this.connection) return;

    // Evento: PersonagemCriado
    this.connection.on('PersonagemCriado', (personagem: PersonagemResponse) => {
      console.log('Evento recebido: PersonagemCriado', personagem);
      this.personagemCriadoCallbacks.forEach(callback => callback(personagem));
    });

    // Evento: PersonagemAtualizado
    this.connection.on('PersonagemAtualizado', (personagem: PersonagemResponse) => {
      console.log('Evento recebido: PersonagemAtualizado', personagem);
      this.personagemAtualizadoCallbacks.forEach(callback => callback(personagem));
    });

    // Evento: PersonagemExcluido
    this.connection.on('PersonagemExcluido', (personagemId: number) => {
      console.log('Evento recebido: PersonagemExcluido', personagemId);
      this.personagemExcluidoCallbacks.forEach(callback => callback(personagemId));
    });

    // Evento: PXDistribuido
    this.connection.on('PXDistribuido', (personagemId: number, pxAtual: number, pxTotal: number) => {
      console.log('Evento recebido: PXDistribuido', { personagemId, pxAtual, pxTotal });
      this.pxDistribuidoCallbacks.forEach(callback => callback(personagemId, pxAtual, pxTotal));
    });

    // Eventos de reconexão
    this.connection.onreconnecting((error) => {
      console.warn('SignalR reconectando...', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR reconectado:', connectionId);
    });

    this.connection.onclose((error) => {
      console.error('Conexão SignalR fechada:', error);
    });
  }

  // Para a conexão
  async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log('Conexão SignalR encerrada');
    }
  }

  // Métodos para registrar callbacks
  onPersonagemCriado(callback: (personagem: PersonagemResponse) => void): () => void {
    this.personagemCriadoCallbacks.push(callback);
    // Retorna função para remover o callback
    return () => {
      this.personagemCriadoCallbacks = this.personagemCriadoCallbacks.filter(cb => cb !== callback);
    };
  }

  onPersonagemAtualizado(callback: (personagem: PersonagemResponse) => void): () => void {
    this.personagemAtualizadoCallbacks.push(callback);
    return () => {
      this.personagemAtualizadoCallbacks = this.personagemAtualizadoCallbacks.filter(cb => cb !== callback);
    };
  }

  onPersonagemExcluido(callback: (personagemId: number) => void): () => void {
    this.personagemExcluidoCallbacks.push(callback);
    return () => {
      this.personagemExcluidoCallbacks = this.personagemExcluidoCallbacks.filter(cb => cb !== callback);
    };
  }

  onPXDistribuido(callback: (personagemId: number, pxAtual: number, pxTotal: number) => void): () => void {
    this.pxDistribuidoCallbacks.push(callback);
    return () => {
      this.pxDistribuidoCallbacks = this.pxDistribuidoCallbacks.filter(cb => cb !== callback);
    };
  }

  // Verifica o estado da conexão
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  // Obtém o estado da conexão
  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }
}

// Exporta instância singleton
export const signalRService = new SignalRService();
