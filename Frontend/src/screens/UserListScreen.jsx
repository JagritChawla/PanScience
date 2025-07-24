
import React, { useState } from 'react';
import { 
  Container, Table, Button, Spinner, Alert, 
  Form, Badge, Modal, Row, Col 
} from 'react-bootstrap';
import { FaSave, FaEdit, FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import { useGetAllUsersQuery, useAdminUpdateUserRoleMutation , useDeleteUserMutation} from '../slices/usersApiSlice.js';
import { toast } from 'react-toastify';

const UserListScreen = () => {
  const { 
    data: users, 
    isLoading, 
    isError,
    error,
    refetch 
  } = useGetAllUsersQuery();
  console.log(users);
  
  const [updateUserRole] = useAdminUpdateUserRoleMutation();

  const [deleteUser] = useDeleteUserMutation();
  
  // State for editing roles
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState('');
  
  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setNewRole(user.role);
  };
  
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setNewRole('');
  };
  
  const handleSaveRole = async (userId) => {
    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap();
      toast.success('User role updated successfully');
      setEditingUserId(null);
      setNewRole('');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update role');
    }
  };
  
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    
    setShowDeleteModal(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      // Implement delete functionality
        await deleteUser(userToDelete._id).unwrap();
      toast.success(`${userToDelete.email} has been deleted`);
      setShowDeleteModal(false);
      setUserToDelete(null);
      refetch();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };
  
  const getRoleBadge = (role) => {
    return role === 'admin' ? (
      <Badge bg="success" className="d-flex align-items-center">
        <FaUserShield className="me-1" /> Admin
      </Badge>
    ) : (
      <Badge bg="primary" className="d-flex align-items-center">
        <FaUser className="me-1" /> User
      </Badge>
    );
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>User Management</h1>
          <p className="text-muted">
            Manage user accounts and permissions
          </p>
        </Col>
      </Row>
      
      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading users...</p>
        </div>
      ) : isError ? (
        <Alert variant="danger" className="text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error?.data?.message || 'Failed to load users'}
          <div className="mt-2">
            <Button variant="outline-danger" onClick={refetch}>
              Retry
            </Button>
          </div>
        </Alert>
      ) : users?.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-people text-secondary fs-1"></i>
          <h4 className="mt-3">No users found</h4>
          <p className="text-muted">Try again later</p>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                
                <th>Email</th>
                <th>Role</th>
                
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.users.map(user => (
                <tr key={user._id}>
                  
                  <td className="align-middle">{user.email}</td>
                  <td className="align-middle">
                    {editingUserId === user._id ? (
                      <Form.Select 
                        value={newRole} 
                        onChange={(e) => setNewRole(e.target.value)}
                        size="sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </Form.Select>
                    ) : (
                      getRoleBadge(user.role)
                    )}
                  </td>
                  
                  <td className="align-middle">
                    {editingUserId === user._id ? (
                      <div className="d-flex gap-2">
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleSaveRole(user._id)}
                        >
                          <FaSave className="me-1" /> Save
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEditClick(user)}
                        >
                          <FaEdit className="me-1" /> Edit Role
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <FaTrash className="me-1" /> Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">
              Showing {users.length} of {users.length} users
            </div>
            <div>
              <Button variant="outline-secondary" size="sm" className="me-2">
                Previous
              </Button>
              <Button variant="outline-secondary" size="sm">
                Next
              </Button>
            </div>
          </div>
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm User Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete && (
            <div className="text-center">
              <div className="avatar-placeholder rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                {userToDelete.email.charAt(0)}
              </div>
              <p>
                Are you sure you want to permanently delete <strong>{userToDelete.email}</strong>?
              </p>
              <p className="text-danger">
                This action cannot be undone and will remove all user data.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserListScreen;