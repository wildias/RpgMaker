const API_BASE_URL = 'http://localhost:5000/api';

export interface UsuarioResponse {
  username: string;
}

export class AuthService {
  static async getUsuarios(): Promise<UsuarioResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/usuarios`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.statusText}`);
      }
      
      const usuarios: UsuarioResponse[] = await response.json();
      
      // Ordenar em ordem alfabética
      return usuarios.sort((a, b) => 
        a.username.localeCompare(b.username, 'pt-BR', { sensitivity: 'base' })
      );
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  static async login(username: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao fazer login: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }
}
