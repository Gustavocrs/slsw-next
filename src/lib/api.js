/**
 * API Service - Cliente HTTP para o Backend Express (MongoDB)
 * Conecta o frontend ao servidor rodando na porta 3001
 */

import {db} from "./firebase";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

class APIService {
  // ========== CHARACTER ENDPOINTS ==========

  /**
   * Adapta os dados do formato UI (ui.js) para o formato do Backend (Mongoose)
   */
  static _adaptToBackend(data) {
    if (!data) return data;
    const d = {...data};

    // Helper: Tenta pegar o valor de várias chaves possíveis (híbrido UI antiga/nova)
    const getVal = (item, ...keys) => {
      for (const k of keys) {
        if (item[k] !== undefined && item[k] !== "") return item[k];
      }
      return undefined;
    };

    // Mapear Listas (ui.js keys -> Mongoose keys)
    if (Array.isArray(d.pericias)) {
      d.pericias = d.pericias
        .map((i) => ({
          name: getVal(i, "name", "skill-name"),
          die: getVal(i, "die", "skill-die"),
          modifier: i.modifier || 0,
        }))
        .filter((i) => i.name); // Remove itens sem nome
    }
    if (Array.isArray(d.armas)) {
      d.armas = d.armas
        .map((i) => ({
          name: getVal(i, "name", "dyn-name"),
          damage: getVal(i, "damage", "dyn-dano"),
          range: getVal(i, "range", "dyn-alcance"),
        }))
        .filter((i) => i.name);
    }
    if (Array.isArray(d.armaduras)) {
      d.armaduras = d.armaduras
        .map((i) => ({
          name: getVal(i, "name", "dyn-name"),
          defense: Number(getVal(i, "defense", "dyn-defesa")) || 0,
          parry: Number(getVal(i, "parry", "dyn-aparar")) || 0,
        }))
        .filter((i) => i.name);
    }
    if (Array.isArray(d.itens)) {
      d.itens = d.itens
        .map((i) => ({
          name: getVal(i, "name", "dyn-name"),
        }))
        .filter((i) => i.name);
    }
    if (Array.isArray(d.vantagens)) {
      d.vantagens = d.vantagens
        .map((i) => ({
          name: getVal(i, "name", "dyn-name"),
        }))
        .filter((i) => i.name);
    }
    if (Array.isArray(d.complicacoes)) {
      d.complicacoes = d.complicacoes
        .map((i) => ({
          name: getVal(i, "name", "dyn-name"),
        }))
        .filter((i) => i.name);
    }
    if (Array.isArray(d.magias)) {
      d.magias = d.magias
        .map((i) => ({
          name: getVal(i, "name", "spell-name"),
          pp: getVal(i, "pp", "spell-pp"),
          range: getVal(i, "range", "spell-range"),
          duration: getVal(i, "duration", "spell-dur"),
        }))
        .filter((i) => i.name);
    }
    if (Array.isArray(d.recursos)) {
      d.recursos = d.recursos
        .map((i) => ({
          name: getVal(i, "name", "dyn-name"),
          quantity: Number(getVal(i, "quantity", "dyn-qtd")) || 0,
          value: Number(getVal(i, "value", "dyn-val")) || 0,
        }))
        .filter((i) => i.name);
    }

    // Mapear Checks (Wounds/Fatigue de Array booleano para Number)
    if (d.checks) {
      d.shaken = d.checks.shaken;
      if (Array.isArray(d.checks.wounds))
        d.wounds = d.checks.wounds.filter(Boolean).length;
      if (Array.isArray(d.checks.fatigue))
        d.fatigue = d.checks.fatigue.filter(Boolean).length;
      delete d.checks;
    }

    return d;
  }

  /**
   * Criar novo personagem
   */
  static async createCharacter(characterData) {
    if (!characterData.nome || characterData.nome.trim() === "") {
      throw new Error("O nome do personagem é obrigatório.");
    }

    const payload = this._adaptToBackend(characterData);

    // Adiciona timestamps manuais já que não temos Mongoose
    payload.createdAt = new Date().toISOString();
    payload.updatedAt = new Date().toISOString();

    const docRef = await addDoc(collection(db, "characters"), payload);
    return {success: true, data: {id: docRef.id, ...payload}};
  }

  /**
   * Listar todos os personagens do usuário
   */
  static async getCharacters(userId) {
    const q = query(
      collection(db, "characters"),
      where("userId", "==", userId),
    );
    const querySnapshot = await getDocs(q);

    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {success: true, data: list};
  }

  /**
   * Obter um personagem específico
   */
  static async getCharacter(id) {
    const docRef = doc(db, "characters", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Personagem não encontrado");
    }

    return {success: true, data: {id: docSnap.id, ...docSnap.data()}};
  }

  /**
   * Atualizar personagem
   */
  static async updateCharacter(id, updates) {
    const payload = this._adaptToBackend(updates);
    payload.updatedAt = new Date().toISOString();

    const docRef = doc(db, "characters", id);
    await updateDoc(docRef, payload);

    return {success: true, data: {id, ...payload}};
  }

  /**
   * Deletar personagem
   */
  static async deleteCharacter(id) {
    await deleteDoc(doc(db, "characters", id));
    return {success: true, message: "Personagem deletado"};
  }

  /**
   * Duplicar personagem
   */
  static async duplicateCharacter(id, userId) {
    // 1. Ler original
    const originalSnap = await getDoc(doc(db, "characters", id));
    if (!originalSnap.exists()) throw new Error("Original não encontrado");

    const originalData = originalSnap.data();

    // 2. Preparar cópia
    const newData = {
      ...originalData,
      userId: userId, // Garante que vai para o usuário atual
      nome: `${originalData.nome} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 3. Salvar
    const docRef = await addDoc(collection(db, "characters"), newData);
    return {success: true, data: {id: docRef.id, ...newData}};
  }
}

export default APIService;
