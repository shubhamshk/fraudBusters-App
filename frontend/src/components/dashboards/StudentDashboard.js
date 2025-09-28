import React, { useState } from 'react';
import '../FileUpload.css';
import '../VerificationResult.css';

const StudentDashboard = ({ user, onLogout }) => {
  const [verificationHistory] = useState([
    {
      id: 1,
      fileName: 'BSc_Computer_Science_Certificate.pdf',
      status: 'verified',
      verifiedAt: '2024-01-15',
      confidence: 95
    },
    {
      id: 2,
      fileName: 'High_School_Diploma.pdf',
      status: 'verified',
      verifiedAt: '2024-01-10',
      confidence: 92
    }
  ]);

  // Analysis state
  const [currentFile, setCurrentFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState([]);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const getAnalysisSteps = (file) => {
    const base = [
      { id: 1, text: 'Establishing secure SSL connection...', icon: '🔐', duration: 800 },
      { id: 2, text: 'Encrypting and uploading certificate', icon: '📤', duration: 1000 },
      { id: 3, text: 'Extracting certificate metadata', icon: '📋', duration: 900 },
      { id: 4, text: 'Analyzing certificate structure and format', icon: '🔍', duration: 1100 },
      { id: 5, text: 'Computing digital fingerprint hash', icon: '🔢', duration: 1000 },
      { id: 6, text: 'Cross-referencing issuing institution', icon: '🏛️', duration: 1200 },
      { id: 7, text: 'Checking blockchain certificate ledger', icon: '⛓️', duration: 1200 },
      { id: 8, text: 'Running AI forgery detection algorithms', icon: '🤖', duration: 1500 },
      { id: 9, text: 'Scanning fake certificate database', icon: '🚫', duration: 900 },
      { id: 10, text: 'Validating certificate format standards', icon: '📄', duration: 900 }
    ];

    if (file && file.type) {
      if (file.type.startsWith('image/')) {
        base.splice(6, 0,
          { id: 11, text: 'Analyzing image EXIF metadata', icon: '📷', duration: 1000 },
          { id: 12, text: 'Detecting certificate image manipulation', icon: '🎨', duration: 1200 }
        );
      } else if (file.type === 'application/pdf') {
        base.splice(6, 0,
          { id: 13, text: 'Converting PDF pages to high-resolution images', icon: '📑', duration: 1000 },
          { id: 14, text: 'Validating embedded digital signatures', icon: '✍️', duration: 1200 }
        );
      }
    }

    return base;
  };

  const generateMockResult = (file) => {
    const name = (file?.name || '').toLowerCase();
    // Simple heuristic: files containing "fake" => FAKE, else REAL with some randomness
    const isFake = name.includes('fake') || name.includes('edited') || Math.random() > 0.8;
    return {
      status: isFake ? 'FAKE' : 'REAL',
      confidence: isFake ? 0.82 : 0.93,
      details: isFake
        ? [
            { name: 'Digital Signature', status: 'fail', description: 'No valid digital signature found' },
            { name: 'Metadata Analysis', status: 'fail', description: 'Suspicious editing timestamps detected' },
            { name: 'Content Integrity', status: 'fail', description: 'File shows signs of manipulation' }
          ]
        : [
            { name: 'Digital Signature', status: 'pass', description: 'Valid digital signature verified' },
            { name: 'Metadata Analysis', status: 'pass', description: 'Metadata consistent and unmodified' },
            { name: 'Content Integrity', status: 'pass', description: 'No signs of tampering detected' }
          ]
    };
  };

  const analyzeFile = async (file) => {
    setIsAnalyzing(true);
    setCurrentFile(file);
    setVerificationResult(null);

    const steps = getAnalysisSteps(file);
    setAnalysisSteps(steps);

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        await delay(steps[i].duration);
      }
      const result = generateMockResult(file);
      setVerificationResult(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      analyzeFile(file);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentFile(null);
    setVerificationResult(null);
    setIsAnalyzing(false);
    setCurrentStep(0);
    setAnalysisSteps([]);
  };

  const downloadCertificate = (certId) => {
    // TODO: Implement certificate download with QR code
    console.log('Downloading certificate:', certId);
  };

  const shareCertificate = (certId) => {
    // TODO: Implement certificate sharing
    console.log('Sharing certificate:', certId);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="user-info">
            <div className="user-avatar">🎓</div>
            <div className="user-details">
              <h2>Welcome, {user.name}</h2>
              <p className="user-role">Student / Certificate Holder</p>
              <div className="user-meta">
                {user.profile?.rollNo && <span>Roll No: {user.profile.rollNo}</span>}
                {user.profile?.institution && <span>Institution: {user.profile.institution}</span>}
                {user.profile?.degree && <span>Degree: {user.profile.degree}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={onLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </header>

    <main className="dashboard-main">
        {/* Analysis in progress */}
        {isAnalyzing && (
          <div className="analysis-in-progress">
            <div className="analysis-header">
              <div className="analysis-spinner"></div>
              <div className="analysis-info">
                <h2>Certificate Verification in Progress</h2>
                <p>Performing comprehensive authenticity analysis</p>
                <div className="progress-indicator">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {currentStep + 1} of {analysisSteps.length} steps
                  </span>
                </div>
              </div>
            </div>
            <div className="analysis-steps">
              {analysisSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`step ${idx < currentStep ? 'completed' : idx === currentStep ? 'active' : 'pending'}`}
                >
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-content">
                    <span className="step-text">{step.text}</span>
                    {idx === currentStep && (
                      <div className="step-loader">
                        <div className="loader-dots">
                          <span></span><span></span><span></span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="step-status">
                    {idx < currentStep ? '✓' : idx === currentStep ? '⏳' : '⏸'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final result */}
        {verificationResult && currentFile && (
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Verification Result</h3>
              <p>File: {currentFile.name}</p>
            </div>
            <div className="card-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>
                  {verificationResult.status === 'REAL' ? '✅' : '❌'}
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    {verificationResult.status === 'REAL' ? 'REAL (Authentic)' : 'FAKE (Fraudulent)'}
                  </div>
                  <div style={{ color: '#666' }}>Confidence: {(verificationResult.confidence * 100).toFixed(0)}%</div>
                </div>
              </div>

              <div className="history-list">
                {verificationResult.details.map((d, i) => (
                  <div key={i} className="history-item">
                    <div className="history-info">
                      <div className="history-name">{d.name}</div>
                      <div className="history-meta">
                        <span className={`status-badge ${d.status}`}>
                          {d.status === 'pass' ? '✅ PASS' : d.status === 'warning' ? '⚠️ WARN' : '❌ FAIL'}
                        </span>
                        <span className="date">{d.description}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button className="action-btn primary" onClick={handleNewAnalysis}>Verify Another</button>
                <label htmlFor="certificate-upload" className="action-btn">
                  Upload New File
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Default dashboard content */}
        {!verificationResult && !isAnalyzing && (
          <div className="dashboard-grid">
          {/* Quick Upload Section */}
          <div className="dashboard-card primary">
            <div className="card-header">
              <h3>📄 Upload & Verify Certificate</h3>
              <p>Verify the authenticity of your certificates</p>
            </div>
            <div className="card-content">
              <div className="upload-area">
                <input
                  type="file"
                  id="certificate-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="certificate-upload" className="upload-btn">
                  <span className="upload-icon">📤</span>
                  Choose Certificate to Verify
                </label>
                <p className="upload-help">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Verification History */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📊 Verification History</h3>
              <p>Your previously verified certificates</p>
            </div>
            <div className="card-content">
              {verificationHistory.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📋</span>
                  <p>No verifications yet</p>
                </div>
              ) : (
                <div className="history-list">
                  {verificationHistory.map((cert) => (
                    <div key={cert.id} className="history-item">
                      <div className="history-info">
                        <div className="history-name">{cert.fileName}</div>
                        <div className="history-meta">
                          <span className={`status-badge ${cert.status}`}>
                            {cert.status === 'verified' ? '✅ Verified' : '❌ Flagged'}
                          </span>
                          <span className="confidence">Confidence: {cert.confidence}%</span>
                          <span className="date">{cert.verifiedAt}</span>
                        </div>
                      </div>
                      <div className="history-actions">
                        <button 
                          className="action-btn secondary"
                          onClick={() => downloadCertificate(cert.id)}
                          title="Download with QR code"
                        >
                          📥
                        </button>
                        <button 
                          className="action-btn primary"
                          onClick={() => shareCertificate(cert.id)}
                          title="Share verification report"
                        >
                          📤
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>👤 Student Profile</h3>
              <p>Your academic information</p>
            </div>
            <div className="card-content">
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Full Name</label>
                  <div className="field-value">{user.name}</div>
                </div>
                <div className="profile-field">
                  <label>Email</label>
                  <div className="field-value">{user.email}</div>
                </div>
                <div className="profile-field">
                  <label>Roll Number</label>
                  <div className="field-value">{user.profile?.rollNo || 'Not provided'}</div>
                </div>
                <div className="profile-field">
                  <label>Institution</label>
                  <div className="field-value">{user.profile?.institution || 'Not provided'}</div>
                </div>
                <div className="profile-field">
                  <label>Degree</label>
                  <div className="field-value">{user.profile?.degree || 'Not provided'}</div>
                </div>
              </div>
              <button className="profile-edit-btn">Edit Profile</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>⚡ Quick Actions</h3>
            </div>
            <div className="card-content">
              <div className="action-buttons">
                <button className="dashboard-action-btn">
                  <span>🔍</span>
                  <div>
                    <div className="action-title">Verify New Certificate</div>
                    <div className="action-desc">Upload and verify authenticity</div>
                  </div>
                </button>
                <button className="dashboard-action-btn">
                  <span>📋</span>
                  <div>
                    <div className="action-title">View All Certificates</div>
                    <div className="action-desc">See your verification history</div>
                  </div>
                </button>
                <button className="dashboard-action-btn">
                  <span>📤</span>
                  <div>
                    <div className="action-title">Share with Employer</div>
                    <div className="action-desc">Generate sharing link</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
