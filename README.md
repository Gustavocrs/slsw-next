# 🎮 Solo Leveling: Savage Worlds RPG Manager

Uma plataforma web completa para gerenciamento de mesas de RPG, adaptando o universo de **Solo Leveling** para o sistema de regras **Savage Worlds (SWADE)**.

Este projeto permite a criação de fichas de personagens, gerenciamento de campanhas, rolagem de dados, chat em tempo real e consulta de regras, tudo integrado em uma interface moderna e responsiva.

## ✨ Funcionalidades Principais

### 👤 Gerenciamento de Personagens

- **Ficha Completa SWADE:** Atributos, Perícias, Vantagens, Complicações e Equipamentos.
- **Sistema de Despertar:** Aba exclusiva para definir a Origem, Sensação, Afinidade de Mana e o Poder Único do caçador.
- **Cálculos Automáticos:** Defesa, Aparar, Resistência e penalidades de ferimentos calculados automaticamente.
- **Gerador de Prompt IA:** Cria prompts detalhados baseados na ficha para gerar a arte do personagem em IAs generativas.

### 🏰 Gestão de Mesas (Game Master)

- **Criação de Mesas:** Defina nome, descrição, data da sessão e links externos (VTT/Discord).
- **Convites por E-mail:** Sistema de convite para jogadores via e-mail.
- **Painel do GM:** Controle total sobre os jogadores, visualização de fichas e expulsão de membros.
- **NPCs:** O GM pode adicionar seus próprios personagens como NPCs na mesa.
- **Gerenciador de Arquivos:** Upload e compartilhamento de mapas, imagens e PDFs com os jogadores.

### 🎲 Gameplay em Tempo Real

- **Sincronização ao Vivo:** Todas as alterações na ficha e na mesa são refletidas instantaneamente para todos (Firebase Firestore).
- **Chat Integrado:**
  - Chat Global da mesa.
  - Mensagens Privadas (Sussurros) entre jogadores ou com o GM.
  - Histórico de mensagens persistente.
- **Manual Integrado:** Consulta rápida às regras do cenário (Arquétipos, Runas, Dungeons) sem sair da tela.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [Next.js](https://nextjs.org/) (React)
- **Linguagem:** JavaScript (ES6+)
- **Estilização:** [Material UI (MUI)](https://mui.com/) & Styled Components
- **Estado Global:** [Zustand](https://github.com/pmndrs/zustand) (com persistência local)
- **Backend (Serverless):** [Firebase](https://firebase.google.com/)
  - **Authentication:** Login com Google.
  - **Firestore:** Banco de dados NoSQL em tempo real.
  - **Storage:** Armazenamento de imagens e arquivos.

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (v16 ou superior)
- Uma conta no Firebase

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/slsw-rpg.git
   cd slsw-rpg
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` na raiz do projeto e adicione suas credenciais do Firebase:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000` no seu navegador.

## 🔒 Regras de Segurança (Firestore Security Rules)

Para que o sistema de Chat e Mesas funcione corretamente, configure as regras do seu Firestore com o seguinte código:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Regras para Usuários (Notificações de Chat)
    match /users/{userId} {
      // O usuário pode ler e atualizar seu próprio perfil (ex: lastLogin)
      allow read, write: if request.auth.uid == userId;

      // Subcoleção de notificações
      match /notifications/{notificationId} {
        // O dono pode ler e apagar suas notificações
        allow read, list, delete: if request.auth.uid == userId;
        // Qualquer usuário autenticado pode criar uma notificação para outro (enviar msg)
        allow create: if request.auth != null;
      }
    }

    // Regras para Fichas de Personagem
    match /characters/{charId} {
      // O dono da ficha pode atualizar ou deletar
      allow update, delete: if request.auth.uid == resource.data.userId;
      // Um usuário autenticado pode criar uma ficha para si mesmo
      allow create: if request.auth.uid != null && request.resource.data.userId == request.auth.uid;
      // Qualquer usuário autenticado pode ler uma ficha (a UI controla o acesso)
      // Isso é necessário para o GM poder ver a ficha dos jogadores.
      allow read: if request.auth != null;
    }

    // Regras para Mesas de Jogo
    match /tables/{tableId} {
      // O GM ou um jogador da mesa pode ler os dados da mesa
      allow read: if resource.data.gmId == request.auth.uid
                  || request.auth.uid in resource.data.playerIds
                  || (resource.data.invites != null && request.auth.token.email in resource.data.invites);

      // Apenas o GM pode deletar a mesa
      allow delete: if resource.data.gmId == request.auth.uid;

      // Um usuário pode criar uma mesa se ele for o GM dela
      allow create: if request.auth.uid != null && request.resource.data.gmId == request.auth.uid;

      // O GM pode atualizar qualquer campo.
      // Um jogador convidado (pelo email) pode se adicionar à lista de jogadores (aceitar convite).
      // Um jogador que já está na mesa pode atualizar dados (ex: vincular personagem).
      allow update: if resource.data.gmId == request.auth.uid
                    || request.auth.token.email in resource.data.invites
                    || request.auth.uid in resource.data.playerIds;

      // Regras para o Chat da Mesa
      match /conversations/{conversationId}/messages/{messageId} {
        // Apenas membros da mesa podem ler as mensagens
        allow read, list: if get(/databases/$(database)/documents/tables/$(tableId)).data.gmId == request.auth.uid
                       || request.auth.uid in get(/databases/$(database)/documents/tables/$(tableId)).data.playerIds;

        // Apenas membros da mesa podem enviar mensagens, e apenas em seu próprio nome
        allow create: if (get(/databases/$(database)/documents/tables/$(tableId)).data.gmId == request.auth.uid
                         || request.auth.uid in get(/databases/$(database)/documents/tables/$(tableId)).data.playerIds)
                         && request.resource.data.senderId == request.auth.uid;

        // Ninguém pode alterar ou deletar mensagens depois de enviadas
        allow update, delete: if false;
      }
    }
  }
}
```

## 📂 Estrutura do Projeto

- `/src/components`: Componentes React reutilizáveis (Header, Sidebar, Modais).
  - `/SheetView`: Componentes da ficha de personagem.
  - `/Table`: Componentes de gerenciamento de mesa e chat.
  - `/BookView`: Visualizador do manual de regras.
- `/src/stores`: Gerenciamento de estado com Zustand (`characterStore.js`).
- `/src/lib`: Configurações de infraestrutura (`firebase.js`, `api.js`, `rpgEngine.js`).
- `/src/hooks`: Hooks customizados (`useAuth`, `useCharacterAPI`).
- `/src/data`: Conteúdo estático do manual (`manualContent.js`).

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias para o sistema ou novas regras para o cenário.

## 📄 Licença

Este projeto é de uso livre para fins não comerciais. Baseado nas regras de Savage Worlds (Pinnacle Entertainment Group) e no universo de Solo Leveling.
