import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../../services/api';

const AdminManagement = () => {
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

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get('/super-admin/admins');
      const adminsData = response?.admins || [];
      setAdmins(Array.isArray(adminsData) ? adminsData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError(error.message || 'Failed to fetch admins');
      setAdmins([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await apiService.post('/super-admin/admins', newAdmin);
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
      setError(error.message || 'Failed to create admin');
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    if (!window.confirm('確定要移除此管理員嗎？')) return;

    try {
      await apiService.delete(`/super-admin/admins/${adminId}`);
      fetchAdmins();
    } catch (error) {
      setError(error.message || 'Failed to remove admin');
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
                  取消
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
