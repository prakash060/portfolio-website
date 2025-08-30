import React from 'react';
import './Certifications.css';

const Certifications = () => {
  const certifications = [
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
      description: "Demonstrates expertise in designing distributed systems on AWS platform.",
      credentialId: "AWS-123456789",
      image: "aws-logo.png"
    },
    {
      id: 2,
      name: "MongoDB Certified Developer",
      issuer: "MongoDB University",
      date: "2022",
      description: "Validates skills in building applications using MongoDB database.",
      credentialId: "MDB-987654321",
      image: "mongodb-logo.png"
    },
    {
      id: 3,
      name: "React Developer Certification",
      issuer: "Meta",
      date: "2022",
      description: "Certifies proficiency in React.js development and best practices.",
      credentialId: "REACT-456789123",
      image: "react-logo.png"
    },
    {
      id: 4,
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      date: "2021",
      description: "Demonstrates ability to build scalable applications on Google Cloud Platform.",
      credentialId: "GCP-789123456",
      image: "gcp-logo.png"
    }
  ];

  return (
    <section id="certifications" className="certifications">
      <div className="certifications-container">
        <h2 className="section-title">Certifications & Achievements</h2>
        <div className="certifications-grid">
          {certifications.map((cert) => (
            <div key={cert.id} className="certification-card">
              <div className="certification-header">
                <div className="certification-logo">
                  <div className="logo-placeholder">
                    <span>{cert.issuer}</span>
                  </div>
                </div>
                <div className="certification-info">
                  <h3>{cert.name}</h3>
                  <h4>{cert.issuer}</h4>
                  <span className="certification-date">{cert.date}</span>
                </div>
              </div>
              <p>{cert.description}</p>
              <div className="certification-details">
                <span className="credential-id">ID: {cert.credentialId}</span>
                <button className="btn-verify">Verify Certificate</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
