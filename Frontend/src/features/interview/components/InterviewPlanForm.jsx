import React from 'react';
import JobDescriptionSection from './JobDescriptionSection';
import UserProfileSection from './UserProfileSection';

const InterviewPlanForm = ({
  formData,
  onJobDescriptionChange,
  onResumeChange,
  isDragActive,
  onDragEnter,
  onDragLeave,
  onDrop,
  onSelfDescriptionChange,
  onSubmit,
  isLoading,
  requirementValidation
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (requirementValidation) {
      onSubmit();
    }
  };

  return (
    <form className="interview-plan-form" onSubmit={handleSubmit}>
      <div className="form-container">
        <div className="left-panel">
          <JobDescriptionSection
            jobDescription={formData.jobDescription}
            onJobDescriptionChange={onJobDescriptionChange}
          />
        </div>

        <div className="right-panel">
          <UserProfileSection
            resumeFile={formData.resumeFile}
            onResumeChange={onResumeChange}
            isDragActive={isDragActive}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            selfDescription={formData.selfDescription}
            onSelfDescriptionChange={onSelfDescriptionChange}
            requirementValidation={requirementValidation}
          />

          <button
            type="submit"
            className="generate-button"
            disabled={!requirementValidation || isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              <>
                <span className="button-icon">⚡</span>
                Generate My Interview Strategy
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default InterviewPlanForm;
