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

    // Regras para Personagens
    match /characters/{charId} {
      allow read, write: if request.auth != null;
    }

    // Regras para Mesas
    match /tables/{tableId} {
      allow read: if resource.data.gmId == request.auth.uid || request.auth.uid in resource.data.playerIds;
      allow create: if request.auth != null;
      allow update, delete: if resource.data.gmId == request.auth.uid;

      // Regras para o Chat (Conversas)
      match /conversations/{conversationId}/messages/{messageId} {
         allow read, list: if get(/databases/$(database)/documents/tables/$(tableId)).data.gmId == request.auth.uid
                       || request.auth.uid in get(/databases/$(database)/documents/tables/$(tableId)).data.playerIds;

         allow create: if (get(/databases/$(database)/documents/tables/$(tableId)).data.gmId == request.auth.uid
                         || request.auth.uid in get(/databases/$(database)/documents/tables/$(tableId)).data.playerIds)
                         && request.resource.data.senderId == request.auth.uid;
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
