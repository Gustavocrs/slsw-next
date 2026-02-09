import {create} from "zustand";

const initialCharacter = {
  nome: "",
  rank: "Novato",
  agilidade: "d4",
  intelecto: "d4",
  espirito: "d4",
  forca: "d4",
  vigor: "d4",
  aparar: 0,
  defesa: 2,
  pericias: [],
  armas: [],
  armaduras: [],
  itens: [],
  espolios: [],
  vantagens: [],
  magias: [],
  complicacoes: [],
  recursos_despertar: [],
  notas: "",
};

export const useCharacterStore = create((set) => ({
  character: initialCharacter,

  loadCharacter: (data) =>
    set((state) => ({
      character: {...initialCharacter, ...data},
    })),

  updateAttribute: (key, value) =>
    set((state) => ({
      character: {...state.character, [key]: value},
    })),

  // FIX DEFINITIVO: Usa spread operator (...) para não apagar itens antigos
  addItemToList: (listName, item) =>
    set((state) => {
      const currentList = Array.isArray(state.character[listName])
        ? state.character[listName]
        : [];
      return {
        character: {
          ...state.character,
          [listName]: [...currentList, item],
        },
      };
    }),

  removeItemFromList: (listName, index) =>
    set((state) => ({
      character: {
        ...state.character,
        [listName]: state.character[listName].filter((_, i) => i !== index),
      },
    })),

  updateListItem: (listName, index, updatedItem) =>
    set((state) => ({
      character: {
        ...state.character,
        [listName]: state.character[listName].map((item, i) =>
          i === index ? {...item, ...updatedItem} : item,
        ),
      },
    })),

  // UI Stores Helpers
  setCardOrder: (order) =>
    set((state) => ({character: {...state.character, cardOrder: order}})),
}));

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({user, loading: false}),
  setLoading: (loading) => set({loading}),
  logout: () => set({user: null}),
}));

export const useUIStore = create((set) => ({
  viewMode: "book",
  toggleView: () =>
    set((state) => ({viewMode: state.viewMode === "book" ? "sheet" : "book"})),
  setViewMode: (mode) => set({viewMode: mode}),
}));
