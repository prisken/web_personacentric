import React, { useEffect, useState } from 'react';
import apiService from '../../services/api';
import { toast } from 'react-toastify';
import AgentParticipantDetailsModal from '../food-for-talk/AgentParticipantDetailsModal';

const AssignedFftParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [detailsId, setDetailsId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await apiService.get('/food-for-talk/agent/my-participants');
      if (res.success) setParticipants(res.participants);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const saveParticipant = async (id, updates) => {
    try {
      setSavingId(id);
      await apiService.put(`/food-for-talk/agent/participants/${id}`, updates);
      toast.success('Saved');
      load();
    } catch (e) {
      console.error(e);
      toast.error('Save failed');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">Loading...</div>
    );
  }

  return (
    <>
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">指派給我的參與者</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名稱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">聯絡</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Secret Passkey</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10">
                        {p.profilePhotoUrl ? (
                          <img src={p.profilePhotoUrl} alt={p.nickname || `${p.firstName} ${p.lastName}`}
                               className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {(p.nickname || p.firstName || '?').charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{p.firstName} {p.lastName}</div>
                        <div className="text-gray-500 text-sm">{p.nickname || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>{p.email}</div>
                    <div className="text-gray-500">{p.whatsappPhone || p.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setDetailsId(p.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      View Details
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">
                    {p.secretPasskey || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <AgentParticipantDetailsModal
      participantId={detailsId}
      isOpen={!!detailsId}
      onClose={() => setDetailsId(null)}
      onParticipantUpdated={() => load()}
    />
    </>
  );
};

export default AssignedFftParticipants;





