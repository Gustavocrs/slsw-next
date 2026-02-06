/**
 * MongoDB Models - Character (Ficha)
 */

const schema = {
  // Informações básicas
  userId: "String (ref Firebase UID)",
  nome: "String",
  conceito: "String",
  arquetipo: "String",
  rank: "String (enum: Novato, Experiente, Veterano, Heroico, Lendário)",

  // Atributos
  agilidade: "String (d4-d12)",
  intelecto: "String",
  espirito: "String",
  forca: "String",
  vigor: "String",

  // Combate
  aparar: "Number",
  aparar_bonus: "Number",
  defesa: "Number",
  armadura_bonus: "Number",

  // Saúde
  wounds: "Number",
  fatigue: "Number",
  shaken: "Boolean",

  // Listas
  pericias: "[{ name: String, die: String, modifier: Number }]",
  armas: "[{ name: String, damage: String, range: String }]",
  armaduras: "[{ name: String, defense: Number, parry: Number }]",
  itens: "[{ name: String }]",
  vantagens: "[{ name: String }]",
  magias: "[{ name: String, pp: String, range: String, duration: String }]",
  complicacoes: "[{ name: String }]",
  recursos: "[{ name: String, quantity: Number, value: Number }]",

  // Notas
  notas: "String",
  imagem: "String (URL ou base64)",
  cardOrder: "[String]",

  // Metadata
  createdAt: "Date",
  updatedAt: "Date",
};

export default schema;
