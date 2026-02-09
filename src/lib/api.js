/**
 * src/lib/api.js
 * Versão SERVERLESS (Firebase Firestore direto)
 */
import {db} from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

class APIService {
  // Helper para limpar dados undefined (Firestore não aceita)
  static _cleanData(data) {
    const clean = {...data};
    Object.keys(clean).forEach((key) => {
      if (clean[key] === undefined) delete clean[key];
    });
    return clean;
  }

  // 1. BUSCAR PERSONAGEM (Singleton por UserID)
  static async getCharacter(userId) {
    if (!userId) return null;
    try {
      const q = query(
        collection(db, "characters"),
        where("userId", "==", userId),
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      // Retorna o primeiro que encontrar + ID do documento
      const docData = snapshot.docs[0];
      return {_id: docData.id, ...docData.data()};
    } catch (error) {
      console.error("Firebase: Erro ao buscar:", error);
      throw error;
    }
  }

  // 2. SALVAR (Cria ou Atualiza Automaticamente)
  static async saveCharacter(userId, characterData) {
    if (!userId) throw new Error("Usuário não logado");

    try {
      // Verifica se já existe ficha para este usuário
      const existing = await this.getCharacter(userId);
      const payload = this._cleanData({
        ...characterData,
        userId,
        updatedAt: serverTimestamp(), // Marca a hora do update
      });

      // Remove _id do payload para não salvar o ID dentro dos dados
      delete payload._id;

      if (existing && existing._id) {
        // ATUALIZA
        const docRef = doc(db, "characters", existing._id);
        await updateDoc(docRef, payload);
        return {_id: existing._id, ...payload};
      } else {
        // CRIA NOVO
        payload.createdAt = serverTimestamp();
        payload.nome = payload.nome || "Novo Caçador";

        const docRef = await addDoc(collection(db, "characters"), payload);
        return {_id: docRef.id, ...payload};
      }
    } catch (error) {
      console.error("Firebase: Erro ao salvar:", error);
      throw error;
    }
  }

  // 3. DELETAR
  static async deleteCharacter(characterId) {
    try {
      await deleteDoc(doc(db, "characters", characterId));
      return {success: true};
    } catch (error) {
      console.error("Firebase: Erro ao deletar:", error);
      throw error;
    }
  }

  // 4. DUPLICAR
  static async duplicateCharacter(originalId, userId) {
    try {
      // Lê o original
      const originalRef = doc(db, "characters", originalId);
      // Aqui simplificamos: buscamos pelo getCharacter para garantir permissão,
      // mas se tiver o ID direto também funciona.
      // Vamos assumir que recebemos o objeto completo ou buscamos de novo:

      const q = query(
        collection(db, "characters"),
        where("userId", "==", userId),
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) throw new Error("Ficha original não encontrada");

      const originalData = snapshot.docs[0].data();

      // Cria cópia
      const newData = {
        ...originalData,
        nome: `${originalData.nome} (Cópia)`,
        userId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const newDocRef = await addDoc(collection(db, "characters"), newData);
      return {_id: newDocRef.id, ...newData};
    } catch (error) {
      console.error("Erro ao duplicar:", error);
      throw error;
    }
  }
}

export default APIService;
