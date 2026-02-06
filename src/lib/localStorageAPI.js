/**
 * LocalStorage API - Fallback quando backend não está disponível
 * Oferece as mesmas funções da API mas usando localStorage
 */

class LocalStorageAPI {
  static getStorageKey(id) {
    return `character_${id}`;
  }

  static getAllCharactersKey(userId) {
    return `characters_${userId}`;
  }

  /**
   * Criar novo personagem
   */
  static createCharacter(characterData) {
    const id = `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const character = {
      data: {
        _id: id,
        ...characterData,
        createdAt: now,
        updatedAt: now,
      },
    };

    // Salvar caractere individual
    if (typeof window !== "undefined") {
      localStorage.setItem(
        this.getStorageKey(id),
        JSON.stringify(character.data),
      );

      // Adicionar à lista do usuário
      const userId = characterData.userId;
      const listKey = this.getAllCharactersKey(userId);
      const list = JSON.parse(localStorage.getItem(listKey) || "[]");
      list.push(id);
      localStorage.setItem(listKey, JSON.stringify(list));
    }

    return character;
  }

  /**
   * Listar todos os personagens do usuário
   */
  static getCharacters(userId) {
    if (typeof window === "undefined") return {data: []};

    const listKey = this.getAllCharactersKey(userId);
    const ids = JSON.parse(localStorage.getItem(listKey) || "[]");

    const characters = ids
      .map((id) => {
        const data = localStorage.getItem(this.getStorageKey(id));
        return data ? JSON.parse(data) : null;
      })
      .filter(Boolean);

    return {data: characters};
  }

  /**
   * Obter um personagem específico
   */
  static getCharacter(id) {
    if (typeof window === "undefined") return {data: null};

    const data = localStorage.getItem(this.getStorageKey(id));
    return {data: data ? JSON.parse(data) : null};
  }

  /**
   * Atualizar personagem
   */
  static updateCharacter(id, updates) {
    if (typeof window === "undefined") return {data: null};

    const existing = localStorage.getItem(this.getStorageKey(id));
    if (!existing) throw new Error("Personagem não encontrado");

    const character = JSON.parse(existing);
    const updated = {
      ...character,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(this.getStorageKey(id), JSON.stringify(updated));
    return {data: updated};
  }

  /**
   * Deletar personagem
   */
  static deleteCharacter(id) {
    if (typeof window === "undefined") return {data: null};

    const data = localStorage.getItem(this.getStorageKey(id));
    if (!data) throw new Error("Personagem não encontrado");

    const character = JSON.parse(data);
    const userId = character.userId;

    localStorage.removeItem(this.getStorageKey(id));

    // Remover da lista do usuário
    const listKey = this.getAllCharactersKey(userId);
    const list = JSON.parse(localStorage.getItem(listKey) || "[]");
    const newList = list.filter((charId) => charId !== id);
    localStorage.setItem(listKey, JSON.stringify(newList));

    return {data: {success: true}};
  }
}

export default LocalStorageAPI;
