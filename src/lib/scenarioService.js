/**
 * Scenario Service
 * Funções de acesso ao banco de dados para cenários
 */

import APIService from "./api";

const API_BASE = "/api/scenarios";

export async function getAllScenarios() {
  try {
    const response = await fetch(API_BASE, {method: "GET"});
    if (!response.ok) {
      throw new Error("Erro ao buscar cenários");
    }
    return await response.json();
  } catch (error) {
    console.error("getAllScenarios error:", error);
    return [];
  }
}

export async function getScenarioById(id) {
  try {
    const response = await fetch(`${API_BASE}?id=${id}`, {method: "GET"});
    if (!response.ok) {
      console.warn(`Cenário "${id}" não encontrado no Firestore, usando fallback local`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("getScenarioById error:", error);
    return null;
  }
}

export async function saveScenario(scenarioData) {
  try {
    const {id} = scenarioData;
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_BASE}?id=${id}` : API_BASE;
    
    const response = await fetch(url, {
      method,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(scenarioData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao salvar cenário");
    }
    
    return await response.json();
  } catch (error) {
    console.error("saveScenario error:", error);
    throw error;
  }
}

export async function updateScenarioSection(scenarioId, section, data) {
  try {
    const scenario = await getScenarioById(scenarioId);
    if (!scenario) {
      console.warn(`Cenário "${scenarioId}" não encontrado para atualização`);
      return null;
    }

    const updatedScenario = {
      ...scenario,
      [section]: data,
    };

    return await saveScenario(updatedScenario);
  } catch (error) {
    console.error("updateScenarioSection error:", error);
    return null;
  }
}

export async function deleteScenario(id) {
  try {
    const response = await fetch(`${API_BASE}?id=${id}`, {method: "DELETE"});
    
    if (!response.ok) {
      throw new Error("Erro ao excluir cenário");
    }
    
    return await response.json();
  } catch (error) {
    console.error("deleteScenario error:", error);
    throw error;
  }
}

export async function exportScenarioToJSON(id) {
  const scenario = await getScenarioById(id);
  if (!scenario) {
    console.warn(`Cenário "${id}" não encontrado para exportar`);
    return;
  }
  
  const jsonString = JSON.stringify(scenario, null, 2);
  const blob = new Blob([jsonString], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${id}_scenario.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

export async function importScenarioFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (!data.metadata?.id) {
          throw new Error("JSON inválido: metadata.id é obrigatório");
        }
        
        await saveScenario(data);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsText(file);
  });
}

export default {
  getAllScenarios,
  getScenarioById,
  saveScenario,
  updateScenarioSection,
  deleteScenario,
  exportScenarioToJSON,
  importScenarioFromJSON,
};