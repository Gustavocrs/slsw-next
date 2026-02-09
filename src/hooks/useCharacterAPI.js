/**
 * Hook - useCharacterAPI
 * Hook React para gerenciar interações com a API de personagens
 * Conecta o front-end (Zustand) com o serviço do Firebase (api.js)
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

  // Criar novo personagem (Usa saveCharacter que gerencia create/update)
  const create = useCallback(
    async (data) => {
      if (!user?.uid) throw new Error("Usuário não autenticado");

      try {
        setLoading(true);
        setError(null);

        // CORREÇÃO: Usa saveCharacter em vez de createCharacter
        const result = await APIService.saveCharacter(user.uid, data);

        if (result) {
          loadCharacter(result);
        }
        return result;
      } catch (err) {
        console.error("Erro ao criar:", err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, loadCharacter],
  );

  // Listar personagens (Busca a ficha única do usuário)
  const list = useCallback(async () => {
    if (!user?.uid) return; // Não lança erro, apenas retorna se não logado

    try {
      setLoading(true);
      setError(null);

      // CORREÇÃO: Chama getCharacter (singular) e não getCharacters
      const result = await APIService.getCharacter(user.uid);

      if (result) {
        loadCharacter(result);
      } else {
        console.log("Nenhum personagem encontrado para este usuário.");
      }
      return result;
    } catch (err) {
      console.error("Erro ao listar:", err);
      setError(err.message);
      // Não relança erro no list para não quebrar a UI inicial
    } finally {
      setLoading(false);
    }
  }, [user, loadCharacter]);

  // Atualizar personagem
  const update = useCallback(
    async (id, data) => {
      if (!user?.uid) throw new Error("Usuário não autenticado");

      try {
        setLoading(true);
        setError(null);

        // CORREÇÃO: Usa saveCharacter para garantir consistência
        const result = await APIService.saveCharacter(user.uid, data);

        if (result) {
          loadCharacter(result);
        }
        return result;
      } catch (err) {
        console.error("Erro ao atualizar:", err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, loadCharacter],
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
    create,
    list,
    update,
    delete: delete_,
    duplicate,
    loading,
    error,
  };
}
