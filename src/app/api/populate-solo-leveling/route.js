/**
 * Temporary API route to populate Solo Leveling data to Firebase
 * Remove after use!
 */

import soloLevelingScenario from "@/data/soloLevelingData.js";
import { saveScenarioToFirestore } from "@/lib/scenarioService.js";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    console.log(
      "Starting to populate Solo Leveling scenario data to Firestore via API Route...",
    );

    // Save the scenario directly to Firestore
    const result = await saveScenarioToFirestore(soloLevelingScenario);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully saved Solo Leveling scenario to Firestore!",
        data: {
          id: result.id,
          loreSectionsCount: soloLevelingScenario.loreSections.length,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error populating Solo Leveling data via API Route:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to populate Solo Leveling data",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

// Allow GET for testing in browser
export async function GET() {
  return await POST();
}
