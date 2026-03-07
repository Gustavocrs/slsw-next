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
  getDoc,
  or,
  arrayUnion,
  arrayRemove,
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

  // 1.1 BUSCAR PERSONAGEM POR ID (Para o Mestre ver a ficha)
  static async getCharacterById(characterId) {
    try {
      const docRef = doc(db, "characters", characterId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {_id: docSnap.id, ...docSnap.data()};
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar personagem por ID:", error);
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

  // =================================================================
  // MÉTODOS DE MESA (TABLES)
  // =================================================================

  // 5. CRIAR MESA
  static async createTable(tableData) {
    try {
      const payload = this._cleanData({
        ...tableData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        players: [], // Lista de jogadores que aceitaram (uid, charId)
        playerIds: [], // Lista auxiliar de UIDs para consultas
      });

      const docRef = await addDoc(collection(db, "tables"), payload);
      return {_id: docRef.id, ...payload};
    } catch (error) {
      console.error("Erro ao criar mesa:", error);
      throw error;
    }
  }

  // 6. LISTAR MESAS (Onde sou Mestre OU Jogador convidado)
  static async getTables(userEmail, userId) {
    try {
      // Firestore tem limitações com 'or' e múltiplos 'array-contains'.
      // Dividimos em consultas paralelas para garantir robustez e evitar erros de índice.
      const tablesMap = new Map();
      const promises = [];

      // 1. Mesas onde sou GM
      if (userId) {
        promises.push(
          getDocs(query(collection(db, "tables"), where("gmId", "==", userId))),
        );
        // 3. Mesas onde sou Jogador
        promises.push(
          getDocs(
            query(
              collection(db, "tables"),
              where("playerIds", "array-contains", userId),
            ),
          ),
        );
      }

      // 2. Mesas onde fui convidado
      if (userEmail) {
        promises.push(
          getDocs(
            query(
              collection(db, "tables"),
              where("invites", "array-contains", userEmail),
            ),
          ),
        );
      }

      const snapshots = await Promise.all(promises);

      snapshots.forEach((snap) => {
        snap.docs.forEach((doc) => {
          if (!tablesMap.has(doc.id)) {
            tablesMap.set(doc.id, {_id: doc.id, ...doc.data()});
          }
        });
      });

      return Array.from(tablesMap.values());
    } catch (error) {
      console.error("Erro ao listar mesas:", error);
      return [];
    }
  }

  // 7. ATUALIZAR MESA
  static async updateTable(tableId, data) {
    try {
      const docRef = doc(db, "tables", tableId);
      const payload = this._cleanData({
        ...data,
        updatedAt: serverTimestamp(),
      });
      await updateDoc(docRef, payload);
      return {_id: tableId, ...payload};
    } catch (error) {
      console.error("Erro ao atualizar mesa:", error);
      throw error;
    }
  }

  // 8. DELETAR MESA
  static async deleteTable(tableId) {
    try {
      await deleteDoc(doc(db, "tables", tableId));
      return {success: true};
    } catch (error) {
      console.error("Erro ao deletar mesa:", error);
      throw error;
    }
  }

  // 9. ENVIAR CONVITE (Via Resend API Route)
  static async sendTableInvite(tableId, email, gmName, tableName) {
    try {
      const response = await fetch("/api/emails/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          gmName,
          tableName,
        }),
      });

      if (!response.ok) {
        console.error(
          "Erro ao enviar email via Resend:",
          await response.text(),
        );
      }
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      // Não lança erro para não bloquear o fluxo do usuário
    }
  }

  // 10. ACEITAR CONVITE
  static async acceptInvite(tableId, user) {
    try {
      const tableRef = doc(db, "tables", tableId);
      await updateDoc(tableRef, {
        invites: arrayRemove(user.email),
        playerIds: arrayUnion(user.uid),
        players: arrayUnion({
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Jogador",
          joinedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Erro ao aceitar convite:", error);
      throw error;
    }
  }

  // 11. RECUSAR CONVITE
  static async declineInvite(tableId, email) {
    try {
      const tableRef = doc(db, "tables", tableId);
      await updateDoc(tableRef, {
        invites: arrayRemove(email),
      });
    } catch (error) {
      console.error("Erro ao recusar convite:", error);
      throw error;
    }
  }
}

export default APIService;
