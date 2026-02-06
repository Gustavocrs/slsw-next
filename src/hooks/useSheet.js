/**
 * Hook - useSheet
 * Gerenciamento de ficha (Firestore)
 */

import {useCallback} from "react";
import {doc, setDoc, getDoc} from "firebase/firestore";
import {db} from "@/lib/firebase";
import {useCharacterStore} from "@/stores/characterStore";

export function useSheet(userId) {
  const {character, loadCharacter} = useCharacterStore();

  // Salvar ficha no Firestore
  const saveSheet = useCallback(
    async (data = character) => {
      if (!userId) throw new Error("Usuário não autenticado");

      try {
        const docRef = doc(db, "fichas", userId);
        await setDoc(docRef, data, {merge: true});
        return {success: true};
      } catch (error) {
        console.error("Erro ao salvar ficha:", error);
        throw error;
      }
    },
    [userId, character],
  );

  // Carregar ficha do Firestore
  const loadSheetFromCloud = useCallback(async () => {
    if (!userId) throw new Error("Usuário não autenticado");

    try {
      const docRef = doc(db, "fichas", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        loadCharacter(data);
        return {success: true, data};
      } else {
        console.log("Nenhuma ficha encontrada");
        return {success: false, data: null};
      }
    } catch (error) {
      console.error("Erro ao carregar ficha:", error);
      throw error;
    }
  }, [userId, loadCharacter]);

  // Exportar ficha como JSON
  const exportAsJSON = useCallback(async () => {
    const dataStr = JSON.stringify(character, null, 2);
    const dataBlob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${character.nome || "ficha"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [character]);

  // Importar ficha de JSON
  const importFromJSON = useCallback(
    (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            loadCharacter(data);
            resolve({success: true, data});
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    },
    [loadCharacter],
  );

  return {
    character,
    saveSheet,
    loadSheetFromCloud,
    exportAsJSON,
    importFromJSON,
  };
}

export default useSheet;
