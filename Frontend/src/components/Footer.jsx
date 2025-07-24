// src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Replace these with your actual profile links
  const githubUrl = "https://github.com/JagritChawla";
  const linkedinUrl = "https://www.linkedin.com/in/jagrit-chawla-945446228/";
  const email = "jagritchawla2003@gmail.com";
  
  return (
    <footer className="bg-light py-3 border-top mt-auto">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col xs="auto" className="text-muted">
            &copy; {currentYear} TaskFlow Manager
          </Col>
          
          <Col xs="auto" className="d-flex gap-3">
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            
            <a 
              href={linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
            
            <a 
              href={`mailto:${email}`}
              className="text-muted"
              aria-label="Email"
            >
              <FaEnvelope size={20} />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;