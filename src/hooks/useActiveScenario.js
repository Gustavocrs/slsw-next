/**
 * Hook useActiveScenario
 * Exibe o cenário ativo e suas funcionalidades para os componentes React.
 * Suporta cenário por mesa (via selectedTable) ou global (via env var).
 * Auto-carrega dados do Firestore se disponíveis.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import * as ScenarioRegistry from "@/scenarios/index.js";
import { useUIStore } from "@/stores/characterStore";

export function useActiveScenario() {
  const selectedTable = useUIStore((state) => state.selectedTable);
  const scenarioIdFromTable = selectedTable?.scenarioId || null;

  // Determinar qual scenarioId usar
  const scenarioId = useMemo(() => {
    if (scenarioIdFromTable) return scenarioIdFromTable;
    return process.env.NEXT_PUBLIC_ACTIVE_SCENARIO || "solo-leveling";
  }, [scenarioIdFromTable]);

  const [fullScenario, setFullScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados completos (registry + Firestore)
  const loadScenario = useCallback(async () => {
    if (!scenarioId) return;

    setIsLoading(true);
    try {
      // Tentar carregar do Firestore (vai atualizar cache automaticamente)
      const loaded =
        await ScenarioRegistry.loadScenarioFromFirestore(scenarioId);
      if (loaded) {
        setFullScenario(loaded);
      } else {
        // Se não achou no Firestore, usar apenas registry
        const base = ScenarioRegistry.getScenario(scenarioId);
        setFullScenario(base);
      }
    } catch (error) {
      console.error("Erro ao carregar cenário:", error);
      const base = ScenarioRegistry.getScenario(scenarioId);
      setFullScenario(base);
    } finally {
      setIsLoading(false);
    }
  }, [scenarioId]);

  // Carregar na montagem ou quando scenarioId mudar
  useEffect(() => {
    loadScenario();
  }, [loadScenario]);

  const value = useMemo(() => {
    if (!fullScenario) {
      return {
        id: "loading",
        name: "Loading...",
        description: "",
        edges: [],
        hindrances: [],
        powers: {},
        adventureGenerator: null,
        promptStyles: {},
        skills: {},
        calculateMaxMana: null,
        extraFields: {},
        isLoading: true,
      };
    }

    return {
      id: fullScenario.metadata?.id || "unknown",
      name: fullScenario.metadata?.name || "Unknown",
      description: fullScenario.metadata?.description || "",
      edges: fullScenario.edges || [],
      hindrances: fullScenario.hindrances || [],
      powers: fullScenario.powers || {},
      adventureGenerator: fullScenario.adventureGenerator || null,
      promptStyles: fullScenario.promptStyles || {},
      skills: fullScenario.skills || {},
      calculateMaxMana: fullScenario.calculateMaxMana || null,
      extraFields: fullScenario.extraFields || {},
      isLoading,
    };
  }, [fullScenario, isLoading]);

  return value;
}

export function useScenario(id) {
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const loaded = await ScenarioRegistry.loadScenarioFromFirestore(id);
        if (mounted) {
          setScenario(loaded || ScenarioRegistry.getScenario(id));
        }
      } catch (error) {
        if (mounted) {
          setScenario(ScenarioRegistry.getScenario(id));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  return { scenario, loading };
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
