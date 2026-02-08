/**
 * API Service - Cliente HTTP para o Backend Express (MongoDB)
 * Conecta o frontend ao servidor rodando na porta 3001
 */

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

class APIService {
  // ========== CHARACTER ENDPOINTS ==========

  /**
   * Criar novo personagem
   */
  static async createCharacter(characterData) {
    const response = await fetch(`${API_BASE_URL}/characters`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(characterData),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Erro ao criar personagem");
    }

    return await response.json(); // Espera { success: true, data: ... }
  }

  /**
   * Listar todos os personagens do usuário
   */
  static async getCharacters(userId) {
    const response = await fetch(`${API_BASE_URL}/characters/user/${userId}`);

    if (!response.ok) throw new Error("Erro ao buscar personagens");

    return await response.json();
  }

  /**
   * Obter um personagem específico
   */
  static async getCharacter(id) {
    const response = await fetch(`${API_BASE_URL}/characters/${id}`);

    if (!response.ok) throw new Error("Personagem não encontrado");

    return await response.json();
  }

  /**
   * Atualizar personagem
   */
  static async updateCharacter(id, updates) {
    const response = await fetch(`${API_BASE_URL}/characters/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error("Erro ao atualizar personagem");

    return await response.json();
  }

  /**
   * Deletar personagem
   */
  static async deleteCharacter(id) {
    const response = await fetch(`${API_BASE_URL}/characters/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao deletar personagem");

    return await response.json();
  }

  /**
   * Duplicar personagem
   */
  static async duplicateCharacter(id, userId) {
    const response = await fetch(`${API_BASE_URL}/characters/${id}/duplicate`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({userId}),
    });

    if (!response.ok) throw new Error("Erro ao duplicar personagem");

    return await response.json();
  }
}

export default APIService;
