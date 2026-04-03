/**
 * Simple test script to populate just the manualSections to Firebase
 * to verify the connection works
 */

import { manualSections } from "../data/manualSections.js";
import { saveScenario } from "../lib/scenarioService.js";

// Create a minimal scenario with just the lore sections
const testScenario = {
  id: "solo-leveling-test",
  metadata: {
    id: "solo-leveling-test",
    name: "Solo Leveling Medieval (Test)",
    description: "Test scenario for verifying Firebase connection",
  },
  loreSections: manualSections.map((section) => ({
    id: section.id,
    title: section.title,
    content: section.content,
    contentHtml: section.content,
  })),
  edges: [],
  hindrances: [],
  powers: [],
  awakeningRules: [],
  extraFields: {},
  promptStyles: {},
  skills: {},
  adventureGenerator: {},
};

/**
 * Main function to populate the test data
 */
async function populateTestData() {
  try {
    console.log(
      "Starting to populate test Solo Leveling scenario data to Firebase...",
    );

    // Save the scenario to Firebase
    const result = await saveScenario(testScenario);

    console.log("Successfully saved test scenario to Firebase!");
    console.log("Scenario ID:", result.id);
    console.log("Lore sections count:", testScenario.loreSections.length);

    return result;
  } catch (error) {
    console.error("Error populating test data:", error);
    throw error;
  }
}

// Execute the population function
populateTestData()
  .then(() => {
    console.log("Test population completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test population failed:", error);
    process.exit(1);
  });
