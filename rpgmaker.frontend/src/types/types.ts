export interface PersonagemResponse {
  PersonagemId: number;
  Nome: string;
  NumeroIdentificacao: number;
  Reino: string;
  Aptidao: string;
  PX_Atual: number;
  PX_Total: number;
  Imagem: string;
  Ficha: string;
  Idade: number;
}

export interface JWTClaims {
  userId: string;
  userName: string;
  role: 'Player' | 'Mestre';
}
