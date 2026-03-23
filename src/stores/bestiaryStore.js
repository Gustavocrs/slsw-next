import {create} from "zustand";
import APIService from "@/lib/api";

/**
 * @typedef {Object} BestiaryFilters
 * @property {string} name - Filtro de busca textual pelo nome da criatura.
 * @property {string} rank - Filtro por Rank de SWADE (Carta, Novato, Experiente, etc.).
 * @property {string} type - Filtro por tipo de criatura (Humanoide, Fera, Monstro, etc.).
 */

/**
 * Store Zustand para gerenciamento global do Bestiário (SWADE).
 * Responsável por buscar os dados no Firestore, armazenar em cache na sessão
 * e aplicar regras de filtragem para a interface de usuário.
 */
export const useBestiaryStore = create((set, get) => ({
  // --- ESTADO ---
  monsters: [],
  loading: false,
  error: null,
  filters: {
    name: "",
    rank: "",
    type: "",
  },

  // --- ACTIONS ---

  /**
   * Busca a lista completa de criaturas na coleção 'monsters' do Firestore.
   * Define loading como true durante o fetch e mapeia o ID do documento.
   * @async
   * @returns {Promise<void>}
   */
  fetchMonsters: async (force = false) => {
    // Evita refetch desnecessário se a lista já estiver carregada na memória
    if (!force && get().monsters.length > 0) return;

    set({loading: true, error: null});
    try {
      // Centralizamos a chamada através do APIService
      const data = await APIService.getAllMonsters();

      // Limpeza em tempo de execução para corrigir dados legados do banco
      const cleanedData = data.map((m) => {
        let r = m.rank;
        if (typeof r === "string" && r.includes("(Carta Selvagem)")) {
          r = "Carta Selvagem";
        }
        return {...m, rank: r};
      });

      // Remove monstros duplicados baseando-se no nome
      const uniqueMonstersMap = new Map();
      cleanedData.forEach((m) => {
        const nameKey = (m.name || "").toLowerCase().trim();
        if (!uniqueMonstersMap.has(nameKey)) {
          uniqueMonstersMap.set(nameKey, m);
        }
      });

      set({monsters: Array.from(uniqueMonstersMap.values()), loading: false});
    } catch (error) {
      console.error("[useBestiaryStore] Erro ao buscar monstros:", error);
      set({error: error.message, loading: false});
    }
  },

  /**
   * Exclui um monstro do banco de dados e atualiza a store global.
   * @async
   * @param {string} id - ID do monstro
   */
  deleteMonster: async (id) => {
    try {
      await APIService.deleteMonster(id);
      set((state) => ({
        monsters: state.monsters.filter((m) => m._id !== id && m.id !== id),
      }));
    } catch (error) {
      console.error("[useBestiaryStore] Erro ao excluir monstro:", error);
    }
  },

  /**
   * Salva ou atualiza um monstro.
   * @async
   * @param {Object} monsterData - Dados do monstro
   */
  saveMonster: async (monsterData) => {
    try {
      const saved = await APIService.saveMonster(monsterData);
      set((state) => {
        const exists = state.monsters.some(
          (m) => m._id === saved._id || m.id === saved._id,
        );
        if (exists) {
          return {
            monsters: state.monsters.map((m) =>
              m._id === saved._id || m.id === saved._id ? {...m, ...saved} : m,
            ),
          };
        } else {
          return {monsters: [...state.monsters, saved]};
        }
      });
      return saved;
    } catch (error) {
      console.error("[useBestiaryStore] Erro ao salvar monstro:", error);
      throw error;
    }
  },

  /**
   * Atualiza parcialmente os filtros atuais do Bestiário.
   * @param {Partial<BestiaryFilters>} newFilters - Objeto contendo os filtros a serem mesclados.
   */
  setFilters: (newFilters) =>
    set((state) => ({
      filters: {...state.filters, ...newFilters},
    })),

  /**
   * Reseta os filtros de busca para seus valores padrão (strings vazias).
   */
  clearFilters: () =>
    set({
      filters: {name: "", rank: "", type: ""},
    }),
}));
