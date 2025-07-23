import React, { useEffect, useState } from 'react';
import apiService from '../services/api';

const CATEGORIES = [
  'Retirement',
  'Investment',
  'Tax',
  'Insurance',
  'Wealth Management',
  'Estate Planning',
  'Risk Management'
];

const AllAgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      const response = await apiService.get('/agents?in_matching_pool=true&status=active');
      if (response.success && Array.isArray(response.data)) {
        setAgents(response.data);
      } else {
        setAgents([]);
      }
      setLoading(false);
    };
    fetchAgents();
  }, []);

  // Categorize agents by their areas of expertise
  const categorized = {};
  CATEGORIES.forEach(cat => { categorized[cat] = []; });
  agents.forEach(agent => {
    if (Array.isArray(agent.areas_of_expertise)) {
      agent.areas_of_expertise.forEach(area => {
        if (CATEGORIES.includes(area)) {
          categorized[area].push(agent);
        }
      });
    }
  });

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">All Available Agents</h1>
        {loading ? (
          <div className="text-center text-lg text-gray-500 py-12">Loading agents...</div>
        ) : (
          CATEGORIES.map(category => (
            categorized[category].length > 0 && (
              <section key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-blue-700 mb-6">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categorized[category].map(agent => (
                    <div key={agent.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <img
                          src={agent.profile_image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(agent.name || agent.first_name || 'Agent')}
                          alt={agent.name || agent.first_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{agent.name || agent.first_name + ' ' + agent.last_name}</h3>
                        <p className="text-blue-600 font-semibold mb-2">{agent.areas_of_expertise?.join(', ')}</p>
                        <div className="mb-2 text-sm text-gray-500">
                          <span className="mr-2">Languages:</span>{agent.languages?.join(', ')}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                          <span className="mr-2">Location:</span>{agent.location}
                        </div>
                        <a href="#contact" className="block w-full bg-green-600 text-white py-2 rounded-lg font-semibold text-center hover:bg-green-700 transition-colors duration-200 mt-4">
                          View / Contact
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          ))
        )}
      </div>
    </div>
  );
};

export default AllAgentsPage; 