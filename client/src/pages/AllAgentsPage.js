import React, { useEffect, useState } from 'react';
import apiService from '../services/api';

// All possible filterable fields (should match backend data)
const AREAS_OF_EXPERTISE = [
  'Retirement',
  'Investment',
  'Tax',
  'Insurance',
  'Wealth Management',
  'Estate Planning',
  'Risk Management',
];
const COMMUNICATION_MODES = [
  'In-person',
  'Video',
  'Phone',
  'Digital',
];

const AllAgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCommMode, setSelectedCommMode] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [languages, setLanguages] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await apiService.get('/agents?in_matching_pool=true&status=active');
        if (response.success && Array.isArray(response.data)) {
          setAgents(response.data);
          // Extract unique languages and locations for filters
          const langs = new Set();
          const locs = new Set();
          response.data.forEach(agent => {
            (agent.languages || []).forEach(l => langs.add(l));
            if (agent.location) locs.add(agent.location);
          });
          setLanguages(Array.from(langs));
          setLocations(Array.from(locs));
        } else {
          setAgents([]);
          setLanguages([]);
          setLocations([]);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
        setAgents([]);
        setLanguages([]);
        setLocations([]);
      }
      setLoading(false);
    };
    fetchAgents();
  }, []);

  // Filtering logic
  const filteredAgents = agents.filter(agent => {
    // Search by name, bio, or expertise
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      (agent.name && agent.name.toLowerCase().includes(searchLower)) ||
      (agent.bio && agent.bio.toLowerCase().includes(searchLower)) ||
      (agent.areas_of_expertise && agent.areas_of_expertise.some(area => area.toLowerCase().includes(searchLower)));
    const matchesExpertise = !selectedExpertise || 
      (selectedExpertise === 'General' && (!agent.areas_of_expertise || agent.areas_of_expertise.length === 0)) ||
      (selectedExpertise !== 'General' && (agent.areas_of_expertise || []).includes(selectedExpertise));
    const matchesLanguage = !selectedLanguage || (agent.languages || []).includes(selectedLanguage);
    const matchesCommMode = !selectedCommMode || (agent.communication_modes || []).includes(selectedCommMode);
    const matchesLocation = !selectedLocation || agent.location === selectedLocation;
    return matchesSearch && matchesExpertise && matchesLanguage && matchesCommMode && matchesLocation;
  });

  // Categorize by area of expertise
  const categorized = {};
  AREAS_OF_EXPERTISE.forEach(cat => { categorized[cat] = []; });
  
  // Add "General" category for agents without specific expertise
  categorized['General'] = [];
  
  filteredAgents.forEach(agent => {
    const areas = agent.areas_of_expertise || [];
    if (areas.length === 0) {
      // If no specific expertise, add to General category
      categorized['General'].push(agent);
    } else {
      // Add to specific expertise categories
      areas.forEach(area => {
        if (AREAS_OF_EXPERTISE.includes(area)) {
          categorized[area].push(agent);
        } else {
          // If expertise not in predefined list, add to General
          categorized['General'].push(agent);
        }
      });
    }
  });

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">All Available Agents</h1>
        {/* Search & Filter UI */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <input
            type="text"
            placeholder="Search by name, expertise, or bio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-64"
          />
          <select value={selectedExpertise} onChange={e => setSelectedExpertise(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All Expertise</option>
            {[...AREAS_OF_EXPERTISE, 'General'].map(area => <option key={area} value={area}>{area}</option>)}
          </select>
          <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All Languages</option>
            {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
          <select value={selectedCommMode} onChange={e => setSelectedCommMode(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All Communication Modes</option>
            {COMMUNICATION_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
          </select>
          <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All Locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
        {loading ? (
          <div className="text-center text-lg text-gray-500 py-12">Loading agents...</div>
        ) : (
          [...AREAS_OF_EXPERTISE, 'General'].map(category => (
            categorized[category] && categorized[category].length > 0 && (
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
                        <p className="text-blue-600 font-semibold mb-2">{(agent.areas_of_expertise || []).join(', ')}</p>
                        <div className="mb-2 text-sm text-gray-500">
                          <span className="mr-2">Bio:</span>{agent.bio}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                          <span className="mr-2">Certifications:</span>{agent.certifications}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                          <span className="mr-2">Experience:</span>{agent.experience_years} years
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                          <span className="mr-2">Languages:</span>{(agent.languages || []).join(', ')}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                          <span className="mr-2">Preferred Clients:</span>{(agent.preferred_client_types || []).join(', ')}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                          <span className="mr-2">Communication:</span>{(agent.communication_modes || []).join(', ')}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                          <span className="mr-2">Availability:</span>{agent.availability}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                          <span className="mr-2">Location:</span>{agent.location}
                        </div>
                        <a href={`mailto:${agent.email}`} className="block w-full bg-green-600 text-white py-2 rounded-lg font-semibold text-center hover:bg-green-700 transition-colors duration-200 mt-4">
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