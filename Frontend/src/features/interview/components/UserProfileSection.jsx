import React from 'react';
import ResumeUploadSection from './ResumeUploadSection';
import SelfDescriptionSection from './SelfDescriptionSection';

const UserProfileSection = ({ 
  resumeFile, 
  onResumeChange,
  isDragActive,
  onDragEnter,
  onDragLeave,
  onDrop,
  selfDescription,
  onSelfDescriptionChange,
  requirementValidation
}) => {
  return (
    <div className="user-profile-section">
      <div className="section-title">
        <h2>
          <span className="icon">👤</span>
          Your Profile
        </h2>
      </div>

      <ResumeUploadSection
        resumeFile={resumeFile}
        onResumeChange={onResumeChange}
        isDragActive={isDragActive}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      />

      <SelfDescriptionSection
        selfDescription={selfDescription}
        onSelfDescriptionChange={onSelfDescriptionChange}
      />

      <div className="validation-info">
        <input
          type="checkbox"
          id="requirementInfo"
          checked={requirementValidation}
          readOnly
        />
        <label htmlFor="requirementInfo">
          <strong>Either a Resume or a Self-Description is required to generate a personalized plan</strong>
        </label>
      </div>
    </div>
  );
};

export default UserProfileSection;
