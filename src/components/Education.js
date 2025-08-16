import React from 'react';
import './Education.css';

const Education = () => {
  const education = [
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Technology",
      duration: "2014 - 2018",
      description: "Graduated with honors. Specialized in software engineering and web development. Completed capstone project on machine learning applications.",
      gpa: "3.8/4.0",
      relevantCourses: ["Data Structures", "Algorithms", "Web Development", "Database Systems", "Software Engineering"]
    },
    {
      id: 2,
      degree: "High School Diploma",
      institution: "Tech High School",
      duration: "2010 - 2014",
      description: "Graduated with distinction. Active member of computer science club and robotics team.",
      gpa: "3.9/4.0",
      relevantCourses: ["Advanced Mathematics", "Computer Programming", "Physics", "English Literature"]
    }
  ];

  return (
    <section id="education" className="education">
      <div className="education-container">
        <h2 className="section-title">Education</h2>
        <div className="education-grid">
          {education.map((edu) => (
            <div key={edu.id} className="education-card">
              <div className="education-header">
                <h3>{edu.degree}</h3>
                <h4>{edu.institution}</h4>
                <span className="duration">{edu.duration}</span>
                <div className="gpa">
                  <strong>GPA: {edu.gpa}</strong>
                </div>
              </div>
              <p>{edu.description}</p>
              <div className="relevant-courses">
                <h5>Relevant Courses:</h5>
                <div className="course-tags">
                  {edu.relevantCourses.map((course, index) => (
                    <span key={index} className="course-tag">{course}</span>
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

export default Education;
