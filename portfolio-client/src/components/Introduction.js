import React from 'react';
import './Introduction.css';

const Introduction = () => {
  return (
    <section id="introduction" className="introduction">
      <div className="introduction-container">
        <div className="introduction-content">
          <div className="introduction-text">
            <h1>Hi, I'm <span className="highlight">Your Name</span></h1>
            <h2>Software Developer & Tech Enthusiast</h2>
            <p>
              I'm a passionate software developer with expertise in building modern web applications. 
              I love creating efficient, scalable solutions and learning new technologies. 
              With a strong foundation in both frontend and backend development, 
              I enjoy turning complex problems into simple, beautiful solutions.
            </p>
            <div className="introduction-actions">
              <button className="btn-primary" onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}>
                View My Work
              </button>
              <button className="btn-secondary" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                Get In Touch
              </button>
            </div>
          </div>
          <div className="introduction-image">
            <div className="profile-photo">
              {/* Replace with your actual photo */}
              <div className="photo-placeholder">
                <span>Your Photo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
