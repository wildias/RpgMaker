import type { PersonagemResponse, PersonagemCreateRequest, FichaData } from '../types/types';

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

      if (response.status === 404) {
        return []; // Nenhum personagem encontrado
      }

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

  // Cria um novo personagem
  async criarPersonagem(userId: number, formData: any): Promise<PersonagemResponse> {
    try {
      const token = localStorage.getItem('jwtToken');
      
      // Montar o objeto Ficha como JSON
      const fichaData: FichaData = {
        EstadoVital: {
          Vigor: formData.vigor,
          Essencia: formData.essencia,
          LimiteSupressao: formData.limiteSupressao,
        },
        Atributos: {
          Potencia: formData.potencia,
          Agilidade: formData.agilidade,
          Vontade: formData.vontade,
          Engenho: formData.engenho,
          Presenca: formData.presenca,
        },
        EquipamentosPosses: formData.equipamento,
        ManifestacaoMagica: formData.manifestacaoMagica,
        Historia: formData.historia,
      };

      // Montar o payload de acordo com a API
      const payload: PersonagemCreateRequest = {
        Nome: formData.nome,
        NumeroIdentificacao: parseInt(formData.numeroIdentificacao),
        Reino: formData.reino,
        Aptidao: formData.aptidao,
        PX_Atual: formData.pxAtual,
        PX_Total: formData.pxTotal,
        Imagem: formData.imagem,
        Ficha: JSON.stringify(fichaData),
        Idade: formData.idade,
        Level: formData.nivel,
      };

      const response = await fetch(`${API_BASE_URL}/Personagem/criar/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao criar personagem: ${errorText}`);
      }

      // A API retorna apenas uma mensagem de texto em caso de sucesso
      // Então vamos buscar o personagem criado logo após
      const personagemCriado = await personagemService.buscarPersonagem(userId);
      if (!personagemCriado) {
        throw new Error('Personagem criado mas não foi possível recuperá-lo');
      }
      
      return personagemCriado;
    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      throw error;
    }
  },

  // Atualiza um personagem existente
  async atualizarPersonagem(personagemId: number, formData: any): Promise<PersonagemResponse> {
    try {
      const token = localStorage.getItem('jwtToken');
      
      // Montar o objeto Ficha como JSON
      const fichaData: FichaData = {
        EstadoVital: {
          Vigor: formData.vigor,
          Essencia: formData.essencia,
          LimiteSupressao: formData.limiteSupressao,
        },
        Atributos: {
          Potencia: formData.potencia,
          Agilidade: formData.agilidade,
          Vontade: formData.vontade,
          Engenho: formData.engenho,
          Presenca: formData.presenca,
        },
        EquipamentosPosses: formData.equipamento,
        ManifestacaoMagica: formData.manifestacaoMagica,
        Historia: formData.historia,
      };

      // Montar o payload de acordo com a API
      const payload: PersonagemCreateRequest = {
        Nome: formData.nome,
        NumeroIdentificacao: parseInt(formData.numeroIdentificacao),
        Reino: formData.reino,
        Aptidao: formData.aptidao,
        PX_Atual: formData.pxAtual,
        PX_Total: formData.pxTotal,
        Imagem: formData.imagem,
        Ficha: JSON.stringify(fichaData),
        Idade: formData.idade,
        Level: formData.nivel,
      };

      const response = await fetch(`${API_BASE_URL}/Personagem/atualizar/${personagemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao atualizar personagem: ${errorText}`);
      }

      // A API retorna apenas uma mensagem de texto em caso de sucesso
      // Buscar o personagem atualizado para retornar os dados mais recentes
      // Primeiro precisamos buscar por userId, então vamos retornar um objeto vazio
      // e deixar o componente buscar novamente
      return {} as PersonagemResponse;
    } catch (error) {
      console.error('Erro ao atualizar personagem:', error);
      throw error;
    }
  },

  // Distribui PX para múltiplos personagens
  async distribuirPX(distribuicoes: { personagemId: number; px: number }[]): Promise<void> {
    try {
      const token = localStorage.getItem('jwtToken');
      
      // Mapear para o formato esperado pela API (PascalCase)
      const payload = distribuicoes.map(d => ({
        PersonagemId: d.personagemId,
        Px: d.px
      }));

      const response = await fetch(`${API_BASE_URL}/Personagem/atualizarpx`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao distribuir PX: ${errorText}`);
      }

      // A API retorna apenas uma mensagem de texto em caso de sucesso
    } catch (error) {
      console.error('Erro ao distribuir PX:', error);
      throw error;
    }
  },
};
