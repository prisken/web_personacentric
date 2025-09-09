import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useUser } from '../../../contexts/UserContext';

const AdminManagement = () => {
  const { t } = useTranslation();
  const { token } = useUser();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    permissions: {}
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/api/super-admin/admins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(response.data.admins);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch admins');
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/super-admin/admins', newAdmin, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCreateModal(false);
      setNewAdmin({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        permissions: {}
      });
      fetchAdmins();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create admin');
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return;

    try {
      await axios.delete(`/api/super-admin/admins/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdmins();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to remove admin');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-management">
      <h2>Admin Management</h2>
      
      <button
        onClick={() => setShowCreateModal(true)}
        className="create-button"
      >
        Create Admin
      </button>

      <div className="admin-list">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td>{admin.email}</td>
                <td>{`${admin.first_name} ${admin.last_name}`}</td>
                <td>{admin.role}</td>
                <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                <td>
                  {admin.role !== 'super_admin' && (
                    <button
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create Admin</h3>
            <form onSubmit={handleCreateAdmin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({
                    ...newAdmin,
                    email: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({
                    ...newAdmin,
                    password: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={newAdmin.first_name}
                  onChange={(e) => setNewAdmin({
                    ...newAdmin,
                    first_name: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={newAdmin.last_name}
                  onChange={(e) => setNewAdmin({
                    ...newAdmin,
                    last_name: e.target.value
                  })}
                  required
                />
              </div>
              <div className="button-group">
                <button type="submit">
                  Create Admin
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
