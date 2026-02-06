/**
 * Hook para inicializar um novo personagem com valores padrão
 */

import {useCallback} from "react";
import {useCharacterStore} from "@/stores/characterStore";
import {RANKS} from "@/lib/rpgEngine";

export const useNewCharacter = () => {
  const updateCharacter = useCharacterStore((state) => state.updateCharacter);

  const createNewCharacter = useCallback(
    (baseData = {}) => {
      const newCharacter = {
        nome: baseData.nome || "Novo Caçador",
        conceito: baseData.conceito || "",
        arquetipo: baseData.arquetipo || "Guerreiro",
        rank: baseData.rank || RANKS[0], // D Rank

        // Atributos (0-5)
        agilidade: baseData.agilidade || 3,
        inteligencia: baseData.inteligencia || 3,
        espirito: baseData.espirito || 3,
        forca: baseData.forca || 3,
        vigor: baseData.vigor || 3,

        // Stats calculados automaticamente
        defesa: 0,
        aparar: 0,
        resistencia: 0,
        mana: 0,
        vida: 0,

        // Listas dinâmicas vazias
        pericias: [],
        armas: [
          {
            nome: "Mãos Vazias",
            dano: "1d4",
            alcance: "Corpo",
            notas: "Ataque desarmado padrão",
          },
        ],
        armaduras: [],
        itens: [],
        vantagens: [],
        magias: [],
        complicacoes: [],

        // Notas
        notas: "",
      };

      updateCharacter(newCharacter);
      return newCharacter;
    },
    [updateCharacter]
  );

  return {createNewCharacter};
};

export default useNewCharacter;
