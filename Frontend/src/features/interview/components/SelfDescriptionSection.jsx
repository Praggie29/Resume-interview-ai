import React from 'react';

const SelfDescriptionSection = ({ 
  selfDescription, 
  onSelfDescriptionChange,
  placeholder = 'Briefly describe your experience, key skills, and years of professional experience if you don\'t have a resume handy.'
}) => {
  return (
    <div className="self-description-section">
      <div className="section-header">
        <h3>Quick Self-Description</h3>
        <span className="tag">Optional</span>
      </div>
      <textarea
        className="self-description-textarea"
        name="selfDescription"
        id="selfDescription"
        placeholder={placeholder}
        value={selfDescription}
        onChange={onSelfDescriptionChange}
      />
      <div className="char-count">
        <small>{selfDescription?.length || 0} / 1000 chars</small>
      </div>
    </div>
  );
};

export default SelfDescriptionSection;
