/**
 * API Service - Conecta o frontend ao Firebase Firestore
 */

import {db, auth} from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import {signOut, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

class APIService {
  /**
   * Realiza o logout do usuário
   */
  static async logout() {
    await signOut(auth);
    return {success: true};
  }

  /**
   * Realiza o login com Google
   */
  static async loginGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return {success: true, user: result.user};
  }

  // ========== CHARACTER ENDPOINTS ==========

  /**
   * Adapta os dados para o formato do Backend (Firestore)
   */
  static _adaptToBackend(data) {
    const d = {...data};

    // Converter checks (UI) para valores numéricos (Backend) se necessário
    if (d.checks) {
      if (d.checks.wounds !== undefined)
        d.wounds = d.checks.wounds.filter(Boolean).length;
      if (d.checks.fatigue !== undefined)
        d.fatigue = d.checks.fatigue.filter(Boolean).length;
      if (d.checks.shaken !== undefined) d.shaken = d.checks.shaken;
      delete d.checks;
    }

    return d;
  }

  /**
   * Adapta os dados do Backend (Firestore) para o formato UI
   * Reconstrói estruturas que foram achatadas ou transformadas (ex: checks)
   */
  static _adaptToUI(data) {
    if (!data) return data;
    const d = {...data};

    // Reconstruir objeto 'checks' (Wounds/Fatigue) se necessário
    if (
      !d.checks &&
      (d.wounds !== undefined ||
        d.fatigue !== undefined ||
        d.shaken !== undefined)
    ) {
      d.checks = {
        shaken: d.shaken || false,
        wounds: Array(3)
          .fill(false)
          .map((_, i) => i < (d.wounds || 0)),
        fatigue: Array(2)
          .fill(false)
          .map((_, i) => i < (d.fatigue || 0)),
      };
    }

    // Garantir que listas existam como arrays para evitar erros de map/filter na UI
    const listFields = [
      "pericias",
      "armas",
      "armaduras",
      "itens",
      "vantagens",
      "complicacoes",
      "magias",
      "recursos_despertar",
      "espolios",
    ];
    listFields.forEach((field) => {
      if (!d[field]) d[field] = [];
    });

    return d;
  }

  /**
   * Criar novo personagem
   */
  static async createCharacter(characterData) {
    const {userId} = characterData;
    if (!userId) {
      throw new Error("Erro: Usuário não identificado ao salvar.");
    }

    // REGRA: Garante apenas uma ficha por usuário (Singleton)
    // Verifica se já existe ficha para este usuário no banco
    const q = query(
      collection(db, "characters"),
      where("userId", "==", userId),
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Se já existe, atualiza a ficha encontrada em vez de criar nova
      const existingId = snapshot.docs[0].id;
      return this.updateCharacter(existingId, characterData);
    }

    if (!characterData.nome || characterData.nome.trim() === "") {
      throw new Error("O nome do personagem é obrigatório.");
    }

    const payload = this._adaptToBackend(characterData);
    payload.userId = userId; // Garante que o userId seja salvo no documento

    // Adiciona timestamps manuais já que não temos Mongoose
    payload.createdAt = new Date().toISOString();
    payload.updatedAt = new Date().toISOString();

    const docRef = await addDoc(collection(db, "characters"), payload);
    return {success: true, data: {id: docRef.id, ...this._adaptToUI(payload)}};
  }

  /**
   * Listar todos os personagens do usuário
   */
  static async getCharacters(userId) {
    if (!userId)
      throw new Error("UserId é obrigatório para listar personagens.");

    const q = query(
      collection(db, "characters"),
      where("userId", "==", userId),
    );
    const querySnapshot = await getDocs(q);

    let list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...this._adaptToUI(doc.data()),
    }));

    // Ordenar por data de atualização (mais recente primeiro)
    list.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
      return dateB - dateA;
    });

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

    return {
      success: true,
      data: {id: docSnap.id, ...this._adaptToUI(docSnap.data())},
    };
  }

  /**
   * Atualizar personagem
   */
  static async updateCharacter(id, updates) {
    const payload = this._adaptToBackend(updates);
    payload.updatedAt = new Date().toISOString();

    const docRef = doc(db, "characters", id);
    await updateDoc(docRef, payload);

    return {success: true, data: {id, ...this._adaptToUI(payload)}};
  }

  /**
   * Deletar personagem
   */
  static async deleteCharacter(id) {
    await deleteDoc(doc(db, "characters", id));
    return {success: true, data: {success: true}};
  }

  /**
   * Duplicar personagem
   */
  static async duplicateCharacter(id, userId) {
    // 1. Ler original
    const original = await this.getCharacter(id);
    const data = original.data;

    // 2. Limpar ID e ajustar nome
    const {id: _, ...cleanData} = data;
    const newData = {
      ...cleanData,
      userId,
      nome: `${data.nome} (Cópia)`,
    };

    // 3. Criar novo
    return this.createCharacter(newData);
  }

  /**
   * Obter estatísticas do personagem (para uso rápido)
   */
  static async getCharacterStats(id) {
    const char = await this.getCharacter(id);
    return {success: true, data: char.data};
  }
}

export default APIService;
