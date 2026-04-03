/**
 * Script to populate Firestore with Solo Leveling scenario data
 * Run with: node src/scripts/populateSoloLevelingData.js
 */

// Import the solo leveling scenario data
import soloLevelingScenario from "../data/soloLevelingData.js";
// Import the scenario service to save to Firebase
import { saveScenario } from "../lib/scenarioService.js";

/**
 * Main function to populate the data
 */
async function populateSoloLevelingData() {
  try {
    console.log(
      "Starting to populate Solo Leveling scenario data to Firebase...",
    );

    // Save the scenario to Firebase
    const result = await saveScenario(soloLevelingScenario);

    console.log("Successfully saved Solo Leveling scenario to Firebase!");
    console.log("Scenario ID:", result.id);
    console.log(
      "Lore sections count:",
      soloLevelingScenario.loreSections.length,
    );

    return result;
  } catch (error) {
    console.error("Error populating Solo Leveling data:", error);
    throw error;
  }
}

// Execute the population function
populateSoloLevelingData()
  .then(() => {
    console.log("Population completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Population failed:", error);
    process.exit(1);
  });
