/**
 * Hook - useCharacterAPI
 * Hook React para gerenciar interações com a API de personagens
 * Com fallback para localStorage quando backend não está disponível
 */

import {useCallback, useState} from "react";
import APIService from "@/lib/api";
import {useCharacterStore} from "@/stores/characterStore";
import {useAuth} from "./useAuth";

export function useCharacterAPI() {
  const {user} = useAuth();
  const {character, loadCharacter} = useCharacterStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Criar novo personagem
  const create = useCallback(
    async (data) => {
      if (!user?.uid) throw new Error("Usuário não autenticado");

      try {
        setLoading(true);
        setError(null);
        const result = await APIService.createCharacter({
          userId: user.uid,
          ...data,
        });

        if (result.data) {
          loadCharacter(result.data);
        }
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, loadCharacter],
  );

  // Listar personagens
  const list = useCallback(async () => {
    if (!user?.uid) throw new Error("Usuário não autenticado");

    try {
      setLoading(true);
      setError(null);

      const result = await APIService.getCharacters(user.uid);

      // FIX: Carrega automaticamente a primeira ficha encontrada no Store
      if (result.success && result.data && result.data.length > 0) {
        console.log(
          "[Hook] Carregando personagem na tela:",
          result.data[0].nome,
        );
        loadCharacter(result.data[0]);
      } else {
        console.log(
          "[Hook] Nenhum personagem encontrado no Firestore para este usuário.",
        );
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Obter um personagem
  const get = useCallback(
    async (id) => {
      if (!id || id === "new") return;

      try {
        setLoading(true);
        setError(null);

        const result = await APIService.getCharacter(id);

        if (result.data) {
          loadCharacter(result.data);
        }
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadCharacter],
  );

  // Atualizar personagem
  const update = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        setError(null);

        const result = await APIService.updateCharacter(id, data);

        if (result.data) {
          loadCharacter(result.data);
        }
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadCharacter],
  );

  // Deletar personagem
  const delete_ = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      return await APIService.deleteCharacter(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Duplicar personagem
  const duplicate = useCallback(
    async (id) => {
      if (!user?.uid) throw new Error("Usuário não autenticado");

      try {
        setLoading(true);
        setError(null);
        return await APIService.duplicateCharacter(id, user.uid);
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  return {
    // Estado
    loading,
    error,
    character,

    // Métodos
    create,
    list,
    get,
    update,
    delete: delete_,
    duplicate,
  };
}

export default useCharacterAPI;
