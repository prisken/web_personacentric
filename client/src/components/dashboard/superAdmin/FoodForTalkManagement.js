import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiService from '../../../services/api';
import SuperAdminParticipantDetailsModal from '../../food-for-talk/SuperAdminParticipantDetailsModal';

const FoodForTalkManagement = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [agents, setAgents] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  
  // Event settings state
  const [eventSettings, setEventSettings] = useState({
    event_start_date: null,
    countdown_header_text: '距離活動開始還有',
    is_event_active: false,
    show_countdown: false,
    event_status: 'upcoming'
  });
  const [showEventSettings, setShowEventSettings] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    fetchParticipants();
    fetchStats();
    fetchEventSettings();
    fetchAgents();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await apiService.getFoodForTalkAdminParticipants();
      setParticipants(response.participants);
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast.error('Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.getFoodForTalkStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchEventSettings = async () => {
    try {
      const response = await apiService.get('/super-admin/food-for-talk/event-settings');
      if (response.success) {
        // Ensure event_start_date is valid or set to null
        const settings = { ...response.settings };
        if (settings.event_start_date) {
          const date = new Date(settings.event_start_date);
          if (isNaN(date.getTime())) {
            settings.event_start_date = null;
          }
        }
        setEventSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching event settings:', error);
      toast.error('Failed to fetch event settings');
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await apiService.getAgents();
      if (res.success) setAgents(res.data || []);
    } catch (e) {
      console.error('Error fetching agents:', e);
    }
  };

  const updateEventSettings = async (updatedSettings) => {
    // Validate required fields
    if (!updatedSettings.event_start_date) {
      toast.error('Event start date is required');
      return;
    }

    // Validate that the date is valid
    const date = new Date(updatedSettings.event_start_date);
    if (isNaN(date.getTime())) {
      toast.error('Please enter a valid event start date');
      return;
    }

    setSettingsLoading(true);
    try {
      const response = await apiService.put('/super-admin/food-for-talk/event-settings', updatedSettings);
      if (response.success) {
        setEventSettings(response.settings);
        toast.success('Event settings updated successfully');
        setShowEventSettings(false);
      }
    } catch (error) {
      console.error('Error updating event settings:', error);
      toast.error('Failed to update event settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleToggleStatus = async (participantId, currentStatus) => {
    try {
      const newStatus = !currentStatus; // Toggle the status
      await apiService.toggleFoodForTalkParticipantStatus(participantId, newStatus);
      toast.success(`Participant ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchParticipants();
      fetchStats();
    } catch (error) {
      console.error('Error updating participant status:', error);
      toast.error('Failed to update participant status');
    }
  };

  const handleDeleteParticipant = async (participantId) => {
    if (!window.confirm('Are you sure you want to delete this participant?')) {
      return;
    }

    try {
      await apiService.deleteFoodForTalkParticipant(participantId);
      toast.success('Participant deleted successfully');
      fetchParticipants();
      fetchStats();
    } catch (error) {
      console.error('Error deleting participant:', error);
      toast.error('Failed to delete participant');
    }
  };

  const handleRegeneratePasskey = async (participantId) => {
    try {
      const response = await apiService.regenerateFoodForTalkPasskey(participantId);
      toast.success('New passkey generated');
      fetchParticipants();
    } catch (error) {
      console.error('Error regenerating passkey:', error);
      toast.error('Failed to regenerate passkey');
    }
  };

  const handleParticipantUpdated = (updatedParticipant) => {
    // Refresh the participants list to show updated data
    fetchParticipants();
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = 
      participant.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.occupation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && participant.is_active) ||
      (filterStatus === 'inactive' && !participant.is_active);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🍽️ Food for Talk Event Management</h2>
        <p className="text-gray-600">Manage participants for the Food for Talk speed dating event</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Verified</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verifiedParticipants || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMessages || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Event Status</p>
              <p className="text-2xl font-bold text-gray-900">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Settings Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Event Settings</h3>
          <button
            onClick={() => setShowEventSettings(!showEventSettings)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showEventSettings ? 'Hide Settings' : 'Manage Event Settings'}
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={async () => {
              if (!window.confirm('Clear ALL public chat messages? This cannot be undone.')) return;
              try {
                await apiService.clearFoodForTalkPublicChat();
                toast.success('Public chat history cleared');
                fetchStats();
              } catch (e) {
                console.error('Clear chat error:', e);
                toast.error('Failed to clear chat history');
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear Public Chat History
          </button>
        </div>
        
        {showEventSettings && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={eventSettings.event_start_date ? 
                    (() => {
                      const date = new Date(eventSettings.event_start_date);
                      // Check if date is valid
                      if (isNaN(date.getTime())) {
                        return '';
                      }
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      return `${year}-${month}-${day}T${hours}:${minutes}`;
                    })() : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      // Parse the datetime-local value and convert to ISO string
                      const [datePart, timePart] = e.target.value.split('T');
                      const [year, month, day] = datePart.split('-');
                      const [hours, minutes] = timePart.split(':');
                      
                      const localDate = new Date(
                        parseInt(year), 
                        parseInt(month) - 1, 
                        parseInt(day), 
                        parseInt(hours), 
                        parseInt(minutes)
                      );
                      
                      setEventSettings({
                        ...eventSettings,
                        event_start_date: localDate.toISOString()
                      });
                    } else {
                      setEventSettings({
                        ...eventSettings,
                        event_start_date: null
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Countdown Header Text
                </label>
                <input
                  type="text"
                  value={eventSettings.countdown_header_text}
                  onChange={(e) => setEventSettings({
                    ...eventSettings,
                    countdown_header_text: e.target.value
                  })}
                  placeholder="距離活動開始還有"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Status
                </label>
                <select
                  value={eventSettings.event_status}
                  onChange={(e) => setEventSettings({
                    ...eventSettings,
                    event_status: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_event_active"
                  checked={eventSettings.is_event_active}
                  onChange={(e) => setEventSettings({
                    ...eventSettings,
                    is_event_active: e.target.checked
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_event_active" className="ml-2 block text-sm text-gray-700">
                  Event is Active
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show_countdown"
                  checked={eventSettings.show_countdown}
                  onChange={(e) => setEventSettings({
                    ...eventSettings,
                    show_countdown: e.target.checked
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="show_countdown" className="ml-2 block text-sm text-gray-700">
                  Show Countdown
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEventSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updateEventSettings(eventSettings)}
                disabled={settingsLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {settingsLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Participants ({filteredParticipants.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Secret Passkey
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assign Agent
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParticipants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {participant.profile_photo_url ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={participant.profile_photo_url}
                            alt={`${participant.first_name} ${participant.last_name}`}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {participant.first_name.charAt(0)}{participant.last_name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {participant.first_name} {participant.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Age: {participant.age}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{participant.email}</div>
                    <div className="text-sm text-gray-500">{participant.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{participant.occupation}</div>
                    <div className="text-sm text-gray-500">
                      {(() => {
                        let interests = participant.interests;
                        if (typeof interests === 'string') {
                          try {
                            interests = JSON.parse(interests);
                          } catch (e) {
                            interests = [];
                          }
                        }
                        if (interests && Array.isArray(interests) && interests.length > 0) {
                          return <span>{interests.slice(0, 2).join(', ')}</span>;
                        }
                        return null;
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {participant.secret_passkey ? (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          {participant.secret_passkey}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No passkey</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      participant.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {participant.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {participant.secret_passkey ? 'Has Passkey' : 'No Passkey'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedParticipantId(participant.id);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleToggleStatus(participant.id, participant.is_active)}
                        className={`${
                          participant.is_active
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {participant.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      {participant.secret_passkey && (
                        <button
                          onClick={() => handleRegeneratePasskey(participant.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          New Passkey
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteParticipant(participant.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <select
                        disabled={assigningId === participant.id}
                        className="px-2 py-1 border rounded"
                        value={participant.assigned_agent_id || ''}
                        onChange={async (e) => {
                          const val = e.target.value;
                          try {
                            setAssigningId(participant.id);
                            if (val) {
                              await apiService.assignFoodForTalkParticipantAgent(participant.id, val);
                              toast.success('Agent assigned');
                            } else {
                              await apiService.unassignFoodForTalkParticipantAgent(participant.id);
                              toast.success('Agent unassigned');
                            }
                            fetchParticipants();
                          } catch (err) {
                            console.error('Assign agent error:', err);
                            toast.error('Failed to update assignment');
                          } finally {
                            setAssigningId(null);
                          }
                        }}
                      >
                        <option value="">-- None --</option>
                        {agents.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.first_name} {a.last_name} ({a.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Super Admin Participant Details Modal */}
      <SuperAdminParticipantDetailsModal
        participantId={selectedParticipantId}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedParticipantId(null);
        }}
        onParticipantUpdated={handleParticipantUpdated}
      />
    </div>
  );
};

export default FoodForTalkManagement;
