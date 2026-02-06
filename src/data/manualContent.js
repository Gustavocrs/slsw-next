/**
 * Dados do Manual - Conteúdo Estruturado do Livro
 * Extraído do index.html original
 */

export const manualContent = {
  "introducao-como-usar": {
    title: "📖 Introdução & Como Usar o Guia",
    content: `
      <h2>📖 Introdução & Como Usar o Guia</h2>
      
      <h3>Bem-vindo ao Livro dos Jogadores</h3>
      <p>Este é um sistema de RPG baseado em SWADE (Savage Worlds Adventure Edition) integrado com o universo de <strong>Solo Leveling</strong>. Este guia oferece tudo que você precisa para criar personagens únicos e enfrentar dungeons perigosas.</p>
      
      <h3>Estrutura deste Guia</h3>
      <p>Cada capítulo funciona como um módulo independente. Você pode usá-los separadamente ou combiná-los para montar sua própria campanha.</p>
      
      <h3>O que é este cenário?</h3>
      <p>Em um mundo medieval tradicional, fenômenos misteriosos passaram a ocorrer: Portais começaram a surgir, ligando o mundo real a reinos perigosos chamados <strong>Dungeons</strong>. Nesse contexto surgiu o fenômeno do Despertar: algumas pessoas manifestam afinidade com Mana e ganham habilidades além do comum.</p>
      
      <h3>Como começar</h3>
      <p>Para criar seu personagem, basta escolher um dos Arquétipos deste guia. A progressão acontece por meio de Ranks e Avanços, além de Runas, Itens Rúnicos e fontes alternativas de Mana.</p>
      
      <p><strong>Dica:</strong> Clique em <strong>Ficha</strong> no header para começar a criar seu primeiro personagem!</p>
    `,
  },

  "o-despertar": {
    title: "✨ O Despertar",
    content: `
      <h2>✨ O Despertar</h2>
      <p>O Despertar é o momento em que uma pessoa comum entra em contato com a Mana presente nos Portais e nas Dungeons.</p>
      
      <h3>Descrição narrativa</h3>
      <p>Essa energia arcana é tão intensa que altera não apenas o corpo, mas também a mente e o espírito do indivíduo. Ao despertar, a pessoa percebe o mundo de forma diferente.</p>
      
      <h3>Regra Importante</h3>
      <p><strong>O Despertar só pode ocorrer uma vez por personagem.</strong> Qualquer tentativa adicional gera Corrupção automática.</p>
      
      <h3>Tipos de Despertar</h3>
      <ul>
        <li><strong>Natural:</strong> Ocorre por contato intenso com Mana</li>
        <li><strong>Forçado:</strong> Concedem maior poder imediato, mas trazem riscos e Corrupção</li>
        <li><strong>Herdado:</strong> Passado de geração em geração</li>
      </ul>
    `,
  },

  "poder-unico-despertar": {
    title: "⚡ Poder Único do Despertar",
    content: `
      <h2>⚡ Poder Único do Despertar</h2>
      <p>Cada personagem despertado possui um poder único que pode ser desenvolvido ao longo da campanha.</p>
      
      <h3>Características do Poder Único</h3>
      <ul>
        <li>Define seu estilo de combate principal</li>
        <li>Afeta diretamente suas habilidades especiais</li>
        <li>Pode ser aprimorado com Runas e itens</li>
        <li>Tem conexão com o tipo de Mana do personagem</li>
      </ul>
      
      <p>Você pode customizar seu poder em sua ficha adicionando descrições e efeitos específicos.</p>
    `,
  },

  "corrupcao-por-mana": {
    title: "🖤 Corrupção por Mana",
    content: `
      <h2>🖤 Corrupção por Mana</h2>
      <p>A mana é a fonte de poder dos caçadores, mas usá-la em excesso pode levar à corrupção.</p>
      
      <h3>Sistema de Corrupção</h3>
      <p>O sistema de corrupção e mana é crucial para equilibrar o poder e os riscos de se tornar um caçador.</p>
      
      <h3>Efeitos da Corrupção</h3>
      <ul>
        <li><strong>Leve (1-3):</strong> Mudanças cosméticas na aparência</li>
        <li><strong>Moderada (4-6):</strong> Perda parcial de controle</li>
        <li><strong>Severa (7-9):</strong> Transformações significativas</li>
        <li><strong>Crítica (10+):</strong> Perda total de humanidade</li>
      </ul>
    `,
  },

  "arquetipos-cacadores": {
    title: "🗡️ Arquétipos de Caçadores",
    content: `
      <h2>🗡️ Arquétipos de Caçadores</h2>
      <p>Existem vários arquétipos de caçadores, cada um com suas vantagens e desvantagens.</p>
      
      <h3>Arquétipos Disponíveis</h3>
      
      <h4>⚔️ Guerreiro Físico</h4>
      <p>Foca em ataque e defesa. Especialista em combate direto com armas.</p>
      <ul>
        <li><strong>Bônus:</strong> +2 em Lutar, +1 em Vigor</li>
        <li><strong>Habilidade:</strong> Golpe Poderoso</li>
      </ul>
      
      <h4>🔮 Mago</h4>
      <p>Especializado em magia e poderes arcanos.</p>
      <ul>
        <li><strong>Bônus:</strong> +2 em Conjuração, +1 em Intelecto</li>
        <li><strong>Habilidade:</strong> Amplificação Arcana</li>
      </ul>
      
      <h4>🎭 Assassino</h4>
      <p>Agilidade e golpes críticos.</p>
      <ul>
        <li><strong>Bônus:</strong> +2 em Furtividade, +1 em Agilidade</li>
        <li><strong>Habilidade:</strong> Golpe Crítico</li>
      </ul>
      
      <h4>🛡️ Defensor</h4>
      <p>Proteção e suporte ao grupo.</p>
      <ul>
        <li><strong>Bônus:</strong> +2 em Defesa, +1 em Vigor</li>
        <li><strong>Habilidade:</strong> Proteção de Aliados</li>
      </ul>
    `,
  },

  "vantagens-avancadas": {
    title: "🌟 Vantagens Avançadas",
    content: `
      <h2>🌟 Vantagens Avançadas</h2>
      <p>As vantagens são habilidades especiais que definem as competências e talentos de seu personagem.</p>
      
      <h3>Como Usar Vantagens</h3>
      <p>Escolha sabiamente para criar um personagem único e poderoso. Cada vantagem tem requisitos de Rank mínimo.</p>
      
      <h3>Categorias de Vantagens</h3>
      <ul>
        <li><strong>Combate:</strong> Melhoram seu desempenho em batalha</li>
        <li><strong>Magia:</strong> Ampliam seus poderes arcanos</li>
        <li><strong>Sociais:</strong> Aumentam sua influência e charme</li>
        <li><strong>Especializadas:</strong> Vantagens únicas de Solo Leveling</li>
      </ul>
    `,
  },

  "itens-runicos": {
    title: "💎 Itens Rúnicos",
    content: `
      <h2>💎 Itens Rúnicos</h2>
      <p>Itens rúnicos são equipamentos especiais imbuídos de poder mágico.</p>
      
      <h3>Tipos de Itens Rúnicos</h3>
      <ul>
        <li><strong>Armas:</strong> Aumentam dano e têm efeitos especiais</li>
        <li><strong>Armaduras:</strong> Proteção mejorada contra magia</li>
        <li><strong>Acessórios:</strong> Bônus únicos a atributos</li>
        <li><strong>Relíquias:</strong> Itens lendários com grande poder</li>
      </ul>
      
      <p>Eles podem aumentar seus atributos e habilidades de forma significativa.</p>
    `,
  },

  "tabelas-loot-progressao": {
    title: "📊 Tabelas de Loot & Progressão",
    content: `
      <h2>📊 Tabelas de Loot & Progressão</h2>
      <p>Use estas tabelas para determinar o loot de inimigos vencidos e a progressão de seu personagem.</p>
      
      <h3>Tabela de Progressão</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #ccc;">
          <th style="padding: 10px; text-align: left;">Rank</th>
          <th style="padding: 10px; text-align: left;">Experiência</th>
          <th style="padding: 10px; text-align: left;">Avanços</th>
        </tr>
        <tr style="border-bottom: 1px solid #ccc;">
          <td style="padding: 10px;">Novato</td>
          <td style="padding: 10px;">0-1000</td>
          <td style="padding: 10px;">2</td>
        </tr>
        <tr style="border-bottom: 1px solid #ccc;">
          <td style="padding: 10px;">Experiente</td>
          <td style="padding: 10px;">1001-2000</td>
          <td style="padding: 10px;">3</td>
        </tr>
        <tr style="border-bottom: 1px solid #ccc;">
          <td style="padding: 10px;">Veterano</td>
          <td style="padding: 10px;">2001-4000</td>
          <td style="padding: 10px;">4</td>
        </tr>
      </table>
    `,
  },

  "exemplos-personagens": {
    title: "👥 Exemplos de Personagens",
    content: `
      <h2>👥 Exemplos de Personagens</h2>
      <p>Aqui você encontrará exemplos de personagens pré-construídos para se inspirar.</p>
      
      <h3>Sung Jinwoo - O Caçador Shadow</h3>
      <p><strong>Conceito:</strong> Assassino Sombrio</p>
      <p><strong>Rank:</strong> Lendário</p>
      <p><strong>Descrição:</strong> Começou como um caçador fraco mas despertou um poder único extraordinário. Agora é um dos mais fortes.</p>
      
      <h3>Cha Hae-In - A Guerreira Sombria</h3>
      <p><strong>Conceito:</strong> Guerreira de Elite</p>
      <p><strong>Rank:</strong> Heroico</p>
      <p><strong>Descrição:</strong> Combatente exceptcionalmente forte com grande precisão e técnica.</p>
    `,
  },

  "regras-avancadas-dungeons": {
    title: "⛓️ Regras Avançadas de Dungeons",
    content: `
      <h2>⛓️ Regras Avançadas de Dungeons (DG)</h2>
      <p>Regras especiais para explorar dungeons e enfrentar desafios únicos.</p>
      
      <h3>Estrutura de uma Dungeon</h3>
      <ul>
        <li><strong>Sala de Entrada:</strong> Ponto de partida</li>
        <li><strong>Corredores:</strong> Caminhos entre áreas</li>
        <li><strong>Câmaras:</strong> Salas com inimigos ou testes</li>
        <li><strong>Tesouro:</strong> Sala final com recompensas</li>
        <li><strong>Boss:</strong> Chefe final da dungeon</li>
      </ul>
      
      <h3>Dificuldade de Dungeons</h3>
      <p>Cada dungeon tem um nível de dificuldade baseado no número e força dos inimigos.</p>
    `,
  },

  "origem-dos-portais": {
    title: "🌀 Origem dos Portais",
    content: `
      <h2>🌀 Origem dos Portais</h2>
      <p>Os portais são portais dimensionais que levam a dungeons perigosas.</p>
      
      <h3>Como Nascem os Portais</h3>
      <p>Os portais surgem em locais onde a barreira entre dimensões é fraca. Eles abrem periodicamente e precisam ser selados por caçadores.</p>
      
      <h3>Tipos de Portais</h3>
      <ul>
        <li><strong>Bronze:</strong> Fácil, recomendado para novatos</li>
        <li><strong>Prata:</strong> Moderado, precisa de grupo experiente</li>
        <li><strong>Ouro:</strong> Difícil, apenas caçadores veteranos</li>
        <li><strong>Platina:</strong> Muito difícil, caçadores de elite</li>
        <li><strong>Vermelho:</strong> Quase impossível, risco de morte alta</li>
      </ul>
    `,
  },

  "guia-de-guildas": {
    title: "🏢 Guia de Guildas",
    content: `
      <h2>🏢 Guia de Guildas</h2>
      <p>As guildas são organizações de caçadores. Saiba como funcionam e como se juntar a uma.</p>
      
      <h3>Benefícios de uma Guilda</h3>
      <ul>
        <li>Acesso a missões organizadas</li>
        <li>Suporte de caçadores experientes</li>
        <li>Acesso a equipamento e recursos</li>
        <li>Proteção sob um nome conhecido</li>
      </ul>
      
      <h3>Tipos de Guildas</h3>
      <ul>
        <li><strong>Guildas Menores:</strong> Começando, poucos membros</li>
        <li><strong>Guildas Médias:</strong> Estabelecidas, bom reputação</li>
        <li><strong>Guildas Maiores:</strong> Influência política e econômica</li>
        <li><strong>Guildas Reais:</strong> Apoiadas pela coroa ou nobiliarquia</li>
      </ul>
    `,
  },
};

export const manualSectionsList = Object.values(manualContent).map(
  (section, idx) => ({
    id: Object.keys(manualContent)[idx],
    title: section.title,
  }),
);
