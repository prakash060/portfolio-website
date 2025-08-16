import React from 'react';
import './Contact.css';

const Contact = () => {
  const contactInfo = {
    email: "your.email@example.com",
    phone: "+1 (555) 123-4567",
    location: "City, State, Country",
    linkedin: "https://linkedin.com/in/yourusername",
    github: "https://github.com/yourusername",
    twitter: "https://twitter.com/yourusername"
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${contactInfo.email}`;
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${contactInfo.phone}`;
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Let's Connect!</h3>
            <p>
              I'm always interested in hearing about new opportunities, 
              interesting projects, or just having a chat about technology. 
              Feel free to reach out through any of the channels below.
            </p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <button onClick={handleEmailClick} className="contact-link">
                    {contactInfo.email}
                  </button>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-details">
                  <h4>Phone</h4>
                  <button onClick={handlePhoneClick} className="contact-link">
                    {contactInfo.phone}
                  </button>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-details">
                  <h4>Location</h4>
                  <span>{contactInfo.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="social-links">
            <h3>Follow Me</h3>
            <div className="social-grid">
              <a 
                href={contactInfo.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link linkedin"
              >
                <i className="fab fa-linkedin"></i>
                <span>LinkedIn</span>
              </a>
              
              <a 
                href={contactInfo.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link github"
              >
                <i className="fab fa-github"></i>
                <span>GitHub</span>
              </a>
              
              <a 
                href={contactInfo.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link twitter"
              >
                <i className="fab fa-twitter"></i>
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
