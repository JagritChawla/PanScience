// src/screens/CreateTaskScreen.jsx
import React, { useState } from 'react';
import { 
  Container, Form, Button, Row, Col, 
  Card, Alert, Spinner, InputGroup
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaPaperclip, FaUser } from 'react-icons/fa';
import { useCreateTaskMutation } from '../slices/tasksApiSlice';

const CreateTaskScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [files, setFiles] = useState([]);
  
  // RTK Query mutation for creating task
  const [createTask, { isLoading }] = useCreateTaskMutation();
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Assigned user email is required';
    } else if (!emailRegex.test(formData.assignedTo)) {
      newErrors.assignedTo = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission with RTK Query
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setApiError('');
      setSuccess('');
      
      // Create form data
      const formDataToSend = new FormData();
      
      // Append all form values
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append files
      files.forEach(file => {
        formDataToSend.append('documents', file);
      });
      
      // Execute the mutation
      const res = await createTask(formDataToSend).unwrap();
      
      setSuccess('Task created successfully!');
      setTimeout(() => {
        navigate(`/tasks/${res._id}`); // Redirect to task details
      }, 1500);
    } catch (err) {
      setApiError(err.data?.error || err.message || 'Failed to create task');
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Check file count
    if (files.length + selectedFiles.length > 3) {
      setApiError('Maximum 3 documents allowed');
      return;
    }
    
    // Check file types
    const invalidFiles = selectedFiles.filter(file => 
      file.type !== 'application/pdf'
    );
    
    if (invalidFiles.length > 0) {
      setApiError('Only PDF files are allowed');
      return;
    }
    
    // Update files state
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  // Remove a file
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Create New Task</h3>
            </Card.Header>
            
            <Card.Body>
              {apiError && <Alert variant="danger">{apiError}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                {/* Title */}
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={handleInputChange}
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
                
                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Describe the task details"
                    value={formData.description}
                    onChange={handleInputChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row>
                  {/* Status */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status *</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  {/* Priority */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority *</Form.Label>
                      <Form.Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  {/* Due Date */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Due Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        isInvalid={!!errors.dueDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dueDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  {/* Assigned To */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Assigned To (Email) *</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaUser />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="assignedTo"
                          placeholder="user@example.com"
                          value={formData.assignedTo}
                          onChange={handleInputChange}
                          isInvalid={!!errors.assignedTo}
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        {errors.assignedTo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* Document Upload */}
                <Form.Group className="mb-4">
                  <Form.Label>Attach Documents (PDF only, max 3)</Form.Label>
                  
                  {/* File input */}
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileChange}
                    disabled={files.length >= 3}
                  />
                  
                  {/* Selected files preview */}
                  {files.length > 0 && (
                    <div className="mt-3">
                      <small className="d-block mb-2">Selected files:</small>
                      <div className="d-flex flex-wrap gap-2">
                        {files.map((file, index) => (
                          <div 
                            key={index} 
                            className="border rounded p-2 d-flex align-items-center"
                          >
                            <FaPaperclip className="me-2" />
                            <span className="text-truncate" style={{ maxWidth: '150px' }}>
                              {file.name}
                            </span>
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="text-danger ms-2"
                              onClick={() => removeFile(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Form.Group>
                
                {/* Submit Button */}
                <div className="d-flex justify-content-end gap-2">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/tasks')}
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    type="submit"
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
                        Creating Task...
                      </>
                    ) : (
                      'Create Task'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTaskScreen;