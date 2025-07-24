
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Tabs, Tab } from 'react-bootstrap';
import { FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import { useGetTaskByIdQuery } from '../slices/tasksApiSlice';

const TaskDetailsScreen = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  
  const { 
    data: task, 
    isLoading, 
    error 
  } = useGetTaskByIdQuery(id);
  console.log(task);

  // Function to fix Cloudinary URL for preview
  const getPreviewUrl = (url) => {
    if (!url) return '';
    
    // Add fl_attachment:false to prevent download
    return url.replace('/upload/', '/upload/fl_attachment:false/');
  };

  // Function to get icon based on file type
  const getFileIcon = (contentType) => {
    if (contentType.includes('pdf')) return '📄';
    if (contentType.includes('image')) return '🖼️';
    if (contentType.includes('word')) return '📝';
    if (contentType.includes('excel')) return '📊';
    return '📁';
  };

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading task details...</p>
      </Container>
    );
  }

  if (error) {
    const errMsg = error?.data?.message || error?.message || 'Error loading task';
    return (
      <Container className="mt-5">
        <h2>Error</h2>
        <p>{errMsg}</p>
        <Link to="/">
          <Button variant="primary">Go Back</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Link to="/" className="mb-3 d-block">
        <Button variant="light">&larr; Back to Tasks</Button>
      </Link>
      
      <Row>
        <Col>
          <h1>{task.title}</h1>
          <p className="text-muted">
            Created on: {new Date(task.createdAt).toLocaleDateString()} | 
            Status: <span className="badge bg-secondary">{task.status}</span> | 
            Priority: <span className="badge bg-info">{task.priority}</span>
          </p>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={6}>
          <div className="border p-3 rounded mb-4">
            <h3>Task Details</h3>
            <p><strong>Description:</strong></p>
            <p className="p-2 bg-light rounded">{task.description || 'No description provided'}</p>
            
            <div className="mt-3">
              <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
              <p><strong>Assigned To:</strong> {task.assignedTo.email || 'Unassigned'}</p>
              <p><strong>Created By:</strong> {task.createdBy.email || 'Unknown'}</p>
            </div>
          </div>
        </Col>
        
        <Col md={6}>
          <div className="border p-3 rounded">
            <h3>Documents</h3>
            
            {task.documents && task.documents.length > 0 ? (
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(Number(k))}
                className="mb-3"
              >
                {task.documents.map((doc, index) => (
                  <Tab 
                    key={doc._id} 
                    eventKey={index} 
                    title={
                      <span>
                        {getFileIcon(doc.contentType)} Doc {index + 1}
                      </span>
                    }
                  >
                    <div className="mt-3">
                      <h5>{doc.name}</h5>
                      <p className="text-muted">
                        Type: {doc.contentType} | Size: {(doc.size / 1024).toFixed(2)} KB
                      </p>
                      
                      <div className="embed-responsive embed-responsive-16by9">
                        <iframe 
                          src= {`https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true`}
                          title={`Document: ${doc.name}`}
                          width="100%"
                          height="500px"
                          style={{ border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </div>
                      
                      <div className="mt-3 d-flex justify-content-between">
                        <a 
                          href={getPreviewUrl(doc.url)}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary"
                        >
                          <FaExternalLinkAlt className="me-1" /> Open Fullscreen
                        </a>
                        
                        <a 
                          href={doc.url} 
                          download={doc.name}
                          className="btn btn-outline-secondary"
                        >
                          <FaDownload className="me-1" /> Download
                        </a>
                      </div>
                    </div>
                  </Tab>
                ))}
              </Tabs>
            ) : (
              <p className="text-muted">No documents uploaded for this task</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskDetailsScreen;