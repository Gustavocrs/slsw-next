/**
 * API Service - Cliente para chamar Backend
 * Com fallback para localStorage quando backend não está disponível
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class APIService {
  static async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Se não for 2xx, tratar como erro
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      // Se der erro de rede (CORS/NetworkError), usar localStorage como fallback
      console.warn(
        "⚠️ Backend indisponível. Usando localStorage como fallback.",
      );
      throw error;
    }
  }

  // ========== CHARACTER ENDPOINTS ==========

  /**
   * Criar novo personagem
   */
  static async createCharacter(characterData) {
    return this.request("/api/characters", {
      method: "POST",
      body: JSON.stringify(characterData),
    });
  }

  /**
   * Listar todos os personagens do usuário
   */
  static async getCharacters(userId) {
    return this.request(`/api/characters/user/${userId}`);
  }

  /**
   * Obter um personagem específico
   */
  static async getCharacter(id) {
    return this.request(`/api/characters/${id}`);
  }

  /**
   * Atualizar personagem
   */
  static async updateCharacter(id, updates) {
    return this.request(`/api/characters/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  /**
   * Deletar personagem
   */
  static async deleteCharacter(id) {
    return this.request(`/api/characters/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Duplicar personagem
   */
  static async duplicateCharacter(id, userId) {
    return this.request(`/api/characters/${id}/duplicate`, {
      method: "POST",
      body: JSON.stringify({userId}),
    });
  }

  /**
   * Obter stats calculados do personagem
   */
  static async getCharacterStats(id) {
    return this.request(`/api/characters/${id}/stats`);
  }

  /**
   * Health Check
   */
  static async healthCheck() {
    return this.request("/health");
  }

  /**
   * Obter documentação da API
   */
  static async getDocs() {
    return this.request("/api/docs");
  }
}

export default APIService;
