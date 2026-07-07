import React from 'react';

const JobDescriptionSection = ({ 
  jobDescription, 
  onJobDescriptionChange,
  placeholder = 'Paste the full job description here...'
}) => {
  return (
    <div className="job-description-section">
      <div className="section-header">
        <h2>
          <span className="icon">📌</span>
          Target Job Description
        </h2>
        <span className="tag">Required</span>
      </div>
      <textarea
        className="job-description-textarea"
        name="jobDescription"
        id="jobDescription"
        placeholder={placeholder}
        value={jobDescription}
        onChange={onJobDescriptionChange}
      />
      <div className="char-count">
        <small>{jobDescription?.length || 0} / 5000 chars</small>
      </div>
    </div>
  );
};

export default JobDescriptionSection;
