// src/screens/UpdateTaskScreen.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, Form, Button, Row, Col, 
  Card, Alert, Spinner, InputGroup, Badge
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPaperclip, FaUser, FaTrash } from 'react-icons/fa';
import { useGetTaskByIdQuery, useUpdateTaskMutation } from '../slices/tasksApiSlice';
import { toast } from 'react-toastify';

const UpdateTaskScreen = () => {
  const navigate = useNavigate();
  const { id: taskId } = useParams();
  const { userInfo } = useSelector(state => state.auth);
  
  // Fetch task data
  const { 
    data: task, 
    isLoading: isLoadingTask, 
    isError: isErrorTask,
    error: taskError,
    refetch: refetchTask
  } = useGetTaskByIdQuery(taskId);
  
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
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [filesToDelete, setFilesToDelete] = useState([]);
  
  // RTK Query mutation for updating task
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  
  // Populate form when task data is available
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedTo: task.assignedTo?.email || ''
      });
      
      if (task.documents) {
        setExistingFiles(task.documents);
      }
    }
  }, [task]);
  
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
      
      // Create form data
      const formDataToSend = new FormData();
      
      // Append all form values
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append files to delete
      filesToDelete.forEach(fileId => {
        formDataToSend.append('filesToDelete', fileId);
      });
      
      // Append new files
      files.forEach(file => {
        formDataToSend.append('documents', file);
      });
      
      // Execute the mutation
      await updateTask({ id: taskId, formData: formDataToSend }).unwrap();
      
      toast.success('Task updated successfully!');
      refetchTask();
    } catch (err) {
      setApiError(err.data?.error || err.message || 'Failed to update task');
      toast.error('Failed to update task');
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

  // Remove a new file
  const removeNewFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Remove an existing file
  const removeExistingFile = (fileId) => {
    setExistingFiles(prev => prev.filter(file => file._id !== fileId));
    setFilesToDelete(prev => [...prev, fileId]);
  };

  if (isLoadingTask) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading task details...</p>
      </Container>
    );
  }

  if (isErrorTask) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {taskError?.data?.message || 'Failed to load task details'}
          <div className="mt-2">
            <Button variant="outline-danger" onClick={refetchTask}>
              Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Update Task</h3>
              <small className="d-block mt-1">ID: {task?._id}</small>
            </Card.Header>
            
            <Card.Body>
              {apiError && <Alert variant="danger">{apiError}</Alert>}
              
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
                
                {/* Existing Documents */}
                {existingFiles.length > 0 && (
                  <Form.Group className="mb-3">
                    <Form.Label>Existing Documents</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {existingFiles.map(file => (
                        <div 
                          key={file._id}
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
                            onClick={() => removeExistingFile(file._id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                )}
                
                {/* Document Upload */}
                <Form.Group className="mb-4">
                  <Form.Label>Add New Documents (PDF only, max 3)</Form.Label>
                  
                  {/* File input */}
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileChange}
                    disabled={files.length >= 3 || (existingFiles.length + files.length) >= 3}
                  />
                  
                  {/* Selected files preview */}
                  {files.length > 0 && (
                    <div className="mt-3">
                      <small className="d-block mb-2">New files to upload:</small>
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
                              onClick={() => removeNewFile(index)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Total files count */}
                  <div className="mt-2 text-muted">
                    <small>
                      Total files: {existingFiles.length - filesToDelete.length + files.length}/3
                    </small>
                  </div>
                </Form.Group>
                
                {/* Submit Button */}
                <div className="d-flex justify-content-end gap-2">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate(`/tasks/${taskId}`)}
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
                        Updating Task...
                      </>
                    ) : (
                      'Update Task'
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

export default UpdateTaskScreen;