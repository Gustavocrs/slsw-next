/**
 * API Service - Cliente Firebase Firestore
 * Substitui chamadas REST por chamadas diretas ao banco de dados
 */

import {db} from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

class APIService {
  // Helper para formatar documento do Firestore
  static _mapDoc(docSnapshot) {
    if (!docSnapshot.exists()) return null;
    return {id: docSnapshot.id, ...docSnapshot.data()};
  }

  // ========== CHARACTER ENDPOINTS ==========

  /**
   * Criar novo personagem
   */
  static async createCharacter(characterData) {
    const docRef = await addDoc(collection(db, "characters"), characterData);
    // Retorna no formato { data: ... } para manter compatibilidade
    return {data: {id: docRef.id, ...characterData}};
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
    const list = querySnapshot.docs.map((d) => ({id: d.id, ...d.data()}));
    return {data: list};
  }

  /**
   * Obter um personagem específico
   */
  static async getCharacter(id) {
    const docRef = doc(db, "characters", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("Personagem não encontrado");
    return {data: {id: docSnap.id, ...docSnap.data()}};
  }

  /**
   * Atualizar personagem
   */
  static async updateCharacter(id, updates) {
    const docRef = doc(db, "characters", id);
    await updateDoc(docRef, updates);
    // Retorna os dados atualizados (mesclando com o ID)
    return {data: {id, ...updates}};
  }

  /**
   * Deletar personagem
   */
  static async deleteCharacter(id) {
    await deleteDoc(doc(db, "characters", id));
    return {data: {success: true}};
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
    const newData = {...cleanData, userId, nome: `${data.nome} (Cópia)`};

    // 3. Criar novo
    return this.createCharacter(newData);
  }
}

export default APIService;
