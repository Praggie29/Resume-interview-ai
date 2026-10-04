import React from 'react';

const ResumeUploadSection = ({ 
  resumeFile, 
  onResumeChange,
  isDragActive,
  onDragEnter,
  onDragLeave,
  onDrop
}) => {
  return (
    <div className="resume-upload-section">
      <div className="section-header">
        <h3>
          <span className="icon">📄</span>
          Upload Resume
        </h3>
        <span className="tag">Optional</span>
      </div>
      
      <div
        className={`upload-area ${isDragActive ? 'active' : ''}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="upload-content">
          <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <p className="upload-text">Click to upload or drag & drop</p>
          <p className="upload-format">PDF or DOC (Max 5 MB)</p>
        </div>
        <input
          type="file"
          id="resume"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={onResumeChange}
          className="file-input"
        />
      </div>

      {resumeFile && (
        <div className="file-selected">
          <span className="file-icon">✓</span>
          <span className="file-name">{resumeFile.name}</span>
        </div>
      )}
    </div>
  );
};

export default ResumeUploadSection;
