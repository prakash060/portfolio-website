import React from 'react';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce application built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.",
      technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
      githubLink: "https://github.com/yourusername/ecommerce-platform",
      liveLink: "https://ecommerce-demo.com",
      image: "project1.jpg"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      technologies: ["React", "Firebase", "Material-UI", "Redux"],
      githubLink: "https://github.com/yourusername/task-manager",
      liveLink: "https://task-manager-demo.com",
      image: "project2.jpg"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "A weather application that displays current weather conditions and forecasts using OpenWeatherMap API with beautiful visualizations.",
      technologies: ["HTML", "CSS", "JavaScript", "Chart.js", "OpenWeatherMap API"],
      githubLink: "https://github.com/yourusername/weather-dashboard",
      liveLink: "https://weather-demo.com",
      image: "project3.jpg"
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "A responsive portfolio website built with React and modern CSS. Features smooth scrolling, responsive design, and professional layout.",
      technologies: ["React", "CSS3", "JavaScript", "HTML5"],
      githubLink: "https://github.com/yourusername/portfolio-website",
      liveLink: "https://your-portfolio.com",
      image: "project4.jpg"
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <h2 className="section-title">My Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <div className="image-placeholder">
                  <span>{project.title}</span>
                </div>
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-technologies">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a 
                    href={project.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-github"
                  >
                    <i className="fab fa-github"></i> View Code
                  </a>
                  <a 
                    href={project.liveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-live"
                  >
                    <i className="fas fa-external-link-alt"></i> Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
