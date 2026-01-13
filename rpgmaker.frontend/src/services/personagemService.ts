import type { PersonagemResponse } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const personagemService = {
  // Busca um personagem específico por ID do usuário
  async buscarPersonagem(userId: number): Promise<PersonagemResponse | null> {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${API_BASE_URL}/Personagem/buscar/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        return null; // Personagem não encontrado
      }

      if (!response.ok) {
        throw new Error('Erro ao buscar personagem');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
      throw error;
    }
  },

  // Busca todos os personagens (para Mestre)
  async buscarPersonagens(): Promise<PersonagemResponse[]> {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${API_BASE_URL}/Personagem/buscar`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar personagens');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
      throw error;
    }
  },
};
