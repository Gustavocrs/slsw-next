/**
 * Simple script to populate Solo Leveling data using the existing API endpoint
 * Run with: node src/scripts/simple-populate.js
 */

import soloLevelingScenario from "../data/soloLevelingData.js";

/**
 * Main function to populate the data via API
 */
async function populateSoloLevelingData() {
  try {
    console.log(
      "Starting to populate Solo Leveling scenario data to Firebase via API...",
    );

    // Call the API endpoint to save the scenario
    const response = await fetch("http://localhost:3000/api/scenarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(soloLevelingScenario),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log("Successfully saved Solo Leveling scenario to Firebase!");
    console.log("Response:", result);
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
