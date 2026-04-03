import soloLevelingScenario from '../data/soloLevelingData.js';

async function populateSoloLevelingData() {
  try {
    console.log('Starting to populate Solo Leveling scenario data to Firebase...');
    console.log(`Lore sections to import: ${soloLevelingScenario.loreSections.length}`);
    
    // Call the API endpoint to UPDATE the existing solo-leveling scenario
    const response = await fetch('http://localhost:3000/api/scenarios?id=solo-leveling', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(soloLevelingScenario),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    
    console.log('✅ Successfully saved Solo Leveling scenario to Firebase!');
    console.log(`📝 Scenario ID: ${result.id}`);
    console.log(`📚 Lore sections saved: ${soloLevelingScenario.loreSections.length}`);
    console.log(`⚔️  Edges saved: ${soloLevelingScenario.edges.length}`);
    console.log(`🛡️  Hindrances saved: ${soloLevelingScenario.hindrances.length}`);
    console.log(`💥 Powers saved: ${soloLevelingScenario.powers.length}`);
    console.log(`🔮 Awakening rules saved: ${soloLevelingScenario.awakeningRules.length}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error populating Solo Leveling data:', error.message);
    throw error;
  }
}

// Execute the population function
populateSoloLevelingData()
  .then(() => {
    console.log('\n🎉 Population completed successfully!');
    console.log('You can now verify the data by visiting:');
    console.log('http://localhost:3000/api/scenarios?id=solo-leveling');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Population failed:', error.message);
    process.exit(1);
  });
