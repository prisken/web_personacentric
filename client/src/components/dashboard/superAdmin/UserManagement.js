import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

const UserManagement = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/super-admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch users');
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/super-admin/users/${userId}/role`, {
        role: newRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(t('superAdmin.users.deleteConfirm'))) return;

    try {
      await axios.delete(`/api/super-admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-management">
      <h2>{t('superAdmin.users.title')}</h2>
      
      <div className="user-list">
        <table>
          <thead>
            <tr>
              <th>{t('superAdmin.users.email')}</th>
              <th>{t('superAdmin.users.name')}</th>
              <th>{t('superAdmin.users.role')}</th>
              <th>{t('superAdmin.users.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{`${user.first_name} ${user.last_name}`}</td>
                <td>
                  <select 
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={user.role === 'super_admin'}
                  >
                    <option value="client">Client</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEditModal(true);
                    }}
                    className="edit-button"
                  >
                    {t('superAdmin.users.edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-button"
                    disabled={user.role === 'super_admin'}
                  >
                    {t('superAdmin.users.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>{t('superAdmin.users.editUser')}</h3>
            {/* Add edit form here */}
            <button onClick={() => setShowEditModal(false)}>
              {t('common.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
