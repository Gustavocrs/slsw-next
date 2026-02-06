/**
 * Hook - useCharacterAPI
 * Hook React para gerenciar interações com a API de personagens
 * Com fallback para localStorage quando backend não está disponível
 */

import {useCallback, useState} from "react";
import APIService from "@/lib/api";
import LocalStorageAPI from "@/lib/localStorageAPI";
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
        let result;
        
        try {
          result = await APIService.createCharacter({
            userId: user.uid,
            ...data,
          });
        } catch (apiError) {
          console.warn("Backend indisponível. Usando localStorage...");
          result = LocalStorageAPI.createCharacter({
            userId: user.uid,
            ...data,
          });
        }
        
        loadCharacter(result.data);
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
      
      try {
        return await APIService.getCharacters(user.uid);
      } catch (apiError) {
        console.warn("Backend indisponível. Usando localStorage...");
        return LocalStorageAPI.getCharacters(user.uid);
      }
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
      try {
        setLoading(true);
        setError(null);
        
        let result;
        try {
          result = await APIService.getCharacter(id);
        } catch (apiError) {
          console.warn("Backend indisponível. Usando localStorage...");
          result = LocalStorageAPI.getCharacter(id);
        }
        
        loadCharacter(result.data);
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
        
        let result;
        try {
          result = await APIService.updateCharacter(id, data);
        } catch (apiError) {
          console.warn("Backend indisponível. Usando localStorage...");
          result = LocalStorageAPI.updateCharacter(id, data);
        }
        
        loadCharacter(result.data);
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
      
      try {
        return await APIService.deleteCharacter(id);
      } catch (apiError) {
        console.warn("Backend indisponível. Usando localStorage...");
        return LocalStorageAPI.deleteCharacter(id);
      }
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

  // Obter stats
  const getStats = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      return await APIService.getCharacterStats(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
    getStats,
  };
}

export default useCharacterAPI;
