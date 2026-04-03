import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  // Dados do Despertar
  despertar_origem: "",
  despertar_sensacao: "",
  despertar_afinidade: "",
  despertar_marca: "",
  // Estrutura do Poder Único
  poder_unico_fonte: "",
  poder_unico_expressao: "",
  poder_unico_gatilho: "",
  notas: "",
  // Características Físicas
  idade: "",
  altura: "",
  peso: "",
  cabelos: "",
  olhos: "",
  pele: "",
  // Mana System
  mana_atual: undefined, // Se undefined, considera cheio
  mana_bonus: 0,
  status_efeitos: [],
  envenenado: false,
  paralisado: false,
  congelado: false,
};

export const useCharacterStore = create((set) => ({
  character: initialCharacter,

  loadCharacter: (data) =>
    set(() => ({
      character: { ...initialCharacter, ...data },
    })),

  updateCharacter: (data) =>
    set(() => ({
      character: { ...initialCharacter, ...data },
    })),

  resetCharacter: () =>
    set(() => ({
      character: initialCharacter,
    })),

  updateAttribute: (key, value) =>
    set((state) => ({
      character: { ...state.character, [key]: value },
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
          i === index ? { ...item, ...updatedItem } : item,
        ),
      },
    })),

  // UI Stores Helpers
  setCardOrder: (order) =>
    set((state) => ({ character: { ...state.character, cardOrder: order } })),

  inspectedCharacter: null,
  setInspectedCharacter: (char) => set({ inspectedCharacter: char }),
}));

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null }),
}));

export const useUIStore = create(
  persist(
    (set) => ({
      viewMode: "book",
      sheetTab: 0, // 0: Visualizar, 1: Identificação, etc.
      tableCreateModalOpen: false, // Modal de Criar
      tableListModalOpen: false, // Modal de Listar (Dashboard)
      tableDetailsModalOpen: false, // Modal de Detalhes/Config
      inspectModalOpen: false, // Modal de Inspeção de Ficha
      gameModalOpen: false, // Modal de Jogo (Novo)
      questGeneratorOpen: false, // Painel do Gerador de Quests
      selectedTable: null, // Mesa selecionada para ver detalhes
      tablesUpdated: 0, // Timestamp para forçar refresh da lista
      messagesDashboardOpen: false, // O novo dashboard de mensagens
      notifications: [], // Lista de notificações não lidas

      // Cenário ativo
      activeScenarioId: null,
      setActiveScenarioId: (id) => set({ activeScenarioId: id }),

      toggleView: () =>
        set((state) => ({
          viewMode: state.viewMode === "book" ? "sheet" : "book",
        })),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSheetTab: (tab) => set({ sheetTab: tab }),

      toggleTableCreateModal: () =>
        set((state) => ({ tableCreateModalOpen: !state.tableCreateModalOpen })),
      toggleTableListModal: () =>
        set((state) => ({ tableListModalOpen: !state.tableListModalOpen })),
      toggleTableDetailsModal: () =>
        set((state) => ({
          tableDetailsModalOpen: !state.tableDetailsModalOpen,
        })),
      toggleGameModal: () =>
        set((state) => ({ gameModalOpen: !state.gameModalOpen })),
      toggleInspectModal: () =>
        set((state) => ({ inspectModalOpen: !state.inspectModalOpen })),
      toggleMessagesDashboard: () =>
        set((state) => ({
          messagesDashboardOpen: !state.messagesDashboardOpen,
        })),
      toggleQuestGenerator: () =>
        set((state) => ({ questGeneratorOpen: !state.questGeneratorOpen })),

      // Sistema de Chat
      chatOpen: false,
      chatRecipient: null, // null = Global, objeto = Privado
      toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
      openChatWith: (recipient) =>
        set({ chatOpen: true, chatRecipient: recipient }),

      setNotifications: (notifications) => set({ notifications }),
      setSelectedTable: (table) => set({ selectedTable: table }),
      notifyTablesUpdated: () => set({ tablesUpdated: Date.now() }),

      // Sistema de Notificações Global
      notification: { open: false, message: "", severity: "info" },
      showNotification: (message, severity = "info") =>
        set({ notification: { open: true, message, severity } }),
      hideNotification: () =>
        set((state) => ({
          notification: { ...state.notification, open: false },
        })),
    }),
    {
      name: "rpg-manager-ui-store",
      partialize: (state) => ({ selectedTable: state.selectedTable }),
      version: 1,
      migrate: (persistedState, version) => {
        if (version !== 1) {
          return { selectedTable: null };
        }
        return persistedState;
      },
    },
  ),
);
