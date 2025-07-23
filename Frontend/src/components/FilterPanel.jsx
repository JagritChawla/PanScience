import React from 'react'
import { Card, Button, Form } from 'react-bootstrap';


const FilterPanel = ({ filters, onFilterChange, onSortChange, onReset }) => {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Filters</h5>
          <Button variant="link" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>

        {/* Status Filter */}
        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select 
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </Form.Select>
        </Form.Group>

        {/* Priority Filter */}
        <Form.Group className="mb-3">
          <Form.Label>Priority</Form.Label>
          <Form.Select 
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Form.Select>
        </Form.Group>

        {/* Sort By */}
        <Form.Group className="mb-3">
          <Form.Label>Sort By</Form.Label>
          <Form.Select 
            value={filters.sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="dueDate:asc">Due Date (Oldest First)</option>
            <option value="dueDate:desc">Due Date (Newest First)</option>
          </Form.Select>
        </Form.Group>

        {/* Items Per Page */}
        <Form.Group>
          <Form.Label>Items Per Page</Form.Label>
          <Form.Select 
            value={filters.limit}
            onChange={(e) => onFilterChange('limit', Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Form.Select>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default FilterPanel;