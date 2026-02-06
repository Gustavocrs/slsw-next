/**
 * Mongoose Model - Character
 */

const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema(
  {
    // User Reference
    userId: {
      type: String,
      required: true,
      index: true, // Para queries rápidas
    },
    
    // Informações Básicas
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    
    conceito: String,
    arquetipo: String,
    
    rank: {
      type: String,
      enum: ['Novato', 'Experiente', 'Veterano', 'Heroico', 'Lendário'],
      default: 'Novato',
    },
    
    // Atributos
    agilidade: { type: String, default: 'd6' },
    intelecto: { type: String, default: 'd6' },
    espirito: { type: String, default: 'd6' },
    forca: { type: String, default: 'd6' },
    vigor: { type: String, default: 'd6' },
    
    // Combate
    aparar: { type: Number, default: 0 },
    aparar_bonus: { type: Number, default: 0 },
    defesa: { type: Number, default: 0 },
    armadura_bonus: { type: Number, default: 0 },
    
    // Saúde
    wounds: { type: Number, default: 0, min: 0 },
    fatigue: { type: Number, default: 0, min: 0 },
    shaken: { type: Boolean, default: false },
    
    // Listas Dinâmicas
    pericias: [
      {
        name: String,
        die: String,
        modifier: { type: Number, default: 0 },
      },
    ],
    
    armas: [
      {
        name: String,
        damage: String,
        range: String,
      },
    ],
    
    armaduras: [
      {
        name: String,
        defense: Number,
        parry: Number,
      },
    ],
    
    itens: [
      {
        name: String,
      },
    ],
    
    vantagens: [
      {
        name: String,
      },
    ],
    
    magias: [
      {
        name: String,
        pp: String,
        range: String,
        duration: String,
      },
    ],
    
    complicacoes: [
      {
        name: String,
      },
    ],
    
    recursos: [
      {
        name: String,
        quantity: { type: Number, default: 0 },
        value: { type: Number, default: 0 },
      },
    ],
    
    // Notas e Mídia
    notas: String,
    imagem: String, // URL ou base64
    
    // UI State
    cardOrder: [String],
    
    // Metadata
    published: { type: Boolean, default: false },
    notes: String,
  },
  {
    timestamps: true,
    collection: 'characters',
  }
);

// Index para queries rápidas
characterSchema.index({ userId: 1, createdAt: -1 });

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
