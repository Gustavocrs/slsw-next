/**
 * Hook useActiveScenario
 * Exibe o cenário ativo e suas funcionalidades para os componentes React.
 * Suporta cenário por mesa (via selectedTable) ou global (via env var).
 */

import {useMemo} from "react";
import * as ScenarioRegistry from "@/scenarios/index.js";
import {useUIStore} from "@/stores/characterStore";

export function useActiveScenario() {
  const selectedTable = useUIStore((state) => state.selectedTable);
  const scenarioIdFromTable = selectedTable?.scenarioId || null;
  
  const scenario = useMemo(
    () => ScenarioRegistry.getActiveScenario(scenarioIdFromTable),
    [scenarioIdFromTable],
  );

  const value = useMemo(
    () => ({
      id: scenario.metadata?.id || "unknown",
      name: scenario.metadata?.name || "Unknown",
      description: scenario.metadata?.description || "",
      edges: scenario.edges || [],
      hindrances: scenario.hindrances || [],
      powers: scenario.powers || {},
      adventureGenerator: scenario.adventureGenerator || null,
      promptStyles: scenario.promptStyles || {},
      skills: scenario.skills || {},
      calculateMaxMana: scenario.calculateMaxMana || null,
      extraFields: scenario.extraFields || {},
    }),
    [scenario],
  );

  return value;
}

export function useScenario(id) {
  const scenario = useMemo(() => ScenarioRegistry.getScenario(id), [id]);

  return scenario;
}

export function useAvailableScenarios() {
  return useMemo(() => ScenarioRegistry.getAvailableScenarios(), []);
}

export function useScenarioPromptStyles() {
  const scenario = useActiveScenario();
  return scenario.promptStyles;
}

export function useScenarioExtraFields() {
  const scenario = useActiveScenario();
  return scenario.extraFields;
}

export function useScenarioCalculateMaxMana() {
  const scenario = useActiveScenario();
  return scenario.calculateMaxMana;
}

export function useCurrentTableScenarioId() {
  const selectedTable = useUIStore((state) => state.selectedTable);
  return selectedTable?.scenarioId || null;
}

export default useActiveScenario;