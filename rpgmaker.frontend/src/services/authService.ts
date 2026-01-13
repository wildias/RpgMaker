import type { JWTClaims } from '../types/types';

export const authService = {
  // Decodifica o token JWT e retorna as claims
  decodeToken(token: string): JWTClaims | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded = JSON.parse(jsonPayload);
      
      return {
        userId: decoded.userId,
        userName: decoded.userName,
        role: decoded.role,
      };
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  },

  // Salva o token no localStorage
  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  },

  // Recupera o token do localStorage
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  },

  // Remove o token do localStorage
  removeToken(): void {
    localStorage.removeItem('jwtToken');
  },

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  },

  // Obtém as claims do token salvo
  getClaims(): JWTClaims | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  },
};
