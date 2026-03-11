export const DEFAULT_GAME_SESSION = {
  isActive: false,
  lockedFields: [],
};

export const SHEET_LOCK_GROUPS = [
  {
    id: "dados-principais",
    title: "Dados Principais",
    items: [
      {key: "nome", label: "Nome do Personagem"},
      {key: "jogador", label: "Jogador"},
      {key: "conceito", label: "Conceito"},
      {key: "arquetipo", label: "Arquétipo"},
      {key: "guilda", label: "Guilda"},
      {key: "rank", label: "Rank"},
      {key: "xp", label: "XP"},
      {key: "riqueza", label: "Riqueza"},
    ],
  },
  {
    id: "aparencia",
    title: "Aparência Física",
    items: [
      {key: "idade", label: "Idade"},
      {key: "altura", label: "Altura"},
      {key: "peso", label: "Peso"},
      {key: "cabelos", label: "Cabelos"},
      {key: "olhos", label: "Olhos"},
      {key: "pele", label: "Pele"},
      {key: "imagem_url", label: "Imagem do Personagem"},
    ],
  },
  {
    id: "atributos",
    title: "Atributos Base",
    items: [
      {key: "agilidade", label: "Agilidade"},
      {key: "intelecto", label: "Intelecto"},
      {key: "espirito", label: "Espírito"},
      {key: "forca", label: "Força"},
      {key: "vigor", label: "Vigor"},
    ],
  },
  {
    id: "historia",
    title: "Histórico & Personalidade",
    items: [{key: "descricao", label: "Descrição & Histórico"}],
  },
  {
    id: "despertar",
    title: "Despertar",
    items: [
      {key: "despertar_origem", label: "Origem do Despertar"},
      {key: "despertar_sensacao", label: "Sensação do Despertar"},
      {key: "despertar_afinidade", label: "Afinidade do Despertar"},
      {key: "despertar_marca", label: "Marca do Despertar"},
      {key: "poder_unico_fonte", label: "Fonte do Poder"},
      {key: "poder_unico_expressao", label: "Expressão do Poder"},
      {key: "poder_unico_gatilho", label: "Gatilho do Poder"},
      {key: "recursos_despertar", label: "Recurso do Despertar"},
    ],
  },
  {
    id: "combate",
    title: "Combate",
    items: [
      {key: "mana_atual", label: "Mana Atual"},
      {key: "abalado", label: "Status Abalado"},
      {key: "ferimentos", label: "Ferimentos"},
      {key: "fadiga", label: "Fadiga"},
      {key: "aparar_bonus", label: "Bônus de Aparar"},
      {key: "armadura_bonus", label: "Bônus de Resistência"},
      {key: "bencaos", label: "Bênçãos"},
      {key: "movimento", label: "Movimento"},
      {key: "lesoes", label: "Lesões Permanentes"},
    ],
  },
  {
    id: "listas",
    title: "Listas da Ficha",
    items: [
      {key: "pericias", label: "Perícias"},
      {key: "vantagens", label: "Vantagens"},
      {key: "complicacoes", label: "Complicações"},
      {key: "armas", label: "Armas"},
      {key: "itens", label: "Itens"},
      {key: "armaduras", label: "Armaduras & Escudos"},
      {key: "espolios", label: "Espólios"},
      {key: "magias", label: "Magias"},
    ],
  },
  {
    id: "anotacoes",
    title: "Anotações",
    items: [{key: "notas", label: "Notas"}],
  },
];

export const SHEET_LOCK_OPTIONS = SHEET_LOCK_GROUPS.flatMap((group) =>
  group.items.map((item) => ({...item, groupId: group.id, groupTitle: group.title})),
);

export const SHEET_LOCK_KEYS = SHEET_LOCK_OPTIONS.map((item) => item.key);

export function getTableGameSession(table) {
  const lockedFields = Array.isArray(table?.gameSession?.lockedFields)
    ? table.gameSession.lockedFields
    : [];

  return {
    ...DEFAULT_GAME_SESSION,
    ...(table?.gameSession || {}),
    lockedFields,
  };
}
