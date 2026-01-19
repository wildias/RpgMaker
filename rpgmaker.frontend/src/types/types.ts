export interface PersonagemResponse {
  personagemId: number;
  nome: string;
  numeroIdentificacao: string;
  reino: string;
  aptidao: string;
  pX_Atual: number;
  pX_Total: number;
  imagem: string;
  ficha: string;
  idade: number;
  level: number;
}

export interface PersonagemCreateRequest {
  Nome: string;
  NumeroIdentificacao: string;
  Reino: string;
  Aptidao: string;
  PX_Atual: number;
  PX_Total: number;
  Imagem: string;
  Ficha: string;
  Idade: number;
  Level: number;
}

export interface FichaData {
  EstadoVital: {
    Vigor: boolean[];
    Essencia: boolean[];
    LimiteSupressao: boolean[];
    Defesa: boolean[];
  };
  Atributos: {
    Potencia: boolean[];
    Agilidade: boolean[];
    Vontade: boolean[];
    Engenho: boolean[];
    Presenca: boolean[];
  };
  EquipamentosPosses: string;
  ManifestacaoMagica: string;
  Historia: string;
  Pericias: string;
  Qualidades: string;
  Defeitos: string;
  Anotacoes: string;
}

export interface JWTClaims {
  userId: string;
  userName: string;
  role: 'Player' | 'Mestre';
}
