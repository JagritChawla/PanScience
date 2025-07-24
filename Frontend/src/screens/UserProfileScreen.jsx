// src/screens/UserProfileScreen.jsx
import React, { useState } from 'react';
import { 
  Container, Form, Button, Card, Alert, 
  Spinner, Row, Col, Badge 
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useUpdateMyCredentialsMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const UserProfileScreen = () => {
  const { userInfo } = useSelector(state => state.auth);
  console.log(userInfo)
  const [updateCredentials, { isLoading }] = useUpdateMyCredentialsMutation();
  
  const [formData, setFormData] = useState({
    email: userInfo?.email || '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when field changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear success message when form changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Email validation
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Password validation
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setApiError('');
      
      // Prepare update data
      const updateData = {};
      if (formData.email !== userInfo.email) {
        updateData.email = formData.email;
      }
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      // Skip update if no changes
      if (Object.keys(updateData).length === 0) {
        setSuccessMessage('No changes to update');
        return;
      }
      
      // Execute the mutation
      const res = await updateCredentials(updateData).unwrap();
      
      // Show success message
      setSuccessMessage('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      
      // Show toast notification
      toast.success('Your credentials have been updated');
      
    } catch (err) {
      setApiError(err.data?.message || 'Failed to update profile');
      toast.error('Failed to update profile');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0">Your Profile</h2>
            </Card.Header>
            
            <Card.Body>
              <div className="d-flex flex-column align-items-center mb-4">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-2" 
                     style={{ width: '80px', height: '80px' }}>
                  <span className="text-white display-4">
                    {userInfo?.name?.charAt(0) || userInfo?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <h3 className="mb-0">{userInfo?.email || 'User'}</h3>
                <div className="mt-2">
                  <Badge 
                    bg={userInfo?.role === 'admin' ? 'success' : 'primary'} 
                    className="d-flex align-items-center"
                  >
                    <i className="bi bi-person-badge me-1"></i>
                    {userInfo?.role === 'admin' ? 'Administrator' : 'User'}
                  </Badge>
                </div>
                <p className="text-muted mt-2 mb-0">
                  Member since {new Date(userInfo?.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              {apiError && <Alert variant="danger" className="text-center">{apiError}</Alert>}
              {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter your email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                
                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    isInvalid={!!errors.password}
                    placeholder="Enter new password (leave blank to keep current)"
                  />
                  <Form.Text className="text-muted">
                    Minimum 6 characters
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                
                {/* Confirm Password */}
                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    isInvalid={!!errors.confirmPassword}
                    placeholder="Confirm new password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                
                {/* Submit Button */}
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Updating Profile...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </Button>
                </div>
              </Form>
              
              {/* Additional Information */}
              <div className="mt-4 pt-3 border-top">
                <h5 className="mb-3">Account Information</h5>
                <Row className="mb-2">
                  <Col sm={5} className="text-muted">Account ID:</Col>
                  <Col sm={7}>{userInfo?.id || '-'}</Col>
                </Row>
                <Row className="mb-2">
                  <Col sm={5} className="text-muted">Role:</Col>
                  <Col sm={7}>
                    <Badge bg={userInfo?.role === 'admin' ? 'success' : 'primary'}>
                      {userInfo?.role || 'user'}
                    </Badge>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col sm={5} className="text-muted">Last Updated:</Col>
                  <Col sm={7}>
                    {userInfo?.updatedAt 
                      ? new Date(userInfo.updatedAt).toLocaleString() 
                      : 'Never'}
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfileScreen;