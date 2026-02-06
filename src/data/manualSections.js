/**
 * Manual Content - Seções do Guia Solo Leveling Medieval
 * Dividido em sections reutilizáveis para renderizar no BookView
 */

export const manualSections = [
  {
    id: "introducao-como-usar",
    title: "Introdução & Como Usar o Guia",
    content: `
      <p>
        <strong>Visão geral acessível, mesmo para quem nunca ouviu falar de Solo Leveling</strong>
      </p>

      <p>
        Este guia apresenta um novo estilo de aventura medieval inspirado no universo de Solo Leveling — mas não é necessário conhecer a obra original para jogar. Aqui, você encontrará um conjunto completo de regras e opções para campanhas onde Portais Mágicos passam a surgir pelo mundo, revelando Dungeons perigosas repletas de monstros, tesouros e energia arcana chamada Mana.
      </p>

      <p>
        Nesse cenário, algumas pessoas despertam habilidades extraordinárias e são conhecidas como Caçadores. Cabe a elas entrar nesses Portais, enfrentar as criaturas que vivem dentro das Dungeons e impedir que escapem para o mundo exterior.
      </p>

      <p>O objetivo deste guia é servir como um manual completo do jogador para esta ambientação. Ele inclui:</p>

      <ul>
        <li>Arquétipos adaptados para um mundo movido a Mana;</li>
        <li>Habilidades rúnicas e poderes únicos;</li>
        <li>Especializações temáticas baseadas em progressão;</li>
        <li>Itens rúnicos (épicos, lendários e únicos);</li>
        <li>Monstros exclusivos com estatísticas próprias;</li>
        <li>Regras avançadas de Portais e Dungeons;</li>
        <li>Lore sobre o surgimento dos Portais e o papel dos Caçadores.</li>
      </ul>

      <p>
        O conteúdo deste guia pode ser usado para campanhas completas, aventuras rápidas ou integrado ao cenário que você já utiliza. Todas as regras foram pensadas para funcionar dentro do sistema <strong>Savage Worlds Adventure Edition (SWADE)</strong>, mantendo sua jogabilidade rápida e cinematográfica, mas introduzindo progressão acelerada de poder e combates de alto impacto.
      </p>

      <h2>Como este guia está organizado</h2>

      <p>Cada capítulo funciona como um módulo independente. Você pode usá-los separadamente ou combiná-los para montar sua própria campanha. Cada módulo apresenta:</p>

      <ul>
        <li>Introdução narrativa — explicando conceitos de forma simples;</li>
        <li>Mecânicas adaptadas totalmente compatíveis com Savage Worlds;</li>
        <li>Tabelas úteis de poderes, runas, itens e efeitos;</li>
      </ul>

      <h2>O que é este cenário?</h2>

      <p>
        Em um mundo medieval tradicional, fenômenos misteriosos passaram a ocorrer: Portais começaram a surgir, ligando o mundo real a reinos perigosos chamados Dungeons. São locais dominados por monstros, energias arcanas e leis próprias. Sempre que um Portal se abre, ele precisa ser explorado e dominado antes que sua energia "transborde", liberando criaturas para o mundo exterior.
      </p>

      <p>
        Nesse contexto surgiu o fenômeno do Despertar: algumas pessoas manifestam afinidade com Mana e ganham habilidades além do comum. Essas pessoas se tornam Caçadores — combatentes, conjuradores, curandeiros e especialistas capazes de sobreviver dentro das Dungeons.
      </p>

      <p>Como jogador, você vive justamente nesse momento da história.</p>

      <h2>Como começar</h2>

      <p>
        Para criar seu personagem, basta escolher um dos Arquétipos deste guia, que servem como base narrativa para a criação de personagens em Savage Worlds. A progressão acontece por meio de Ranks e Avanços, além de Runas, Itens Rúnicos e fontes alternativas de Mana.
      </p>

      <p>
        Depois de criar os Caçadores, o grupo escolhe (ou recebe) um Portal e entra em sua Dungeon. A sobrevivência depende de estratégia, cooperação e decisões inteligentes em meio a ameaças mágicas e criaturas ferozes.
      </p>
    `,
  },
  {
    id: "o-despertar",
    title: "O Despertar",
    content: `
      <p><em>O coração do cenário — explicação clara, mecânica passo a passo e tabelas para jogadores iniciantes.</em></p>

      <h3>Descrição narrativa</h3>
      <p>
        O Despertar é o momento em que uma pessoa comum entra em contato com a Mana presente nos Portais e nas Dungeons. Essa energia arcana é tão intensa que altera não apenas o corpo, mas também a mente e o espírito do indivíduo.
      </p>
      <p>
        Ao despertar, a pessoa percebe o mundo de forma diferente: sons ficam mais claros, a respiração ganha ritmo, o corpo reage como se tivesse encontrado seu verdadeiro propósito. Alguns têm visões, outros sentem dor ou êxtase, e alguns recebem marcas físicas ou ecos de memórias que não deveriam existir.
      </p>
      <p>
        A partir desse momento, o indivíduo deixa de ser apenas um aldeão, guerreiro ou mago comum. Ele se torna um <strong>Caçador</strong> — alguém capaz de manipular Mana, enfrentar Dungeons e sobreviver ao que antes seria impossível.
      </p>

      <div class="rule-box rule">
        <strong>Regra Importante</strong>
        <p>O Despertar só pode ocorrer uma vez por personagem. Qualquer tentativa adicional gera Corrupção automática.</p>
      </div>

      <h3>Mecânica — Passo a passo (Savage Worlds)</h3>
      <p>O Despertar pode acontecer em qualquer momento da história, geralmente após contato intenso com Mana. Você pode usar estes passos para definir o Despertar de qualquer personagem, seja durante a criação ou dentro da narrativa.</p>

      <ul>
        <li><strong>Quando ocorre:</strong> ao tocar um Portal, sobreviver a uma explosão de Mana, passar por quase-morte, manejar um relicário antigo ou participar de um ritual.</li>
        <li><strong>Role a Origem:</strong> use 1d6 para definir como o Despertar começou.</li>
        <li><strong>Role a Sensação:</strong> use 1d8 para descrever a experiência física.</li>
        <li><strong>Role a Reação da Mana:</strong> use 1d10 para determinar a afinidade inicial e o "tom" da Mana que fluiu pelo corpo.</li>
        <li><strong>Role a Marca:</strong> use 1d12 para definir uma marca arcana ou transformação sutil, acompanhada de um efeito mecânico leve.</li>
        <li><strong>Escolha de Caminho:</strong> a afinidade da Mana orienta a escolha do Arquétipo inicial ou Especialização futura.</li>
        <li><strong>Recursos de Mana:</strong> personagens Despertados passam a utilizar Pontos de Poder (PP), usados para Runas, habilidades especiais e itens rúnicos.</li>
      </ul>

      <p>Despertares forçados podem existir — eles concedem maior poder imediato, mas trazem riscos narrativos como maldições, instabilidade mágica ou fragmentação de memória.</p>

      <div class="rule-box warning">
        <strong>Atenção</strong>
        <p>Despertares forçados concedem poder imediato, mas sempre geram Pontos de Corrupção.</p>
      </div>

      <h3>Tabelas — rolar no momento do Despertar</h3>

      <h4>Origem (1d6)</h4>
      <table>
        <thead>
          <tr>
            <th>d6</th>
            <th>Origem</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Explosão de Mana ao abrir um Portal</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Toque de uma criatura rúnica morrendo</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Contato com artefato ou relíquia antiga</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Participação em ritual arcano instável</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Trauma físico extremo (quase-morte)</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Chamado de uma entidade desconhecida</td>
          </tr>
        </tbody>
      </table>

      <h4>Sensação (1d8)</h4>
      <table>
        <thead>
          <tr>
            <th>d8</th>
            <th>Sensação</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Calor intenso no peito</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Clarão repentino e perda breve de sentidos</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Sensação de leveza, como flutuar</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Eco de uma voz ou memória estranha</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Veias brilhando por segundos</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Dor aguda seguida de calma profunda</td>
          </tr>
          <tr>
            <td>7</td>
            <td>Sombra movendo-se por conta própria</td>
          </tr>
          <tr>
            <td>8</td>
            <td>Percepção do tempo ficando lento</td>
          </tr>
        </tbody>
      </table>

      <h4>Reação da Mana (1d10) — Afinidade</h4>
      <table>
        <thead>
          <tr>
            <th>d10</th>
            <th>Tipo de Mana</th>
            <th>Características</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Fogosa</td>
            <td>Força e impacto físico; favorece combatentes agressivos</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Sombria</td>
            <td>Furtividade e manipulação de sombras</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Luminosa</td>
            <td>Cura e proteção</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Instável</td>
            <td>Poder alto, risco alto; efeitos caóticos</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Ancestral</td>
            <td>Vínculo com Runas e Relíquias</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Elemental</td>
            <td>Afinidade com fogo, vento, terra ou gelo</td>
          </tr>
          <tr>
            <td>7</td>
            <td>Bestial</td>
            <td>Força bruta e sentidos aguçados</td>
          </tr>
          <tr>
            <td>8</td>
            <td>Sábia</td>
            <td>Controle mágico refinado</td>
          </tr>
          <tr>
            <td>9</td>
            <td>Pura</td>
            <td>Interação intensa com Portais e selos</td>
          </tr>
          <tr>
            <td>10</td>
            <td>Corrompida</td>
            <td>Poder intenso acompanhado de mutações e riscos</td>
          </tr>
        </tbody>
      </table>

      <h4>Marca do Despertado (1d12)</h4>
      <table>
        <thead>
          <tr>
            <th>d12</th>
            <th>Marca</th>
            <th>Efeito mecânico</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Veias brilhantes</td>
            <td>Bônus em testes de controle de Mana 1x/sessão</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Olho alterado</td>
            <td>Detecta magia fraca em curto alcance</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Sombra viva</td>
            <td>Bônus em Furtividade 1x/sessão</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Aura quente</td>
            <td>Resistência temporária a frio 1x/sessão</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Aura fria</td>
            <td>Resistência temporária a fogo 1x/sessão</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Runa no peito</td>
            <td>Reduz dano mágico uma vez por sessão</td>
          </tr>
          <tr>
            <td>7</td>
            <td>Respiração pesada</td>
            <td>Bônus permanente em Vigor após um Rank</td>
          </tr>
          <tr>
            <td>8</td>
            <td>Voz dupla</td>
            <td>Bônus em Intimidação contra Despertados</td>
          </tr>
          <tr>
            <td>9</td>
            <td>Cabelo que muda</td>
            <td>Bônus social contra sensíveis à Mana</td>
          </tr>
          <tr>
            <td>10</td>
            <td>Cicatriz brilhante</td>
            <td>Redução passiva de dano mágico</td>
          </tr>
          <tr>
            <td>11</td>
            <td>Mãos frias</td>
            <td>Revela ilusões ao toque 1x/sessão</td>
          </tr>
          <tr>
            <td>12</td>
            <td>Forma astral</td>
            <td>Deslocamento curto instantâneo 1x/sessão</td>
          </tr>
        </tbody>
      </table>

      <h3>Exemplos práticos</h3>

      <h4>Exemplo 1 — Ferreiro</h4>
      <p>
        <strong>Origem:</strong> quase-morte.<br />
        <strong>Mana:</strong> ancestral.<br />
        <strong>Caminho:</strong> Arconte da Forja.<br />
        <strong>Marca:</strong> pele com linhas semelhantes à pedra — concede armadura rúnica 1x por sessão.
      </p>

      <h4>Exemplo 2 — Ladra</h4>
      <p>
        <strong>Origem:</strong> explosão de Mana ao abrir um Portal.<br />
        <strong>Mana:</strong> sombria.<br />
        <strong>Caminho:</strong> Slayer.<br />
        <strong>Marca:</strong> sombra viva — permite deslocamento instantâneo curto 1x por sessão.
      </p>

      <h3>Definindo Mana</h3>
      <p>
        A Mana é representada por Pontos de Poder (PP), usados para habilidades especiais, Runas e efeitos rúnicos.
      </p>
      <p>
        <strong>Recuperação de Mana:</strong><br />
        • Descanso breve: recuperação parcial, conforme regras da mesa.<br />
        • Descanso longo: recuperação total dos Pontos de Poder.
      </p>

      <p>Ajuste os valores conforme a necessidade de equilíbrio da campanha.</p>

      <div class="rule-box rule">
        <strong>Regra de Cálculo de Mana</strong>
        <p>Em Solo Leveling, o corpo é o receptáculo da energia.</p>
        <ul>
          <li><strong>Mana Base:</strong> Igual ao tipo do dado de <strong>Vigor</strong> (ex: Vigor d8 = 8 Mana).</li>
          <li><strong>Antecedente Arcano:</strong> Concede <strong>+10 Mana</strong> imediata.</li>
          <li><strong>Progressão:</strong> +2 Mana a cada novo <strong>Rank</strong> alcançado.</li>
          <li><strong>Vantagens:</strong> "Fluxo Rúnico" concede +5 Mana.</li>
        </ul>
      </div>
    `,
  },
  {
    id: "poder-unico-despertar",
    title: "Poder Único do Despertar",
    content: `
      <p>
        Ao atravessar o <strong>Despertar</strong>, cada Caçador manifesta um <strong>Poder Único</strong> — uma habilidade singular que define sua existência dentro do sistema de Portais.
      </p>

      <p>
        Esse poder não é uma Vantagem comum, não pode ser escolhido novamente e não pode ser copiado por outros personagens. Ele nasce da interação entre <strong>Mana, trauma, sobrevivência e destino</strong>.
      </p>

      <div class="box">
        <strong>Princípio Fundamental:</strong>
        Em Solo Leveling, dois Despertos nunca são iguais.
      </div>

      <h3>Regras Gerais</h3>
      <ul>
        <li>Todo personagem recebe <strong>1 Poder Único</strong> ao Despertar
        <li>Não ocupa slot de Vantagem</li>
        <li>Não custa XP</li>
        <li>Evolui automaticamente conforme o Rank</li>
        <li>Só pode ser obtido no Despertar inicial ou por evento narrativo extremo</li>
      </ul>

      <h3>Estrutura do Poder Único</h3>
      <p>Todo Poder Único é construído a partir da combinação de três pilares:</p>

      <div class="box">
        <strong>Fonte</strong> + <strong>Expressão</strong> + <strong>Gatilho</strong>
      </div>

      <h3>Tabela — Fonte do Poder</h3>
      <table>
        <tr>
          <th>d6</th>
          <th>Fonte</th>
          <th>Descrição</th>
        </tr>
        <tr>
          <td>1</td>
          <td>Mana Bruta</td>
          <td>Energia arcana em estado puro</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Corpo</td>
          <td>Capacidade física além do limite humano</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Alma</td>
          <td>Vontade, espírito e resistência mental</td>
        </tr>
        <tr>
          <td>4</td>
          <td>Sombra</td>
          <td>Morte, corrupção e vazio</td>
        </tr>
        <tr>
          <td>5</td>
          <td>Tempo</td>
          <td>Velocidade, antecipação e reflexo</td>
        </tr>
        <tr>
          <td>6</td>
          <td>Vínculo</td>
          <td>Invocações, pactos e ecos de poder</td>
        </tr>
      </table>

      <h3>Tabela — Expressão do Poder</h3>
      <table>
        <tr>
          <th>d8</th>
          <th>Expressão</th>
        </tr>
        <tr>
          <td>1</td>
          <td>Ataque Especial</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Defesa Reativa</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Transformação</td>
        </tr>
        <tr>
          <td>4</td>
          <td>Passiva Permanente</td>
        </tr>
        <tr>
          <td>5</td>
          <td>Área de Efeito</td>
        </tr>
        <tr>
          <td>6</td>
          <td>Invocação</td>
        </tr>
        <tr>
          <td>7</td>
          <td>Controle</td>
        </tr>
        <tr>
          <td>8</td>
          <td>Suporte</td>
        </tr>
      </table>

      <h3>Tabela — Gatilho de Ativação</h3>
      <table>
        <tr>
          <th>d6</th>
          <th>Gatilho</th>
        </tr>
        <tr>
          <td>1</td>
          <td>Gasto de Mana</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Ao sofrer dano</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Ao derrotar um inimigo</td>
        </tr>
        <tr>
          <td>4</td>
          <td>1x por cena</td>
        </tr>
        <tr>
          <td>5</td>
          <td>Condição específica</td>
        </tr>
        <tr>
          <td>6</td>
          <td>Sempre ativo (efeito reduzido)</td>
        </tr>
      </table>

      <h3>Escalonamento por Rank (SWADE)</h3>
      <table>
        <tr>
          <th>Rank</th>
          <th>Evolução do Poder</th>
        </tr>
        <tr>
          <td>Novato</td>
          <td>Efeito base</td>
        </tr>
        <tr>
          <td>Experiente</td>
          <td>+1 modificador ou bônus</td>
        </tr>
        <tr>
          <td>Veterano</td>
          <td>Efeito secundário adicional</td>
        </tr>
        <tr>
          <td>Heroico</td>
          <td>Redução de custo ou limitação</td>
        </tr>
        <tr>
          <td>Lendário</td>
          <td>Quebra de regra narrativa</td>
        </tr>
      </table>

      <h3>Limitações Obrigatórias</h3>

      <p>
        Todo Poder Único do Despertar deve possuir ao menos <strong>uma Limitação Obrigatória</strong>. Essas limitações existem para manter o equilíbrio, reforçar o tom narrativo e diferenciar poderes excepcionais de habilidades comuns.
      </p>

      <table>
        <tr>
          <th>#</th>
          <th>Limitação</th>
          <th>Efeito</th>
        </tr>
        <tr>
          <td>1</td>
          <td>Exaustão Física</td>
          <td>-1 em testes físicos até o fim da cena</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Dreno de Mana</td>
          <td>Custo adicional de +1 Mana por uso</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Corrupção Progressiva</td>
          <td>Gera 1 ponto de Corrupção por ativação</td>
        </tr>
        <tr>
          <td>4</td>
          <td>Tempo de Recarga</td>
          <td>Não pode ser usado novamente na mesma cena</td>
        </tr>
        <tr>
          <td>5</td>
          <td>Dor Intensa</td>
          <td>Fica Abalado após o uso</td>
        </tr>
        <tr>
          <td>6</td>
          <td>Instabilidade</td>
          <td>Em falha crítica, o efeito se espalha de forma imprevisível</td>
        </tr>
        <tr>
          <td>7</td>
          <td>Eco Arcano</td>
          <td>Atrai criaturas sensíveis à Mana</td>
        </tr>
        <tr>
          <td>8</td>
          <td>Marca Visível</td>
          <td>O uso deixa sinais físicos permanentes durante a cena</td>
        </tr>
        <tr>
          <td>9</td>
          <td>Dependência</td>
          <td>Se não usar o poder por muito tempo, sofre penalidade narrativa</td>
        </tr>
        <tr>
          <td>10</td>
          <td>Vulnerabilidade</td>
          <td>Fica Vulnerável até o próximo turno</td>
        </tr>
        <tr>
          <td>11</td>
          <td>Consumo de Essência</td>
          <td>Exige Essência Menor por ativação</td>
        </tr>
        <tr>
          <td>12</td>
          <td>Foco Total</td>
          <td>Não pode realizar ações adicionais nem manobras defensivas até o próximo turno</td>
        </tr>
        <tr>
          <td>13</td>
          <td>Preço Vital</td>
          <td>Converte 1d6 PV em Mana ou efeito</td>
        </tr>
        <tr>
          <td>14</td>
          <td>Resistência Mental</td>
          <td>Teste de Espírito ou fica Abalado</td>
        </tr>
        <tr>
          <td>15</td>
          <td>Tempo Limitado</td>
          <td>Duração fixa e curta, independente de Rank</td>
        </tr>
        <tr>
          <td>16</td>
          <td>Vínculo Emocional</td>
          <td>Só pode ser ativado sob condição emocional específica</td>
        </tr>
        <tr>
          <td>17</td>
          <td>Ressonância</td>
          <td>Impõe -1 em outros testes de Poder na cena</td>
        </tr>
        <tr>
          <td>18</td>
          <td>Instinto Predatório</td>
          <td>Obrigação narrativa de agir agressivamente após o uso</td>
        </tr>
        <tr>
          <td>19</td>
          <td>Chamado do Portal</td>
          <td>Portais próximos tornam-se instáveis</td>
        </tr>
        <tr>
          <td>20</td>
          <td>Observado</td>
          <td>Entidades maiores percebem imediatamente o uso</td>
        </tr>
      </table>

      <h3>Poderes Únicos Gerados</h3>

      <ul>
        <li><strong>Rei por um Instante:</strong> 1x/cena, +2 em Ataque e Dano por 1 rodada. Limitação: Exaustão Física.</li>
        <li><strong>Corpo que Aprende:</strong> sempre que sofre dano, ganha +1 Defesa (máx. +3). Limitação: Dependência.</li>
        <li><strong>Passo Entre Quadros:</strong> ignora completamente um ataque recebido. Limitação: Tempo de Recarga.</li>
        <li><strong>Sangue que Alimenta:</strong> converte 1d6 PV em 3 Mana. Limitação: Preço Vital.</li>
        <li><strong>Olhos do Abismo:</strong> detecta inimigos ocultos ou invisíveis em 12m. Limitação: Marca Visível.</li>
        <li><strong>Retorno Impossível:</strong> ao cair Incapacitado, levanta Abalado. Limitação: Corrupção Progressiva.</li>
        <li><strong>Campo de Sobrevivência:</strong> aliados adjacentes recebem +1 Defesa. Limitação: Foco Total.</li>
        <li><strong>Golpe que Atravessa:</strong> ataques ignoram Armadura 1x/turno. Limitação: Dreno de Mana.</li>
        <li><strong>Instinto de Caçador:</strong> vantagem em Iniciativa e Percepção. Limitação: Instinto Predatório.</li>
        <li><strong>Forma Emergencial:</strong> Força +2 por 1 rodada. Limitação: Dor Intensa.</li>
        <li><strong>Voz do Portal:</strong> interage com estruturas de Dungeon. Limitação: Observado.</li>
        <li><strong>Fôlego Impossível:</strong> ignora penalidades físicas por 1 cena. Limitação: Tempo Limitado.</li>
        <li><strong>Rastro de Mana:</strong> área causa dano leve contínuo. Limitação: Eco Arcano.</li>
        <li><strong>Presságio Letal:</strong> identifica a maior ameaça da cena. Limitação: Resistência Mental.</li>
        <li><strong>Escudo Reflexo:</strong> reduz dano recebido e reflete parte. Limitação: Vulnerabilidade.</li>
        <li><strong>Chamado da Sombra:</strong> invoca criatura menor por 1 rodada. Limitação: Consumo de Essência.</li>
        <li><strong>Memória de Batalha:</strong> reutiliza uma habilidade gasta. Limitação: Ressonância.</li>
        <li><strong>Avanço Inquebrável:</strong> ignora efeitos de controle de movimento. Limitação: Instabilidade.</li>
        <li><strong>Foco Absoluto:</strong> +2 em um atributo por cena. Limitação: Foco Total.</li>
        <li><strong>Vontade que Não Cede:</strong> não pode ficar Abalado 1x/cena. Limitação: Vínculo Emocional.</li>
      </ul>
    `,
  },
  {
    id: "evolucao-poder-unico",
    title: "Evolução do Poder Único por Rank",
    content: `
      <p>
        O Poder Único do Despertar não é estático. Assim como no universo de <em>Solo Leveling</em>, ele evolui conforme o Caçador sobrevive, enfrenta Dungeons mais perigosas e aprofunda sua conexão com a Mana.
      </p>

      <p>
        Em <strong>Savage Worlds Adventure Edition</strong>, essa evolução ocorre de forma estruturada a cada <strong>Rank</strong> do personagem.
      </p>

      <div class="box">
        <strong>Regra Básica:</strong><br />
        • Todo personagem começa com <strong>1 Poder Único (Forma Inicial)</strong>.<br />
        • A cada novo Rank, o jogador escolhe <strong>UMA melhoria</strong> para esse poder.<br />
        • As Limitações nunca desaparecem — elas evoluem junto com o poder.
      </div>

      <h3>Progressão por Rank</h3>

      <table>
        <tr>
          <th>Rank</th>
          <th>Evolução Permitida</th>
        </tr>
        <tr>
          <td><strong>Novato</strong></td>
          <td>Efeito básico, impacto limitado, ativação 1x/cena</td>
        </tr>
        <tr>
          <td><strong>Experiente</strong></td>
          <td>+1 bônus numérico OU redução de custo</td>
        </tr>
        <tr>
          <td><strong>Veterano</strong></td>
          <td>Novo efeito secundário OU melhora de alcance/duração</td>
        </tr>
        <tr>
          <td><strong>Heroico</strong></td>
          <td>Efeito narrativo relevante OU ativação automática em condição específica</td>
        </tr>
        <tr>
          <td><strong>Lendário</strong></td>
          <td>Forma Verdadeira — altera completamente o impacto da cena</td>
        </tr>
      </table>

      <h3>Exemplo de Evolução</h3>

      <div class="box">
        <strong>Poder Único: Rei por um Instante</strong><br /><br />

        <strong>Novato:</strong><br />
        +2 em Ataque e Dano por 1 rodada (1x/cena).<br /><br />

        <strong>Experiente:</strong><br />
        Duração aumenta para 2 rodadas OU custo reduzido em 1 Mana.<br /><br />

        <strong>Veterano:</strong><br />
        Ao ativar, remove automaticamente o estado Abalado.<br /><br />

        <strong>Heroico:</strong><br />
        Ativa automaticamente ao enfrentar um inimigo de Rank superior.<br /><br />

        <strong>Lendário:</strong><br />
        Uma vez por sessão, o personagem domina completamente a cena por 1 rodada (todos os aliados recebem +2 em testes ofensivos).
      </div>

      <p class="muted">
        O Mestre sempre pode exigir consequências narrativas proporcionais à evolução do poder, especialmente em Ranks Heroico e Lendário.
      </p>
    `,
  },
  {
    id: "corrupcao-por-mana",
    title: "Corrupção por Mana",
    content: `
      <p>
        O uso excessivo de Mana, Poderes Únicos e Artefatos provoca <strong>Corrupção</strong>. Ela representa o desgaste do corpo, da mente e do vínculo do Caçador com a realidade.
      </p>

      <p>
        Corrupção não é apenas penalidade mecânica — ela é uma <strong>ferramenta narrativa</strong>.
      </p>

      <div class="box">
        <strong>Quando ganhar Corrupção:</strong><br />
        • Usar Poder Único com Limitação de Corrupção<br />
        • Falhar criticamente ao usar Mana<br />
        • Forçar Despertar ou ultrapassar limites narrativos<br />
        • Interagir com Portais Monárquicos ou Artefatos Únicos
      </div>

      <h3>Tabela de Corrupção</h3>
      <table>
        <tr>
          <th>Pontos</th>
          <th>Estado</th>
          <th>Efeito</th>
        </tr>
        <tr>
          <td>0–2</td>
          <td>Estável</td>
          <td>Sem efeitos</td>
        </tr>
        <tr>
          <td>3–4</td>
          <td>Instável</td>
          <td>-1 em testes de Espírito ao resistir a medo ou controle</td>
        </tr>
        <tr>
          <td>5–6</td>
          <td>Corrompido Leve</td>
          <td>Manifesta sinais físicos ou comportamentais estranhos</td>
        </tr>
        <tr>
          <td>7–8</td>
          <td>Corrompido</td>
          <td>-1 em todos os testes sociais e mágicos</td>
        </tr>
        <tr>
          <td>9–10</td>
          <td>À Beira do Abismo</td>
          <td>O Mestre pode impor Complicações narrativas automáticas</td>
        </tr>
        <tr>
          <td>11+</td>
          <td>Colapso</td>
          <td>Transformação, perda de controle ou evento de campanha</td>
        </tr>
      </table>

      <h3>Reduzindo Corrupção</h3>
      <ul>
        <li>Descanso prolongado fora de Dungeons</li>
        <li>Rituais de purificação (custosos e raros)</li>
        <li>Decisões narrativas significativas</li>
        <li>Sacrifício permanente (atributos, Essência ou itens)</li>
      </ul>

      <p class="muted">A Corrupção nunca deve ser removida sem custo. Em Solo Leveling, poder sempre cobra seu preço.</p>
    `,
  },
  {
    id: "arquetipos-cacadores",
    title: "Arquétipos de Caçadores",
    content: `
      <p>
        Não existem dois Caçadores iguais. Enquanto a Mana determina seu <strong>Poder Único</strong>, são seus <strong>Arquétipos</strong> que refletem sua abordagem narrativa e tática preferida no cenário.
      </p>

      <p>
        Os arquétipos abaixo são <strong>guias temáticos</strong>, não classes obrigatórias. Eles fornecem listas de Vantagens recomendadas, atributos sugeridos e descrições narrativas para orientar sua criação de personagem em <strong>Savage Worlds</strong>.
      </p>

      <div class="box">
        <strong>Importante:</strong><br />
        • Você <strong>não precisa</strong> escolher um arquétipo para criar um personagem<br />
        • Cada arquétipo é uma sugestão, não uma restrição<br />
        • Você pode pegar Vantagens de <em>qualquer</em> arquétipo
        <br />
        • Multi-classe é natural desde Novato (escolha Vantagens de vários temas)
      </div>

      <h3>Os 10 Temas Narrativos</h3>

      <h4>1. O Guerreiro</h4>
      <p>
        <em>O combatente que canaliza Mana em força bruta e defesa inabalável.</em>
      </p>
      <p>
        O Guerreiro é o pilar da defesa em qualquer grupo. Ele enfrenta os piores inimigos, absorve o máximo de dano e cria espaço para que seus aliados atuem. Um Guerreiro versátil pode ser tão letal solo quanto em equipe.
      </p>
      <p><strong>Atributos Recomendados:</strong> Força d8+, Vigor d8+</p>
      <p><strong>Vantagens Recomendadas:</strong> Impacto Rúnico, Quebra-Defesas, Golpe Sísmico, Corpo Indomável, Avatar do Impacto</p>
      <p><strong>Perícias Chave:</strong> Lutar, Atletismo</p>

      <h4>2. O Assassino</h4>
      <p>
        <em>O especialista em morte rápida, posicionamento e pontos vitais.</em>
      </p>
      <p>
        O Assassino aproveita posicionamento e oportunidades. Ele não é tão durável quanto o Guerreiro, mas pode eliminar um inimigo inteiro em um turno bem executado. Perfeito para quem ama explorar as mecânicas de furtividade e dano crítico.
      </p>
      <p><strong>Atributos Recomendados:</strong> Agilidade d10+, Esperteza d6+</p>
      <p><strong>Vantagens Recomendadas:</strong> Lâmina Sombria, Passo Silencioso, Golpe de Ponto Vital, Assassino, Vulto</p>
      <p><strong>Perícias Chave:</strong> Furtividade, Lutar, Atirar</p>

      <h4>3. O Mago</h4>
      <p>
        <em>O canalista de Mana que controla campos de batalha com poder arcano puro.</em>
      </p>
      <p>
        O Mago não possui a tankabilidade do Guerreiro, mas sua capacidade de infligir dano massivo em múltiplos alvos o torna essencial contra hordas. Cada feitiço é uma escolha estratégica: ofensa, controle ou defesa.
      </p>
      <p><strong>Atributos Recomendados:</strong> Espírito d8+, Esperteza d6+</p>
      <p><strong>Vantagens Recomendadas:</strong> Escrita Rúnica, Amplificação Arcana, Campo Rúnico, Catalisador Vivo, Arcano Absoluto</p>
      <p><strong>Perícias Chave:</strong> Ocultismo, Concentração</p>

      <h4>4. O Paladino</h4>
      <p>
        <em>O protetor que canaliza Mana em cura, defesa e inspiração sagrada.</em>
      </p>
      <p>
        O Paladino é o guardião do grupo. Ele pode curar, proteger e inspirar aliados simultaneamente. Em equipes, é absolutamente vital. Solo, oferece sobrevivência estendida através de táticas defensivas.
      </p>
      <p><strong>Atributos Recomendados:</strong> Vigor d8+, Espírito d10+</p>
      <p><strong>Vantagens Recomendadas:</strong> Cura Abençoada, Luz Purificadora, Aura Restauradora, Milagre Menor, Avatar da Luz</p>
      <p><strong>Perícias Chave:</strong> Curar, Persuasão</p>

      <h4>5. O Caçador de Sombra</h4>
      <p>
        <em>O mestre da evasão que se move nas sombras com invisibilidade sobrenatural.</em>
      </p>
      <p>
        O Caçador de Sombra é quase impossível de acertar. Ele se move nas beiradas da realidade, observa, ataca quando ninguém espera e desaparece. Perfeito para Dungeons que exigem sutileza e reconhecimento.
      </p>
      <p><strong>Atributos Recomendados:</strong> Agilidade d10+, Espírito d6+</p>
      <p><strong>Vantagens Recomendadas:</strong> Rastejar nas Sombras, Instinto Arcano, Compasso Sombrio, Passo Silencioso</p>
      <p><strong>Perícias Chave:</strong> Furtividade, Percepção</p>

      <h4>6. O Invocador</h4>
      <p>
        <em>O comandante que invoca criaturas para lutar em seu lugar.</em>
      </p>
      <p>
        O Invocador nunca está sozinho. Suas bestas são peças poderosas no tabuleiro. Ele comanda, estrategiza e deixa que seus aliados sobrenaturais façam o trabalho duro enquanto ele planeja.
      </p>
      <p><strong>Atributos Recomendados:</strong> Espírito d10+, Esperteza d6+</p>
      <p><strong>Vantagens Recomendadas:</strong> Elo Sombrio, Comando Duplo, Horda Viva, Entidade Maior, Senhor das Criaturas</p>
      <p><strong>Perícias Chave:</strong> Ocultismo, Vínculo (Controle de Bestas)</p>

      <h4>7. O Berserker</h4>
      <p>
        <em>O devastador que canaliza Mana em fúria desenfreada e dano massivo.</em>
      </p>
      <p>
        O Berserker é risco e recompensa em forma humana. Ele entra em um estado de fúria onde seus golpes são mais mortíferos, mas mais previsíveis. Não é para os cautelosos, mas sim para quem quer destruir tudo rapidamente.
      </p>
      <p><strong>Atributos Recomendados:</strong> Força d12+, Vigor d8+</p>
      <p><strong>Vantagens Recomendadas:</strong> Frenesi, Brutamontes, Durão, Golpe Cortante, Furor de Guerra</p>
      <p><strong>Perícias Chave:</strong> Lutar, Atletismo</p>

      <h4>8. O Espadachim</h4>
      <p>
        <em>O artista marcial que flui como água através do combate.</em>
      </p>
      <p>
        O Espadachim flui como água. Ele esquiva, contra-ataca, aproveita momentum. Cada golpe é finamente calculado. Tecnicamente menos durável que o Guerreiro, mas infinitamente mais gracioso e mortífero no alcance próximo.
      </p>
      <p><strong>Atributos Recomendados:</strong> Agilidade d12+, Força d6+</p>
      <p><strong>Vantagens Recomendadas:</strong> Reflexo Ancestral, Contragolpe, Lâmina Sombria, Arremesso Perfeito</p>
      <p><strong>Perícias Chave:</strong> Lutar, Esquiva</p>

      <h4>9. O Explorador</h4>
      <p>
        <em>O arqueólogo de Dungeons que encontra tesouro e evita morte.</em>
      </p>
      <p>
        O Explorador é o arqueólogo do mundo de Portais. Ele encontra tesouro onde outros veem apenas ruínas, evita armadilhas que matariam qualquer um, e mapeia Dungeons secretas. Ganho de recursos excepcional.
      </p>
      <p><strong>Atributos Recomendados:</strong> Esperteza d10+, Percepção d8+</p>
      <p><strong>Vantagens Recomendadas:</strong> Percepção Aguçada, Instinto Arcano, Velocidade Guiada pela Mana, Domínio do Foco</p>
      <p><strong>Perícias Chave:</strong> Procurar, Reparar, Ladinagem</p>

      <h4>10. O Campeão</h4>
      <p>
        <em>O herói cuja presença inspira aliados e intimida inimigos.</em>
      </p>
      <p>
        O Campeão é o herói verdadeiro. Seu simples ato de estar ali inspira confiança. Se ele cai, o grupo sente. Se ele se levanta triunfante, o grupo é encorajado ao combate final. A presença dele importa narrativamente.
      </p>
      <p><strong>Atributos Recomendados:</strong> Vontade d10+, Vigor d8+</p>
      <p><strong>Vantagens Recomendadas:</strong> Caminho do Caçador Alfa, Furor de Guerra, Alma de Aço, Conduíte de Poder</p>
      <p><strong>Perícias Chave:</strong> Liderança, Intimidação, Lutar</p>

      <h3>Criando um Personagem Multi-Arquétipo</h3>

      <p>
        Em Savage Worlds, você não é obrigado a escolher um único arquétipo. Você pode combinar Vantagens de múltiplos temas para criar um personagem único.
      </p>

      <p><strong>Exemplo:</strong> Um "Defensor" poderia ser um personagem que escolhe Vantagens tanto de Guerreiro quanto de Paladino: <em>Impacto Rúnico</em> (Guerreiro) + <em>Cura Abençoada</em> (Paladino) + <em>Muralha Viva</em> (Tank) = um lutador que cura aliados próximos.</p>

      <p>
        Cada Avanço que você ganha permite escolher uma Vantagem da lista que preferir. Não há limite mecânico: você é tão flexível quanto Savage Worlds permite.
      </p>
    `,
  },
  {
    id: "vantagens-avancadas",
    title: "Vantagens Avançadas",
    content: `
      <p>
        As Vantagens Avançadas representam técnicas raras, mutações do Despertar ou domínio refinado da Mana. Elas são exclusivas do cenário <strong>SL Medieval</strong> e substituem vantagens genéricas do livro base.
      </p>

      <p>Cada Vantagem possui um <strong>pré-requisito de Rank</strong>. O Mestre pode impor requisitos narrativos adicionais.</p>

      <h3>Exemplos de Vantagens Gerais</h3>

      <h4>Rastejar nas Sombras (Novato)</h4>
      <p>+2 em Furtividade em pouca luz ou escuridão. 1x por sessão, teleporte curto de até 9m entre sombras.</p>

      <h4>Garras de Mana (Novato)</h4>
      <p>Ataques corpo a corpo causam +1d4 de dano imbuído de Mana (1 Mana por ataque).</p>

      <h4>Firmeza do Caçador (Novato)</h4>
      <p>+1 em testes de Espírito contra medo, intimidação e efeitos de dungeon.</p>

      <h4>Percepção Aguçada (Novato)</h4>
      <p>+2 em Percepção e ignora penalidades por camuflagem parcial.</p>

      <h4>Fluxo Rúnico (Novato)</h4>
      <p>+1 em um Atributo. Se possuir Mana, aumente a Mana Máxima em +5.</p>

      <h4>Ataque Fantasma (Experiente)</h4>
      <p>1x por turno, ao atacar inimigo isolado, cause +1d6 de dano adicional.</p>

      <h4>Marca de Predador (Experiente)</h4>
      <p>Gaste 1 Mana para marcar um alvo por 1 minuto. Cause +1d6 de dano contra ele.</p>

      <h4>Resistência às Runas (Experiente)</h4>
      <p>+2 em testes contra efeitos sobrenaturais. 2x por sessão, role novamente contra magias.</p>

      <h4>Reflexo Ancestral (Experiente)</h4>
      <p>1x por turno, ao sofrer dano, faça um teste Ágil para reduzir em metade.</p>

      <h4>Presságio Minuto (Experiente)</h4>
      <p>2x por sessão, role dois dados para manter concentração e escolha o melhor.</p>

      <h4>Velocidade Guiada pela Mana (Veterano)</h4>
      <p>Deslocamento +3m. 1x por sessão, ganhe +6m por 1 rodada.</p>

      <h4>Instinto Arcano (Veterano)</h4>
      <p>Detecta automaticamente magia ativa em até 6m.</p>

      <h4>Arremesso Perfeito (Heroico)</h4>
      <p>Ataques à distância ignoram meia cobertura e penalidades de alcance médio.</p>

      <h4>Golpe Cortante (Heroico)</h4>
      <p>Críticos causam +1d8 de dano adicional.</p>

      <h4>Reflexos de Caçador (Heroico)</h4>
      <p>1x por sessão, aja normalmente mesmo se Surpreso.</p>

      <h4>Sangue Arcano (Heroico)</h4>
      <p>1x por sessão, converta 5 PV em 3 Mana.</p>

      <h4>Compasso Sombrio (Heroico)</h4>
      <p>1x por sessão, detecta criaturas mágicas ou Portais em 18m.</p>

      <h4>Furor de Guerra (Lendário)</h4>
      <p>Ao reduzir um inimigo a 0 PV, receba +2 Defesa até seu próximo turno.</p>

      <h4>Alma de Aço (Lendário)</h4>
      <p>+2 em testes contra paralisia, petrificação e aprisionamento.</p>

      <h4>Conduíte de Poder (Lendário)</h4>
      <p>1x por sessão, dobre o alcance de um Poder de alvo único.</p>

      <h4>Mestre da Batalha Interior (Lendário)</h4>
      <p>1x por sessão, recupere um uso de habilidade especial.</p>

      <h4>Caminho do Caçador Alfa (Lendário)</h4>
      <p>+2 em Iniciativa. Se agir primeiro, +1d6 de dano no primeiro ataque.</p>

      <h3>Vantagens Exclusivas de Arquétipo</h3>

      <h4>Guerreiro — Impacto Rúnico (Novato)</h4>
      <p>Ataques corpo a corpo podem gastar 1 Mana para +1d6 dano.</p>

      <h4>Guerreiro — Quebra-Defesas (Experiente)</h4>
      <p>Ignora 2 pontos de Defesa ao atacar estruturas ou inimigos blindados.</p>

      <h4>Guerreiro — Golpe Sísmico (Veterano)</h4>
      <p>1x por sessão, ataque em área de 3m que derruba inimigos.</p>

      <h4>Guerreiro — Corpo Indomável (Heroico)</h4>
      <p>Imune a empurrões e quedas forçadas enquanto possuir Mana.</p>

      <h4>Guerreiro — Avatar do Impacto (Lendário)</h4>
      <p>Por 1 minuto, todo ataque causa +1d8 de dano adicional.</p>

      <h4>Mago — Escrita Rúnica (Novato)</h4>
      <p>Poderes ofensivos recebem +1 no dano.</p>

      <h4>Mago — Amplificação Arcana (Experiente)</h4>
      <p>1x por rodada, aumente o dano de um Poder em +1d6.</p>

      <h4>Mago — Campo Rúnico (Veterano)</h4>
      <p>Área mágica concede desvantagem a inimigos.</p>

      <h4>Mago — Catalisador Vivo (Heroico)</h4>
      <p>Críticos mágicos recuperam 1 Mana.</p>

      <h4>Mago — Arcano Absoluto (Lendário)</h4>
      <p>Poderes ignoram resistência mágica.</p>

      <h4>Invocador — Elo Sombrio (Novato)</h4>
      <p>Invocações recebem +1 Defesa.</p>

      <h4>Invocador — Comando Duplo (Experiente)</h4>
      <p>Controle duas criaturas sem penalidade.</p>

      <h4>Invocador — Horda Viva (Veterano)</h4>
      <p>Invocações causam +1d6 quando atacam juntas.</p>

      <h4>Invocador — Entidade Maior (Heroico)</h4>
      <p>Invoca criatura única poderosa.</p>

      <h4>Invocador — Senhor das Criaturas (Lendário)</h4>
      <p>Invocações agem imediatamente ao surgir.</p>

      <h4>Curandeiro — Cura Abençoada (Novato)</h4>
      <p>Curas restauram +1d6 PV.</p>

      <h4>Curandeiro — Luz Purificadora (Experiente)</h4>
      <p>Remove medo, veneno ou corrupção leve.</p>

      <h4>Curandeiro — Aura Restauradora (Veterano)</h4>
      <p>Aliados próximos recuperam 1 PV por rodada.</p>

      <h4>Curandeiro — Milagre Menor (Heroico)</h4>
      <p>1x por sessão, cura massiva imediata.</p>

      <h4>Curandeiro — Avatar da Luz (Lendário)</h4>
      <p>Curas dobradas por 1 minuto.</p>

      <h4>Metamorfo — Forma Animal (Novato)</h4>
      <p>Assume forma animal básica 1x por sessão.</p>

      <h4>Metamorfo — Presas Naturais (Experiente)</h4>
      <p>Ataques naturais causam +1d6 dano.</p>

      <h4>Metamorfo — Pele Espessa (Veterano)</h4>
      <p>+2 Defesa enquanto transformado.</p>

      <h4>Metamorfo — Fera Superior (Heroico)</h4>
      <p>Formas ganham habilidades especiais.</p>

      <h4>Metamorfo — Espírito Ancestral (Lendário)</h4>
      <p>Transformação sem custo por 1 minuto.</p>

      <h4>Arqueiro — Disparo Rúnico (Novato)</h4>
      <p>Gaste 1 Mana para dobrar o alcance ou causar +1d6 de dano.</p>

      <h4>Arqueiro — Flecha Fantasma (Experiente)</h4>
      <p>Ignora penalidades de cobertura e escudos.</p>

      <h4>Arqueiro — Chuva de Mana (Veterano)</h4>
      <p>Ataque em área (Modelo Pequeno) com dano da arma.</p>

      <h4>Arqueiro — Olho do Predador (Heroico)</h4>
      <p>+2 em ataques contra alvos que se moveram neste turno.</p>

      <h4>Arqueiro — A Morte Silenciosa (Lendário)</h4>
      <p>Se o alvo não te viu, o dano é dobrado.</p>

      <h4>Ladino — Lâmina Sombria (Novato)</h4>
      <p>Gaste 1 Mana para causar +1d6 de dano se tiver vantagem.</p>

      <h4>Ladino — Passo Silencioso (Experiente)</h4>
      <p>Move-se em velocidade total furtivamente sem penalidade.</p>

      <h4>Ladino — Golpe de Ponto Vital (Veterano)</h4>
      <p>Gaste 2 Mana para ignorar Armadura em ataque furtivo.</p>

      <h4>Ladino — Vulto (Heroico)</h4>
      <p>-2 para ser atingido por ataques à distância.</p>

      <h4>Ladino — Executor (Lendário)</h4>
      <p>Ataques furtivos bem sucedidos são automaticamente Críticos.</p>
    `,
  },
  {
    id: "itens-runicos",
    title: "Itens Rúnicos",
    content: `
      <p>
        Itens Rúnicos são artefatos imbuídos de Mana através de rituais, essências e fragmentos oriundos de Dungeons e Portais. Eles substituem os Itens Mágicos tradicionais de sistemas medievais e seguem uma progressão clara inspirada no Despertar.
      </p>

      <h3>Raridades de Itens Rúnicos</h3>
      <ul>
        <li><strong>Comum:</strong> bônus simples, sem custo narrativo.</li>
        <li><strong>Especial:</strong> efeitos ativos ou condicionais.</li>
        <li><strong>Raro:</strong> habilidades poderosas, custo em Mana.</li>
        <li><strong>Lendário:</strong> efeitos únicos, impacto narrativo.</li>
      </ul>

      <h3>Itens Rúnicos — Comuns</h3>
      <ul>
        <li><strong>Anel do Foco:</strong> +1 em testes de Espírito para manter concentração.</li>
        <li><strong>Botas do Explorador:</strong> +3m de deslocamento fora de combate.</li>
        <li><strong>Capa de Couro Rúnico:</strong> +1 Defesa contra ataques à distância.</li>
        <li><strong>Amuleto da Vigília:</strong> +2 em Percepção para emboscadas.</li>
        <li><strong>Lâmina Afiada:</strong> Arma causa +1 dano fixo.</li>
        <li><strong>Luvas de Impacto:</strong> Ataques desarmados causam +1d4 dano.</li>
        <li><strong>Talismã de Resistência:</strong> 1x/dia, reduza dano recebido em 2.</li>
        <li><strong>Cinto da Força Menor:</strong> +1 em testes de Força.</li>
      </ul>

      <h3>Artefatos Únicos</h3>
      <p>Artefatos são Itens Rúnicos conscientes ou semi-conscientes. Diferente de itens lendários, eles <strong>escolhem seu portador</strong> e impõem vontades, condições e consequências narrativas.</p>

      <ul>
        <li><strong>Coração do Monarca Sombrio:</strong> Mana máxima +15. 1x/combate, ressuscite ao cair a 0 PV (ganha corrupção permanente).</li>
        <li><strong>Lâmina que Sussurra Nomes:</strong> +2 ataque e dano. Ao derrotar inimigos, revela segredos.</li>
        <li><strong>Grimório do Vazio Pulsante:</strong> Concede 2 Poderes adicionais (até Rank Heroico).</li>
      </ul>
    `,
  },
  {
    id: "tabelas-loot-progressao",
    title: "Tabelas de Loot & Progressão",
    content: `
      <p>
        O sistema de loot é um dos pilares do cenário. Caçadores evoluem não apenas através de experiência, mas principalmente por meio de <strong>Essências</strong>, <strong>Runas</strong> e <strong>Itens Rúnicos</strong> obtidos em Dungeons.
      </p>

      <h3>Essências</h3>
      <p>Essências são fragmentos condensados de Mana extraídos de criaturas, chefes de Dungeon, Portais instáveis ou eventos mágicos raros.</p>

      <table>
        <thead>
          <tr>
            <th>Essência</th>
            <th>Uso Principal</th>
            <th>Raridade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Essência Menor</td>
            <td>Melhorias simples, ativação de Runas básicas</td>
            <td>Comum</td>
          </tr>
          <tr>
            <td>Essência Média</td>
            <td>Forja de armas e armaduras aprimoradas (Rank Novato–Experiente)</td>
            <td>Incomum</td>
          </tr>
          <tr>
            <td>Essência Maior</td>
            <td>Criação de Itens Rúnicos, rituais e upgrades avançados</td>
            <td>Rara</td>
          </tr>
          <tr>
            <td>Essência Primordial</td>
            <td>Requisitos para itens lendários e Artefatos</td>
            <td>Muito Rara</td>
          </tr>
        </tbody>
      </table>

      <h3>Runas</h3>
      <p>Runas são símbolos arcanos que canalizam Mana de forma controlada. Podem ser consumíveis, incrustadas em equipamentos ou ativadas temporariamente.</p>

      <ul>
        <li><strong>Runa da Força:</strong> +1 Força por 24 horas</li>
        <li><strong>Runa da Velocidade:</strong> +3m de movimento</li>
        <li><strong>Runa da Sombra:</strong> Vantagem em Furtividade 1x/dia</li>
        <li><strong>Runa da Vitalidade:</strong> Recupere 1d6 PV ao derrotar um inimigo (1x/combate)</li>
        <li><strong>Runa da Proteção:</strong> +1 Defesa contra o primeiro ataque sofrido</li>
        <li><strong>Runa do Impacto:</strong> +2 dano em ataques corpo a corpo 1x/rodada</li>
      </ul>

      <h3>Progressão de Loot por Rank</h3>
      <table>
        <thead>
          <tr>
            <th>Rank do Caçador</th>
            <th>Loot Comum</th>
            <th>Loot Raro</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Novato</td>
            <td>Essência Menor, Runas básicas</td>
            <td>Essência Média (baixa chance)</td>
          </tr>
          <tr>
            <td>Experiente</td>
            <td>Essência Média, Itens aprimorados</td>
            <td>Item Rúnico comum</td>
          </tr>
          <tr>
            <td>Veterano</td>
            <td>Essência Maior, Runas avançadas</td>
            <td>Item Rúnico raro</td>
          </tr>
          <tr>
            <td>Heroico</td>
            <td>Itens Rúnicos raros</td>
            <td>Lendários (condicional)</td>
          </tr>
          <tr>
            <td>Lendário</td>
            <td>Lendários consistentes</td>
            <td>Artefatos (eventos únicos)</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: "exemplos-personagens",
    title: "Exemplos de Personagens (SWADE)",
    content: `
      <p>
        Os exemplos abaixo representam Caçadores em diferentes <strong>Ranks</strong> do Savage Worlds. Eles não substituem fichas completas, mas servem como referência clara de construção, progressão e identidade mecânica dentro do cenário Solo Leveling Medieval.
      </p>

      <h2>Rank: Novato</h2>

      <h4>Lucas Brandt — Guerreiro (Assaulter)</h4>
      <p><strong>Atributos:</strong> Agilidade d6, Esperteza d6, Espírito d6, Força d8, Vigor d8</p>
      <p><strong>Perícias:</strong> Lutar d8, Atletismo d6, Intimidação d6, Percepção d6</p>
      <p><strong>Vantagens:</strong> Impacto Rúnico, Brutamontes</p>
      <p><strong>Mana:</strong> 8</p>
      <p><strong>Poder Único:</strong> Golpe Rúnico - gastar 1 Mana para +2 dano corpo a corpo</p>

      <h4>Ana Kuroda — Arqueira</h4>
      <p><strong>Atributos:</strong> Agilidade d8, Esperteza d6, Espírito d6, Força d6, Vigor d6</p>
      <p><strong>Perícias:</strong> Atirar d8, Furtividade d6, Percepção d8</p>
      <p><strong>Vantagens:</strong> Disparo Rúnico</p>
      <p><strong>Mana:</strong> 6</p>
      <p><strong>Poder Único:</strong> Tiro Concentrado - gastar 1 Mana para ignorar cobertura leve</p>

      <h2>Rank: Experiente</h2>

      <h4>Alex Mercer — Guerreiro de Impacto</h4>
      <p><strong>Atributos:</strong> Agilidade d6, Esperteza d6, Espírito d8, Força d10, Vigor d8</p>
      <p><strong>Perícias:</strong> Lutar d10, Atletismo d8, Intimidação d8</p>
      <p><strong>Vantagens:</strong> Quebra-Defesas, Frenesi, Durão</p>
      <p><strong>Mana:</strong> 12</p>
      <p><strong>Poder Único:</strong> Carga Implacável - gastar 2 Mana para mover +4m e causar +2 dano</p>

      <h4>Maya Rivers — Assassina das Sombras</h4>
      <p><strong>Atributos:</strong> Agilidade d10, Esperteza d6, Espírito d8, Força d6, Vigor d6</p>
      <p><strong>Perícias:</strong> Lutar d8, Furtividade d10, Atirar d8, Percepção d8</p>
      <p><strong>Vantagens:</strong> Assassino, Passo Silencioso</p>
      <p><strong>Mana:</strong> 10</p>
      <p><strong>Poder Único:</strong> Teleporte Sombrio - gastar 2 Mana para mover até 6m ignorando obstáculos</p>

      <h2>Rank: Veterano e Superior</h2>
      <p>Personagens veteranos, heroicos e lendários disponem de mais Atributos aprimorados, várias Vantagens avançadas e Poderes únicos mais potentes. Consulte o manual para detalhes completos.</p>
    `,
  },
  {
    id: "regras-avancadas-dungeons",
    title: "Regras Avançadas de Dungeons",
    content: `
      <p>
        Dungeons não são apenas mapas com inimigos. Elas são ambientes hostis, mutáveis e reativos à presença dos Caçadores. Este módulo apresenta regras avançadas para armadilhas, corrupção por Mana, eventos dinâmicos e estrutura de chefes, criando ritmo, tensão e decisões significativas durante a exploração.
      </p>

      <h3>Armadilhas Rúnicas</h3>
      <p>Armadilhas rúnicas são manifestações automáticas de Mana instável. Elas podem ser detectadas, evitadas ou ativadas acidentalmente.</p>

      <ul>
        <li><strong>Runa Explosiva:</strong> Efeito: 2d8 de dano de fogo em área pequena. Teste: Agilidade para evitar.</li>
        <li><strong>Garganta de Pedra:</strong> Efeito: 1d10 de dano ao cair. Teste: Força para se segurar.</li>
        <li><strong>Pilar Esmagador:</strong> Efeito: 3d10 de dano por esmagamento. Teste: Percepção para antecipar.</li>
      </ul>

      <h3>Modo de Corrupção</h3>
      <p>Permanecer tempo demais em uma Dungeon sobrecarrega o corpo. A Mana começa a corromper o Caçador:</p>
      <ul>
        <li><strong>1 hora:</strong> -1 na recuperação de Mana</li>
        <li><strong>2 horas:</strong> -1 em testes físicos</li>
        <li><strong>3+ horas:</strong> 1 nível de Fadiga + chance de mutação rúnica</li>
      </ul>

      <h3>Script de Chefe</h3>
      <p>Chefes de Dungeon seguem padrões, reagem ao combate e forçam o grupo a se adaptar:</p>
      <ul>
        <li><strong>Fase 1:</strong> Padrões simples, ataques previsíveis</li>
        <li><strong>Gatilho 1 (≈75%):</strong> Mudança ambiental, inimigos menores surgem</li>
        <li><strong>Fase 2:</strong> Mecânicas complexas, exigindo movimento e coordenação</li>
        <li><strong>Gatilho 2 (≈40%):</strong> Chefe ativa escudo, regeneração ou efeito especial</li>
        <li><strong>Fase Final:</strong> Ataque letal com sinalização clara</li>
      </ul>
    `,
  },
  {
    id: "origem-dos-portais",
    title: "Origem dos Portais",
    content: `
      <p>
        Os Portais são o elemento central do cenário. Eles não são apenas passagens para masmorras, mas cicatrizes na realidade, deixadas por um evento antigo que alterou o mundo para sempre.
      </p>

      <h3>A Grande Ruptura do Véu</h3>
      <p>
        Aproximadamente duzentos anos atrás, algo rompeu o <strong>Véu</strong> — a barreira invisível que separava o mundo material de outros planos. Esse evento ficou conhecido como <strong>A Grande Ruptura</strong>.
      </p>

      <p>
        Quando o Véu se fragilizou, um fluxo massivo de Mana vazou para o mundo. Onde essa energia tocou o solo, a realidade se dobrou, formando os primeiros <strong>Portais</strong>.
      </p>

      <p>
        Regiões inteiras foram remodeladas: florestas cresceram de forma antinatural, montanhas se partiram, criaturas comuns sofreram mutações e relíquias ancestrais despertaram após séculos adormecidas.
      </p>

      <h3>Tipos de Portais</h3>
      <ul>
        <li><strong>Fendas Menores (Ranks E / D):</strong> Instáveis, curta duração, poucos inimigos. Para missões rápidas e testes.</li>
        <li><strong>Templos Antigos (Rank C):</strong> Estruturas reativadas, enigmas, armadilhas, sub-chefes.</li>
        <li><strong>Fortalezas Corrompidas (Ranks B / A):</strong> Complexos extensos, múltiplas salas, eventos aleatórios.</li>
        <li><strong>Portais Monárquicos (Rank S):</strong> Eventos catastróficos, consequências permanentes, chefes multifásicos.</li>
      </ul>

      <h3>Ciclos dos Portais</h3>
      <p>Nem todos os Portais surgem aleatoriamente. Algumas regiões apresentam <strong>ciclos</strong>, onde Portais "adormecem" e despertam novamente após anos ou décadas.</p>
      <ul>
        <li>Portais sazonais (eclipses, solstícios, luas)</li>
        <li>Portais reativos a grandes eventos mágicos</li>
        <li>Portais ligados a relíquias específicas</li>
        <li>Portais despertados por rituais ou sacrifícios</li>
      </ul>
    `,
  },
  {
    id: "guia-de-guildas",
    title: "Guia de Guildas",
    content: `
      <p>
        As <strong>Guildas</strong> surgiram como resposta direta à proliferação dos Portais. Elas organizam Caçadores, distribuem contratos, controlam recursos rúnicos e exercem influência política e econômica nas regiões onde atuam.
      </p>

      <h3>Funções das Guildas</h3>
      <ul>
        <li>Gerenciamento e distribuição de contratos de Dungeon</li>
        <li>Treinamento e mentoria de novos Caçadores</li>
        <li>Pesquisa e armazenamento de Essências e Itens Rúnicos</li>
        <li>Proteção de territórios e populações civis</li>
        <li>Negociação com governos, reinos e facções independentes</li>
      </ul>

      <h3>Modelos de Guilda</h3>

      <h4>Lâmina Branca</h4>
      <p><strong>Foco:</strong> Combate direto e eliminação rápida</p>
      <ul>
        <li>Disciplina marcial e eficiência brutal</li>
        <li>Acesso a armas rúnicas de impacto</li>
        <li>Contratos frequentes de Portais Rank C e B</li>
        <li>Alta taxa de mortalidade, mas grande prestígio</li>
      </ul>

      <h4>Círculo Arcanum</h4>
      <p><strong>Foco:</strong> Mana, pesquisa e conhecimento</p>
      <ul>
        <li>Acesso a grimórios e laboratórios</li>
        <li>Pesquisas sobre Essências raras e artefatos</li>
        <li>Missões de coleta, análise e contenção</li>
        <li>Influência acadêmica e política</li>
      </ul>

      <h4>Escudos de Ferro</h4>
      <p><strong>Foco:</strong> Defesa, suporte e estabilidade</p>
      <ul>
        <li>Especialização em suporte, cura e controle</li>
        <li>Fornecimento de poções e itens defensivos</li>
        <li>Missões de escolta e defesa</li>
        <li>Baixa mortalidade e reputação confiável</li>
      </ul>

      <h3>Progressão Interna</h3>
      <table>
        <thead>
          <tr>
            <th>Posição</th>
            <th>Descrição</th>
            <th>Benefícios</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Novato</strong></td>
            <td>Recém-ingresso, sob supervisão</td>
            <td>Contratos Rank E/D, acesso básico</td>
          </tr>
          <tr>
            <td><strong>Operador</strong></td>
            <td>Ativo e confiável</td>
            <td>Contratos Rank C, bônus em recompensas</td>
          </tr>
          <tr>
            <td><strong>Veterano</strong></td>
            <td>Experiente, referência interna</td>
            <td>Acesso a Essências raras, prioridade</td>
          </tr>
          <tr>
            <td><strong>Capitão</strong></td>
            <td>Líder de esquadrões</td>
            <td>Comando de equipes, influência interna</td>
          </tr>
          <tr>
            <td><strong>Líder</strong></td>
            <td>Comando máximo</td>
            <td>Controle estratégico, artefatos únicos</td>
          </tr>
        </tbody>
      </table>
    `,
  },
];

export default manualSections;
