import React, { useState } from 'react';
import '../FileUpload.css';
import '../VerificationResult.css';

const EmployerDashboard = ({ user, onLogout }) => {
  const [verificationHistory] = useState([
    {
      id: 1,
      candidateName: 'John Doe',
      certificateType: 'BSc Computer Science',
      status: 'genuine',
      verifiedAt: '2024-01-15',
      confidence: 95,
      institution: 'ABC University'
    },
    {
      id: 2,
      candidateName: 'Jane Smith', 
      certificateType: 'MBA Marketing',
      status: 'suspicious',
      verifiedAt: '2024-01-12',
      confidence: 65,
      institution: 'XYZ Business School'
    },
    {
      id: 3,
      candidateName: 'Bob Johnson',
      certificateType: 'Engineering Diploma',
      status: 'fake',
      verifiedAt: '2024-01-10',
      confidence: 15,
      institution: 'Unknown Institution'
    }
  ]);

  const [bulkVerificationFiles, setBulkVerificationFiles] = useState([]);
  const [notifications] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'Suspicious certificate detected for candidate Jane Smith',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'alert',
      message: 'Fake certificate flagged for candidate Bob Johnson',
      time: '1 day ago'
    }
  ]);

  const handleSingleVerification = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Verifying single certificate:', file.name);
      // TODO: Implement OCR and verification
    }
  };

  const handleBulkVerification = (e) => {
    const files = Array.from(e.target.files);
    setBulkVerificationFiles(files);
    console.log('Bulk verification for', files.length, 'files');
    // TODO: Implement bulk verification
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'genuine': return 'status-genuine';
      case 'fake': return 'status-fake';
      case 'suspicious': return 'status-suspicious';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'genuine': return '✅';
      case 'fake': return '❌';
      case 'suspicious': return '⚠️';
      default: return '⏳';
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="user-info">
            <div className="user-avatar">🏢</div>
            <div className="user-details">
              <h2>Welcome, {user.name}</h2>
              <p className="user-role">Employer / Agency / Verifier</p>
              <div className="user-meta">
                {user.profile?.company && <span>Company: {user.profile.company}</span>}
                {user.profile?.designation && <span>Role: {user.profile.designation}</span>}
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
        <div className="dashboard-grid">
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card genuine">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">127</div>
                <div className="stat-label">Genuine Certificates</div>
              </div>
            </div>
            <div className="stat-card suspicious">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <div className="stat-number">8</div>
                <div className="stat-label">Suspicious</div>
              </div>
            </div>
            <div className="stat-card fake">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <div className="stat-number">3</div>
                <div className="stat-label">Fake Detected</div>
              </div>
            </div>
            <div className="stat-card total">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-number">138</div>
                <div className="stat-label">Total Verifications</div>
              </div>
            </div>
          </div>

          {/* Certificate Verification */}
          <div className="dashboard-card primary">
            <div className="card-header">
              <h3>🔍 Certificate Verification</h3>
              <p>Upload candidate certificates for instant verification</p>
            </div>
            <div className="card-content">
              <div className="verification-options">
                <div className="verification-option">
                  <h4>📄 Single Certificate</h4>
                  <input
                    type="file"
                    id="single-cert-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleSingleVerification}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="single-cert-upload" className="upload-btn secondary">
                    <span className="upload-icon">📤</span>
                    Upload Certificate
                  </label>
                  <p className="upload-help">Get instant OCR + cross-verification results</p>
                </div>

                <div className="verification-option">
                  <h4>📚 Bulk Verification</h4>
                  <input
                    type="file"
                    id="bulk-cert-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleBulkVerification}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="bulk-cert-upload" className="upload-btn primary">
                    <span className="upload-icon">📦</span>
                    Upload Multiple Files
                  </label>
                  <p className="upload-help">Verify multiple certificates at once</p>
                  {bulkVerificationFiles.length > 0 && (
                    <div className="bulk-files-info">
                      <p>{bulkVerificationFiles.length} files selected for bulk verification</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Verification History */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📋 Verification History</h3>
              <p>Recent certificate verifications</p>
            </div>
            <div className="card-content">
              <div className="history-list">
                {verificationHistory.map((record) => (
                  <div key={record.id} className="history-item employer">
                    <div className="history-info">
                      <div className="candidate-info">
                        <div className="candidate-name">{record.candidateName}</div>
                        <div className="certificate-type">{record.certificateType}</div>
                        <div className="institution">{record.institution}</div>
                      </div>
                      <div className="verification-details">
                        <span className={`status-badge ${getStatusBadgeClass(record.status)}`}>
                          {getStatusIcon(record.status)} {record.status.toUpperCase()}
                        </span>
                        <span className="confidence">Confidence: {record.confidence}%</span>
                        <span className="date">{record.verifiedAt}</span>
                      </div>
                    </div>
                    <div className="history-actions">
                      <button className="action-btn secondary" title="View Details">👁️</button>
                      <button className="action-btn primary" title="Download Report">📄</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>🔔 Alerts & Notifications</h3>
              <p>Flagged certificates and alerts</p>
            </div>
            <div className="card-content">
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`notification-item ${notification.type}`}>
                    <div className="notification-icon">
                      {notification.type === 'warning' ? '⚠️' : '🚨'}
                    </div>
                    <div className="notification-content">
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                    <button className="notification-close">×</button>
                  </div>
                ))}
              </div>
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
                    <div className="action-title">Verify Certificate</div>
                    <div className="action-desc">Upload and verify candidate certificate</div>
                  </div>
                </button>
                <button className="dashboard-action-btn">
                  <span>📦</span>
                  <div>
                    <div className="action-title">Bulk Verification</div>
                    <div className="action-desc">Verify multiple certificates</div>
                  </div>
                </button>
                <button className="dashboard-action-btn">
                  <span>📊</span>
                  <div>
                    <div className="action-title">View Reports</div>
                    <div className="action-desc">Download verification reports</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;
