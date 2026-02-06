/**
 * Hook - useCombatStats
 * Cálculos de combate automáticos
 */

import {useEffect} from "react";
import {useCharacterStore} from "@/stores/characterStore";
import {calculateDefense, calculateParry, SKILLS} from "@/lib/rpgEngine";

export function useCombatStats() {
  const character = useCharacterStore((state) => state.character);
  const updateAttribute = useCharacterStore((state) => state.updateAttribute);

  // Recalcular stats quando atributos relevantes mudam
  useEffect(() => {
    const vigorDie = character.vigor || "d4";
    const fightingDie = character.lutar || "d4";

    const newDefesa = calculateDefense(vigorDie, character.armadura_bonus || 0);
    const newAparar = calculateParry(fightingDie, character.aparar_bonus || 0);

    if (newDefesa !== character.defesa) {
      updateAttribute("defesa", newDefesa);
    }
    if (newAparar !== character.aparar) {
      updateAttribute("aparar", newAparar);
    }
  }, [
    character.vigor,
    character.lutar,
    character.armadura_bonus,
    character.aparar_bonus,
    updateAttribute,
  ]);

  // Calcular modificadores de perícia
  const getSkillModifier = (skillName) => {
    const pericias = character.pericias || [];
    const skill = pericias.find((s) => s.name === skillName);
    return skill ? skill.modifier || 0 : 0;
  };

  // Calcular valor de dano
  const calculateDamage = (weaponDamage, forcaDie) => {
    const forcaVal = parseInt(forcaDie.replace("d", "")) || 4;
    // Simplificado: força base + dano da arma
    return forcaVal + parseInt(weaponDamage || 0);
  };

  return {
    defesa: character.defesa,
    aparar: character.aparar,
    armadura: character.armadura_bonus || 0,
    wounds: character.wounds || 0,
    fatigue: character.fatigue || 0,
    getSkillModifier,
    calculateDamage,
  };
}

export default useCombatStats;
