export const HINDRANCES = [
  {name: "Analfabeto", type: "Menor", description: "Não sabe ler ou escrever."},
  {
    name: "Anêmico",
    type: "Menor",
    description: "-2 em testes de Vigor para resistir a fadiga/doença.",
  },
  {
    name: "Arrogante",
    type: "Maior",
    description: "Procura vencer o líder inimigo sozinho.",
  },
  {
    name: "Boca Grande",
    type: "Menor",
    description: "Não consegue guardar segredos.",
  },
  {
    name: "Cabeça-Quente (Menor)",
    type: "Menor",
    description: "-1 em testes de Provocar; irrita-se fácil.",
  },
  {
    name: "Cabeça-Quente (Maior)",
    type: "Maior",
    description: "-2 em testes de Provocar; irrita-se fácil.",
  },
  {
    name: "Cauteloso",
    type: "Menor",
    description: "Planeja demais, hesita em agir.",
  },
  {
    name: "Cego",
    type: "Maior",
    description: "-6 em tarefas visuais; ganha Vantagem extra.",
  },
  {
    name: "Código de Honra",
    type: "Maior",
    description: "Mantém a palavra, protege os fracos.",
  },
  {
    name: "Confiante Demais",
    type: "Maior",
    description: "Acredita que pode fazer qualquer coisa.",
  },
  {name: "Covarde", type: "Maior", description: "-2 em testes de Medo."},
  {
    name: "Curioso",
    type: "Maior",
    description: "Tem que investigar mistérios.",
  },
  {
    name: "Delirante (Menor)",
    type: "Menor",
    description: "Acredita em algo que não é verdade.",
  },
  {
    name: "Delirante (Maior)",
    type: "Maior",
    description: "Acredita em algo que não é verdade (Grave).",
  },
  {name: "Desagradável", type: "Menor", description: "-2 em Persuadir."},
  {
    name: "Desastrado",
    type: "Menor",
    description: "-2 em Furtividade; faz barulho.",
  },
  {
    name: "Desajeitado",
    type: "Menor",
    description: "-2 em Consertar; quebra coisas mecânicas.",
  },
  {
    name: "Desejo de Morte",
    type: "Menor",
    description: "Quer morrer de forma heroica.",
  },
  {
    name: "Desleal",
    type: "Menor",
    description: "Trai o grupo se for vantajoso.",
  },
  {
    name: "Determinado (Menor)",
    type: "Menor",
    description: "Não desiste de seus objetivos.",
  },
  {
    name: "Determinado (Maior)",
    type: "Maior",
    description: "Não desiste de seus objetivos (Obsessão).",
  },
  {
    name: "Duro de Ouvido (Menor)",
    type: "Menor",
    description: "-4 em Perceber auditivo.",
  },
  {name: "Duro de Ouvido (Maior)", type: "Maior", description: "Surdo."},
  {
    name: "Feio",
    type: "Menor",
    description: "-2 em Persuadir; atraente para poucos.",
  },
  {
    name: "Forasteiro",
    type: "Menor",
    description: "-2 em Persuadir; não conhece costumes locais.",
  },
  {name: "Frágil (Menor)", type: "Menor", description: "-1 Resistência."},
  {name: "Frágil (Maior)", type: "Maior", description: "-2 Resistência."},
  {
    name: "Fúria Incontrolável",
    type: "Maior",
    description: "Entra em frenesi ao sofrer dano ou falhar.",
  },
  {
    name: "Ganancioso (Menor)",
    type: "Menor",
    description: "Obcecado por riqueza.",
  },
  {
    name: "Ganancioso (Maior)",
    type: "Maior",
    description: "Faz qualquer coisa por riqueza.",
  },
  {
    name: "Hábito (Menor)",
    type: "Menor",
    description: "Vício ou mania que atrapalha.",
  },
  {
    name: "Hábito (Maior)",
    type: "Maior",
    description: "Vício ou mania que atrapalha (Grave).",
  },
  {name: "Heroico", type: "Maior", description: "Sempre ajuda quem precisa."},
  {
    name: "Hesitante",
    type: "Menor",
    description: "Compra duas cartas de iniciativa e fica com a pior.",
  },
  {
    name: "Idoso",
    type: "Maior",
    description: "-1 Força/Vigor, +5 pontos de perícia.",
  },
  {name: "Impulsivo", type: "Maior", description: "Age sem pensar."},
  {
    name: "Inimigo (Menor)",
    type: "Menor",
    description: "Alguém quer te atrapalhar.",
  },
  {
    name: "Inimigo (Maior)",
    type: "Maior",
    description: "Alguém quer te matar.",
  },
  {
    name: "Invejoso (Menor)",
    type: "Menor",
    description: "Cobiça o que os outros têm.",
  },
  {
    name: "Invejoso (Maior)",
    type: "Maior",
    description: "Cobiça e age contra quem tem.",
  },
  {name: "Leal", type: "Menor", description: "Nunca abandona um amigo."},
  {
    name: "Ligação com a Natureza",
    type: "Maior",
    description: "Não usa tecnologia ou metal.",
  },
  {name: "Má Sorte", type: "Maior", description: "Menos 1 Benne por sessão."},
  {
    name: "Maneta",
    type: "Maior",
    description: "-4 em tarefas que exigem duas mãos.",
  },
  {
    name: "Mudo",
    type: "Maior",
    description: "Não pode falar; comunicação difícil.",
  },
  {name: "Não Nada", type: "Menor", description: "-2 em Atletismo para nadar."},
  {
    name: "Obcecado (Menor)",
    type: "Menor",
    description: "Focado em um objetivo único.",
  },
  {
    name: "Obcecado (Maior)",
    type: "Maior",
    description: "Focado em um objetivo único (Total).",
  },
].sort((a, b) => a.name.localeCompare(b.name));
