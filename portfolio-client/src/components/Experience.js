import React from 'react';
import './Experience.css';

const Experience = () => {
  const experiences = [
    {
      id: 1,
      company: "Tech Company Inc.",
      position: "Senior Software Developer",
      duration: "2022 - Present",
      description: "Led development of multiple web applications using React, Node.js, and AWS. Mentored junior developers and implemented CI/CD pipelines.",
      technologies: ["React", "Node.js", "AWS", "Docker", "MongoDB"]
    },
    {
      id: 2,
      company: "Startup XYZ",
      position: "Full Stack Developer",
      duration: "2020 - 2022",
      description: "Built and maintained customer-facing applications. Collaborated with design and product teams to deliver user-centric solutions.",
      technologies: ["JavaScript", "Python", "PostgreSQL", "Redis", "Heroku"]
    },
    {
      id: 3,
      company: "Digital Agency",
      position: "Frontend Developer",
      duration: "2018 - 2020",
      description: "Developed responsive websites and web applications for various clients. Optimized performance and user experience.",
      technologies: ["HTML", "CSS", "JavaScript", "React", "WordPress"]
    }
  ];

  return (
    <section id="experience" className="experience">
      <div className="experience-container">
        <h2 className="section-title">Work Experience</h2>
        <div className="timeline">
          {experiences.map((exp, index) => (
            <div key={exp.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>{exp.position}</h3>
                  <h4>{exp.company}</h4>
                  <span className="duration">{exp.duration}</span>
                </div>
                <p>{exp.description}</p>
                <div className="technologies">
                  {exp.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
