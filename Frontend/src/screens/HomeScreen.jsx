import React, { useState } from 'react';
import { 
  Container, Row, Col, Button, Card, Badge, 
  Offcanvas, Stack, Spinner, Form, Alert
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useGetMyTasksQuery } from '../slices/tasksApiSlice';
import FilterPanel from '../components/FilterPanel';
import { format } from 'date-fns';

const HomeScreen = () => {
  const { userInfo } = useSelector(state => state.auth);
  
  
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    sort: 'dueDate:asc',
    page: 1,
    limit: 10
  });
  
  // State for mobile filters visibility
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    data, 
    isLoading, 
    isError,
    error,
    refetch 
  } = useGetMyTasksQuery(filters);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
      page: 1 // reset to first page when filters change
    }));
  };

  const handleSortChange = (value) => {
    setFilters(prev => ({
      ...prev,
      sort: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      sort: 'dueDate:asc',
      page: 1,
      limit: 10
    });
  };

  const nextPage = () => {
    if (filters.page < (data?.pages || 1)) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (filters.page > 1) {
      setFilters(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case 'todo': return 'secondary';
      case 'in-progress': return 'primary';
      case 'done': return 'success';
      default: return 'light';
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Your Tasks</h1>
          <p className="text-muted">
            {data?.total || 0} task{data?.total !== 1 ? 's' : ''} assigned to you
          </p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="outline-primary" 
            className="d-lg-none"
            onClick={() => setShowFilters(true)}
          >
            <i className="bi bi-funnel me-1"></i> 
            {filters.status || filters.priority ? 'Filters Active' : 'Filters'}
          </Button>
        </Col>
      </Row>

      <Row>
        {/* Filter Sidebar - Hidden on mobile, shown on desktop */}
        <Col lg={3} className="d-none d-lg-block">
          <FilterPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onReset={resetFilters}
          />
        </Col>

        
        <Col lg={9}>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Loading your tasks...</p>
            </div>
          ) : isError ? (
            <Alert variant="danger" className="text-center">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error?.data?.message || 'Failed to load tasks'}
              <div className="mt-2">
                <Button variant="outline-danger" onClick={refetch}>
                  Retry
                </Button>
              </div>
            </Alert>
          ) : data?.tasks?.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-check-circle text-success fs-1"></i>
              <h4 className="mt-3">No tasks assigned</h4>
              <p className="text-muted">You're all caught up!</p>
              <Button variant="outline-primary" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="task-list">
                {data.tasks.map(task => (
                  <Card key={task._id} className="mb-3 shadow-sm">
                    <Card.Body>
                      <Stack direction="horizontal" gap={2} className="mb-2">
                        <Badge bg={getPriorityBadge(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge bg={getStatusBadge(task.status)}>
                          {task.status}
                        </Badge>
                      </Stack>
                      
                      <Card.Title>{task.title}</Card.Title>
                      <Card.Text className="text-muted">
                        {task.description.substring(0, 100)}{task.description.length > 100 ? '...' : ''}
                      </Card.Text>
                      
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          Due: {formatDate(task.dueDate)}
                        </small>
                        <small className="text-muted">
                          <i className="bi bi-person me-1"></i>
                          Created by: {task.createdBy.email}
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
              
              {/* Pagination */}
              {data.total > filters.limit && (
                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="outline-primary" 
                    disabled={filters.page === 1}
                    onClick={prevPage}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {filters.page} of {data.pages}
                  </span>
                  <Button 
                    variant="outline-primary" 
                    disabled={filters.page === data.pages}
                    onClick={nextPage}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>

     
      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters & Sort</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FilterPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onReset={resetFilters}
          />
          <div className="mt-3">
            <Button 
              variant="primary" 
              className="w-100"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default HomeScreen;