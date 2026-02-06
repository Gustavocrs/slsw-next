/**
 * Zustand Store - Gerenciamento de Estado da Ficha
 */

import { create } from 'zustand';

// Estado inicial de uma ficha
const initialCharacter = {
  // Identificação
  nome: '',
  jogador: '',
  conceito: '',
  arquetipo: '',
  guilda: '',
  xp: 0,
  rank: 'Novato',
  riqueza: 0,
  imagem_url: '',
  
  // Atributos
  agilidade: 'd4',
  intelecto: 'd4',
  espirito: 'd4',
  forca: 'd4',
  vigor: 'd4',
  
  // Combate
  aparar: 0,
  aparar_bonus: 0,
  defesa: 2,
  armadura_bonus: 0,
  
  // Saúde
  wounds: 0,
  fatigue: 0,
  shaken: false,
  
  // Listas
  pericias: [],
  armas: [],
  armaduras: [],
  itens: [],
  espolios: [],
  vantagens: [],
  magias: [],
  complicacoes: [],
  recursos_despertar: [], // Novos poderes do despertar
  notas: '',
  imagem: '',
  
  // UI
  cardOrder: [
    'pericias',
    'armas',
    'armaduras',
    'itens',
    'recursos_despertar',
    'poder_unico',
    'vantagens',
    'complicacoes',
    'magias',
    'notas',
    'imagem',
  ],
};

export const useCharacterStore = create((set) => ({
  character: initialCharacter,
  
  // Atualizar atributo único
  updateAttribute: (key, value) =>
    set((state) => ({
      character: {
        ...state.character,
        [key]: value,
      },
    })),
  
  // Atualizar múltiplos atributos
  updateCharacter: (updates) =>
    set((state) => ({
      character: {
        ...state.character,
        ...updates,
      },
    })),
  
  // Resetar para inicial
  resetCharacter: () => set({ character: initialCharacter }),
  
  // Carregar ficha (do Firebase/API)
  loadCharacter: (data) =>
    set({ character: { ...initialCharacter, ...data } }),
  
  // Adicionar item a lista
  addItemToList: (listName, item) =>
    set((state) => ({
      character: {
        ...state.character,
        [listName]: [...(state.character[listName] || []), item],
      },
    })),
  
  // Remover item de lista
  removeItemFromList: (listName, index) =>
    set((state) => ({
      character: {
        ...state.character,
        [listName]: state.character[listName].filter((_, i) => i !== index),
      },
    })),
  
  // Atualizar item da lista
  updateListItem: (listName, index, updatedItem) =>
    set((state) => ({
      character: {
        ...state.character,
        [listName]: state.character[listName].map((item, i) =>
          i === index ? { ...item, ...updatedItem } : item
        ),
      },
    })),
  
  // Reordenar cards
  setCardOrder: (order) =>
    set((state) => ({
      character: {
        ...state.character,
        cardOrder: order,
      },
    })),
}));

// Store de autenticação e UI
export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null }),
}));

// Store de UI
export const useUIStore = create((set) => ({
  isBookView: true,
  viewMode: 'book', // 'book' | 'sheet'
  
  toggleView: () =>
    set((state) => ({
      viewMode: state.viewMode === 'book' ? 'sheet' : 'book',
      isBookView: state.viewMode !== 'book',
    })),
  
  setViewMode: (mode) => set({ viewMode: mode, isBookView: mode === 'book' }),
}));
