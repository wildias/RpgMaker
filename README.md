# 🎮 RPG Maker - Sistema de Gerenciamento de Personagens

Sistema completo para gerenciamento de personagens de RPG com autenticação, atualização em tempo real e interface responsiva. A aplicação permite que mestres de RPG gerenciem múltiplos personagens e jogadores visualizem e editem seus próprios personagens.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Instalação e Execução](#instalação-e-execução)
- [Deploy](#deploy)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## 🎯 Visão Geral

O **RPG Maker** é uma aplicação web full-stack que permite:
- **Mestres**: Criar, visualizar, editar e excluir personagens de todos os jogadores, além de distribuir pontos de experiência (PX)
- **Jogadores**: Visualizar e editar apenas seus próprios personagens

A aplicação utiliza comunicação em tempo real via SignalR, garantindo que todas as mudanças sejam sincronizadas instantaneamente entre todos os usuários conectados.

---

## 🚀 Tecnologias Utilizadas

### **Frontend**

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **React** | 19.2.0 | Biblioteca para construção de interfaces |
| **TypeScript** | 5.9.3 | Superset tipado do JavaScript |
| **Vite** | 7.2.4 | Build tool e dev server rápido |
| **React Router DOM** | 7.12.0 | Roteamento e navegação |
| **Tailwind CSS** | 4.1.18 | Framework CSS utility-first |
| **SignalR** | 10.0.0 | Comunicação em tempo real |
| **React Toastify** | 11.0.5 | Notificações toast |
| **ESLint** | 9.39.1 | Linter para qualidade de código |

### **Backend** (API REST + SignalR Hub)

| Tecnologia | Descrição |
|-----------|-----------|
| **.NET Core** | Framework principal do backend |
| **ASP.NET Core Web API** | API RESTful |
| **SignalR** | Hub para comunicação em tempo real |
| **JWT Authentication** | Autenticação baseada em tokens |
| **Entity Framework Core** | ORM para banco de dados |
| **Railway** | Plataforma de hospedagem |

### **Infraestrutura**

- **GitHub Pages**: Hospedagem do frontend
- **Railway**: Hospedagem do backend e banco de dados
- **Git**: Controle de versão

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Sistema de login com JWT tokens
- Validação de sessão persistente
- Rotas protegidas por autenticação
- Suporte para dois tipos de usuários: **Mestre** e **Jogador**

### 👥 Gerenciamento de Personagens

#### Para Mestres:
- ✅ Visualizar todos os personagens do sistema
- ✅ Criar novos personagens para jogadores
- ✅ Editar qualquer personagem
- ✅ Excluir personagens
- ✅ Distribuir pontos de experiência (PX) para múltiplos personagens
- ✅ Upload e crop de imagens para avatares

#### Para Jogadores:
- ✅ Visualizar apenas seu próprio personagem
- ✅ Editar informações do personagem
- ✅ Upload e crop de avatar personalizado
- ✅ Visualizar atributos e ficha completa

### 📊 Atributos e Ficha do Personagem

Cada personagem possui:
- **Informações Básicas**: Nome, Reino, Aptidão, Idade, Level, Número de Identificação
- **Experiência**: PX Atual e PX Total
- **Estado Vital**: Vigor, Essência, Limite de Supressão
- **Atributos**: Potência, Agilidade, Vontade, Engenho, Presença
- **Informações Adicionais**: Equipamentos e Posses, Manifestação Mágica, História

### 🔄 Atualizações em Tempo Real

Via **SignalR**, a aplicação notifica automaticamente:
- 📢 Quando um novo personagem é criado
- 🔄 Quando um personagem é atualizado
- ❌ Quando um personagem é excluído
- ⭐ Quando PX é distribuído

### 📱 Interface Responsiva

- Design adaptável para desktop, tablet e mobile
- Componentes otimizados para telas pequenas
- Modal responsivo para visualização de personagens
- Menu mobile interativo

---

## 🏗️ Arquitetura

### **Fluxo de Dados**

```
┌─────────────┐      HTTP/REST      ┌─────────────┐
│   Frontend  │ ←─────────────────→ │   Backend   │
│   (React)   │                     │  (.NET API) │
└─────────────┘                     └─────────────┘
       ↑                                    ↑
       │                                    │
       └────── SignalR WebSocket ───────────┘
```

### **Componentes Principais**

#### Frontend
```
src/
├── components/          # Componentes reutilizáveis
│   ├── PersonagemCard.tsx
│   ├── PersonagemModal.tsx
│   ├── DistribuirPXModal.tsx
│   ├── ImageCropper.tsx
│   └── ProtectedRoute.tsx
├── pages/              # Páginas da aplicação
│   ├── LoginPage.tsx
│   └── HomePage.tsx
├── services/           # Camada de serviços/API
│   ├── authService.ts
│   ├── personagemService.ts
│   └── signalRService.ts
├── hooks/              # Custom hooks
│   └── useSignalR.ts
├── types/              # Definições TypeScript
│   └── types.ts
└── styles/             # Arquivos CSS
```

#### Backend (Endpoints Principais)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/Auth/login` | Autenticação de usuário |
| `GET` | `/api/Auth/usuarios` | Listar usuários |
| `GET` | `/api/Personagem/buscar/{userId}` | Buscar personagem por usuário |
| `GET` | `/api/Personagem/buscar` | Buscar todos personagens (Mestre) |
| `POST` | `/api/Personagem/criar/{userId}` | Criar personagem |
| `PUT` | `/api/Personagem/atualizar/{id}` | Atualizar personagem |
| `PUT` | `/api/Personagem/atualizarpx` | Distribuir PX |
| `DELETE` | `/api/Personagem/excluir/{id}` | Excluir personagem |

**SignalR Hub**: `/personagemHub`

---

## 💻 Instalação e Execução

### Pré-requisitos

- Node.js 20.x ou superior
- npm ou yarn
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/<seu-usuario>/rpgmaker.frontend.git

# Entre no diretório
cd rpgmaker.frontend

# Instale as dependências
npm install
```

### Configuração

Crie um arquivo `.env` na raiz do projeto (opcional):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Executar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`

### Preview da Build

```bash
npm run preview
```

---

## 🌐 Deploy

### Deploy no GitHub Pages

1. **Configuração no GitHub**:
   - Vá em **Settings** → **Pages**
   - Em **Source**, selecione **Deploy from a branch**
   - Em **Branch**, selecione `gh-pages` e `/root`
   - Salve

2. **Deploy Manual**:
   ```bash
   npm run deploy
   ```

   Este comando irá:
   - Compilar o projeto
   - Criar/atualizar o branch `gh-pages`
   - Fazer push automático para o GitHub

3. **Acesso**: O site ficará disponível em:
   ```
   https://<seu-usuario>.github.io/rpgmaker.frontend/
   ```

### Configuração de Produção

No arquivo [vite.config.ts](vite.config.ts), o `base` está configurado para GitHub Pages:

```typescript
base: '/rpgmaker.frontend/'
```

Para outros ambientes, ajuste conforme necessário.

---

## 📁 Estrutura do Projeto

```
rpgmaker.frontend/
├── public/                      # Arquivos públicos
│   ├── manifest.json           # Manifesto PWA
│   ├── service-worker.js       # Service worker
│   └── .nojekyll              # Configuração GitHub Pages
├── src/
│   ├── assets/                 # Recursos estáticos
│   │   ├── images/            # Imagens
│   │   └── sons/              # Sons/áudio
│   ├── components/             # Componentes React
│   │   ├── DistribuirPXModal.tsx
│   │   ├── ImageCropper.tsx
│   │   ├── PersonagemCard.tsx
│   │   ├── PersonagemModal.tsx
│   │   └── ProtectedRoute.tsx
│   ├── hooks/                  # Custom hooks
│   │   └── useSignalR.ts
│   ├── pages/                  # Páginas
│   │   ├── HomePage.tsx
│   │   └── LoginPage.tsx
│   ├── services/               # Serviços/API
│   │   ├── authService.ts
│   │   ├── personagemService.ts
│   │   └── signalRService.ts
│   ├── styles/                 # Estilos CSS
│   ├── types/                  # Types TypeScript
│   │   └── types.ts
│   ├── App.tsx                 # Componente principal
│   └── main.tsx               # Entry point
├── .github/
│   └── workflows/             # (Removido - deploy manual)
├── eslint.config.js           # Configuração ESLint
├── tailwind.config.js         # Configuração Tailwind
├── tsconfig.json              # Configuração TypeScript
├── vite.config.ts             # Configuração Vite
└── package.json               # Dependências e scripts
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Compila para produção
npm run preview      # Preview da build local

# Qualidade de Código
npm run lint         # Executa ESLint

# Deploy
npm run deploy       # Deploy no GitHub Pages
```

---

## 🎨 Features Técnicas

### Custom Hooks

**`useSignalR`**: Hook personalizado para gerenciar conexão SignalR
- Reconexão automática
- Callbacks para eventos em tempo real
- Logging detalhado
- Gerenciamento de estado da conexão

### Roteamento Protegido

**`ProtectedRoute`**: Componente HOC para proteger rotas
- Verifica autenticação via JWT
- Redireciona para login se não autenticado
- Mantém estado da rota pretendida

### Upload de Imagens

**`ImageCropper`**: Componente de crop de imagens
- Preview antes do upload
- Crop interativo
- Conversão para base64
- Validação de formato e tamanho

### Gerenciamento de Estado

- State local com `useState`
- Context API para autenticação
- LocalStorage para persistência de token
- SignalR para sincronização em tempo real

---

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Tokens armazenados em localStorage
- ✅ Headers de autorização em todas as requisições
- ✅ Validação de roles (Mestre/Jogador)
- ✅ Rotas protegidas no frontend e backend
- ✅ CORS configurado no backend

---

## 🌟 Diferenciais

1. **Tempo Real**: Atualização instantânea via SignalR
2. **Responsividade**: Interface adaptável para todos os dispositivos
3. **TypeScript**: Tipagem forte para maior confiabilidade
4. **Performance**: Build otimizado com Vite
5. **UX**: Notificações toast para feedback imediato
6. **Acessibilidade**: Componentes semânticos e navegação por teclado

---

## 📝 Licença

Este projeto é de uso pessoal/educacional.

---

## 👨‍💻 Autor

**Wilgner Dias**

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abrir um Pull Request

---

## 📞 Suporte

Para questões ou suporte, abra uma issue no repositório GitHub.

---

**Desenvolvido com ❤️ usando React, TypeScript e .NET**
