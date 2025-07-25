import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
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
  const { t } = useLanguage();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCommMode, setSelectedCommMode] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [languages, setLanguages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [expandedAgents, setExpandedAgents] = useState(new Set());

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

  // Toggle agent profile expansion
  const toggleAgentExpansion = (agentId) => {
    const newExpanded = new Set(expandedAgents);
    if (newExpanded.has(agentId)) {
      newExpanded.delete(agentId);
    } else {
      newExpanded.add(agentId);
    }
    setExpandedAgents(newExpanded);
  };

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
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">{t('all_available_agents')}</h1>
        
        {/* Search & Filter UI - Mobile Optimized */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {/* Search Bar */}
          <div className="w-full">
            <input
              type="text"
              placeholder={t('search_by_name_expertise_bio')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filter Dropdowns - Mobile: Stacked, Desktop: Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap gap-2 sm:gap-3 lg:gap-4">
            <select 
              value={selectedExpertise} 
              onChange={e => setSelectedExpertise(e.target.value)} 
              className="border rounded-lg px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t('all_expertise')}</option>
              {[...AREAS_OF_EXPERTISE, 'General'].map(area => <option key={area} value={area}>{area}</option>)}
            </select>
            <select 
              value={selectedLanguage} 
              onChange={e => setSelectedLanguage(e.target.value)} 
              className="border rounded-lg px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t('all_languages')}</option>
              {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
            <select 
              value={selectedCommMode} 
              onChange={e => setSelectedCommMode(e.target.value)} 
              className="border rounded-lg px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t('all_communication_modes')}</option>
              {COMMUNICATION_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
            </select>
            <select 
              value={selectedLocation} 
              onChange={e => setSelectedLocation(e.target.value)} 
              className="border rounded-lg px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t('all_locations')}</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-lg text-gray-500 py-12">{t('loading_agents')}</div>
        ) : (
          [...AREAS_OF_EXPERTISE, 'General'].map(category => (
            categorized[category] && categorized[category].length > 0 && (
              <section key={category} className="mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 sm:mb-6">{category}</h2>
                {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 3 columns */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
                  {categorized[category].map(agent => (
                    <div key={agent.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-100">
                      {/* Header with image */}
                      <div className="relative">
                        <div className="h-24 sm:h-32 lg:h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                          <img
                            src={agent.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name || agent.first_name || 'Agent')}&background=4F46E5&color=fff&size=200&font-size=0.6`}
                            alt={agent.name || agent.first_name}
                            className="w-full h-full object-cover opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          
                          {/* Agent Name and Title */}
                          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white">
                            <h3 className="text-sm sm:text-base lg:text-xl font-bold mb-1">{agent.name || agent.first_name + ' ' + agent.last_name}</h3>
                            <p className="text-xs sm:text-sm lg:text-base text-blue-100 font-medium">{agent.areas_of_expertise?.[0] || 'Financial Advisor'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 sm:p-4 lg:p-6">
                        {/* Expertise Tags */}
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
                          {agent.areas_of_expertise?.slice(0, 2).map((expertise, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                              {expertise}
                            </span>
                          ))}
                        </div>

                        {/* Bio - Truncated on mobile */}
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                          {agent.bio}
                        </p>

                        {/* Stats Row - Compact on mobile */}
                        <div className="flex items-center justify-between mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                          <div className="flex items-center">
                            <div className="flex items-center mr-2 sm:mr-4">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(agent.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-semibold text-gray-700">{agent.rating || 4.5}</span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              <span className="font-semibold">{agent.experience_years || '8'}</span> years
                            </div>
                          </div>
                        </div>

                        {/* Expandable Details */}
                        <div className="space-y-2 sm:space-y-3">
                          {/* Toggle Button */}
                          <button 
                            onClick={() => toggleAgentExpansion(agent.id)}
                            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-xs sm:text-sm flex items-center justify-center"
                          >
                            <span>{expandedAgents.has(agent.id) ? 'Hide Details' : 'View Details'}</span>
                            <svg 
                              className={`ml-2 w-4 h-4 transition-transform duration-200 ${expandedAgents.has(agent.id) ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Expanded Content */}
                          {expandedAgents.has(agent.id) && (
                            <div className="space-y-2 sm:space-y-3 animate-fade-in">
                              {/* Key Info Grid */}
                              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                  </svg>
                                  <span className="truncate">{agent.languages?.[0] || 'English'}</span>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="truncate">{agent.location}</span>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  <span className="truncate">{agent.communication_modes?.[0] || 'Video'}</span>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="truncate">{agent.availability?.split(' ')[0] || 'Mon-Fri'}</span>
                                </div>
                              </div>

                              {/* Full Bio */}
                              <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                <p className="line-clamp-3">{agent.bio}</p>
                              </div>
                            </div>
                          )}

                          {/* Contact Button */}
                          <a 
                            href={`mailto:${agent.email}`} 
                            className="block w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-center hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                          >
                            {t('contact_now')}
                          </a>
                        </div>
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