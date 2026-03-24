# Solo Leveling: Savage Worlds RPG Manager (SLSW)

> **Eleve sua campanha de RPG ao Nível S!** 🔥

Uma plataforma web completa e imersiva para gerenciamento de mesas de RPG, unindo a adrenalina do universo de **Solo Leveling** com a ação ágil e tática do sistema **Savage Worlds (SWADE)**.

Diga adeus às dezenas de abas abertas, papéis perdidos e cálculos complexos. O **SLSW RPG Manager** entrega uma experiência _all-in-one_ em tempo real. Tudo que você precisa para explorar Dungeons mortais está aqui, em uma interface moderna e responsiva.

## ✨ Por que o SLSW é a plataforma definitiva para sua mesa?

### 👤 Arsenal do Caçador (Experiência do Jogador)

- **Fichas Vivas e Automatizadas (SWADE):** Gerencie Atributos, Perícias e Equipamentos com facilidade. Defesa, Aparar, Resistência e penalidades de ferimento são calculados instantaneamente. Foco na ação, não na matemática!
- **O Sistema de Despertar (Exclusivo!):** Uma interface dedicada para customizar a essência do seu caçador. Defina sua Origem, Sensação, Afinidade de Mana e desenvolva seu Poder Único.
- **Integração com IA para Artes:** Quer ver o rosto do seu personagem? O sistema analisa sua ficha e gera um prompt detalhado e otimizado, pronto para ser usado em IAs geradoras de imagem (Midjourney, DALL-E, etc).

### 👑 Domínio do Monarca (Ferramentas para o Mestre)

- **Painel de Controle Total do GM:** Gerencie jogadores, monitore todas as fichas da mesa ao vivo, adicione NPCs personalizados e mantenha o fluxo da história sob controle.
- **Gerenciador de Arquivos Integrado:** Esqueça o Google Drive na hora da tensão. Faça upload e compartilhe mapas, imagens de monstros e documentos importantes diretamente com os jogadores durante a sessão.
- **Gestão Prática de Campanhas:** Crie sua mesa, configure links do VTT/Discord e envie convites diretamente para o e-mail dos seus jogadores.

### ⚡ Imersão em Tempo Real

- **Sincronização Mágica:** Qualquer dano sofrido ou item ganho é atualizado na mesma hora para todos na mesa, graças ao poder do Firebase Firestore.
- **Comunicação Tática (Chat Avançado):**
  - Fale no canal global ou envie **Sussurros (Mensagens Privadas)** secretos para outros jogadores ou para o Mestre.
  - Histórico persistente para você nunca perder um detalhe da narrativa.
- **Manual de Regras In-App:** Bateu uma dúvida no meio do combate? Acesse o manual do cenário completo (Arquétipos, Runas, Dungeons, Regras de SWADE) sem precisar sair da sua ficha.

---

## 🛠️ O Motor do Sistema (Tech Stack)

Construído com as melhores e mais modernas tecnologias do mercado para garantir estabilidade e fluidez:

- **Frontend:** [Next.js](https://nextjs.org/) (React)
- **Linguagem:** JavaScript (ES6+)
- **Estilização:** [Material UI (MUI)](https://mui.com/) & Styled Components
- **Estado Global:** [Zustand](https://github.com/pmndrs/zustand) (com persistência local)
- **Backend (Serverless):** [Firebase](https://firebase.google.com/)
  - **Authentication:** Login com Google.
  - **Firestore:** Banco de dados NoSQL em tempo real.
  - **Storage:** Armazenamento de imagens e arquivos.

## 🚀 Entre na Dungeon: Como Executar Localmente

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

## 🛡️ Fortificação do Sistema (Firestore Security Rules)

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
      // O dono pode deletar. Atualização aberta para autenticados (para GM poder editar)
      allow delete: if request.auth.uid == resource.data.userId;
      allow update: if request.auth != null;
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
