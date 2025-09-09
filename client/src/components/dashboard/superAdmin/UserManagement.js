import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get('/super-admin/users');
      
      // Ensure users is always an array
      const usersData = response?.users || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
      setUsers([]); // Set empty array on error
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiService.put(`/super-admin/users/${userId}/role`, {
        role: newRole
      });
      fetchUsers();
    } catch (error) {
      setError(error.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('確定要刪除此用戶嗎？')) return;

    try {
      await apiService.delete(`/super-admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      setError(error.message || 'Failed to delete user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-management">
      <h2>User Management</h2>
      
      <div className="user-list">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map(user => (
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
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-button"
                    disabled={user.role === 'super_admin'}
                  >
                    Delete
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
            <h3>Edit User</h3>
            {/* Add edit form here */}
            <button onClick={() => setShowEditModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
