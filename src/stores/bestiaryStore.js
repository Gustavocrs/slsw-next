import {create} from "zustand";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../lib/firebase"; // Ajuste o caminho conforme sua estrutura

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
  fetchMonsters: async () => {
    set({loading: true, error: null});
    try {
      const querySnapshot = await getDocs(collection(db, "monsters"));
      const monstersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({monsters: monstersList, loading: false});
    } catch (error) {
      console.error("[useBestiaryStore] Erro ao buscar monstros:", error);
      set({error: error.message, loading: false});
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

  // --- SELETORES / GETTERS ---

  /**
   * Retorna a lista de monstros aplicando os filtros atuais (Nome, Rank e Tipo).
   * @returns {Array} Array de criaturas filtradas.
   */
  getFilteredMonsters: () => {
    const {monsters, filters} = get();
    return monsters.filter((monster) => {
      const matchName =
        monster.nome?.toLowerCase().includes(filters.name.toLowerCase()) ??
        true;
      const matchRank = filters.rank ? monster.rank === filters.rank : true;
      const matchType = filters.type ? monster.tipo === filters.type : true;

      return matchName && matchRank && matchType;
    });
  },
}));
