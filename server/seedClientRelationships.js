const { User, ClientRelationship } = require('./models');
const { v4: uuidv4 } = require('uuid');

async function seedClientRelationships() {
  try {
    console.log('Seeding client relationships...');

    // Get all agents
    const agents = await User.findAll({
      where: { role: 'agent' }
    });

    // Get all clients
    const clients = await User.findAll({
      where: { role: 'client' }
    });

    if (agents.length === 0) {
      console.log('No agents found. Please create agents first.');
      return;
    }

    if (clients.length === 0) {
      console.log('No clients found. Please create clients first.');
      return;
    }

    // Create mock client relationships
    const mockRelationships = [];

    // Assign 2-4 clients to each agent
    agents.forEach((agent, agentIndex) => {
      const numClients = Math.min(2 + (agentIndex % 3), clients.length); // 2-4 clients per agent
      const startIndex = (agentIndex * 3) % clients.length;
      
      for (let i = 0; i < numClients; i++) {
        const clientIndex = (startIndex + i) % clients.length;
        const client = clients[clientIndex];
        
        // Skip if relationship already exists
        const existingRelationship = mockRelationships.find(
          rel => rel.agent_id === agent.id && rel.client_id === client.id
        );
        
        if (!existingRelationship) {
          mockRelationships.push({
            id: uuidv4(),
            agent_id: agent.id,
            client_id: client.id,
            status: 'active',
            commission_rate: 0.08 + (Math.random() * 0.04), // 8-12%
            total_commission: Math.random() * 5000, // 0-5000
            notes: `Mock relationship for ${agent.first_name} and ${client.first_name}`,
            relationship_start_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
            last_contact_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
            client_goals: {
              primary_goal: ['retirement', 'investment', 'tax_planning'][Math.floor(Math.random() * 3)],
              secondary_goals: ['education', 'home_purchase', 'wealth_preservation'].slice(0, Math.floor(Math.random() * 2) + 1)
            },
            risk_tolerance: ['conservative', 'moderate', 'aggressive'][Math.floor(Math.random() * 3)],
            investment_horizon: ['short_term', 'medium_term', 'long_term'][Math.floor(Math.random() * 3)]
          });
        }
      }
    });

    // Insert relationships
    for (const relationship of mockRelationships) {
      try {
        await ClientRelationship.create(relationship);
        console.log(`Created relationship: ${relationship.agent_id} -> ${relationship.client_id}`);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log(`Relationship already exists: ${relationship.agent_id} -> ${relationship.client_id}`);
        } else {
          console.error('Error creating relationship:', error.message);
        }
      }
    }

    console.log(`Successfully seeded ${mockRelationships.length} client relationships`);
  } catch (error) {
    console.error('Error seeding client relationships:', error);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedClientRelationships()
    .then(() => {
      console.log('Client relationships seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedClientRelationships; 