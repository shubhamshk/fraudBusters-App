import React, { useState } from 'react';
import '../FileUpload.css';
import '../VerificationResult.css';

const InstitutionDashboard = ({ user, onLogout }) => {
  const [issuedCertificates] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      certificateType: 'BSc Computer Science',
      issueDate: '2024-01-15',
      certificateId: 'CERT-2024-001',
      status: 'active'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      certificateType: 'MBA Marketing', 
      issueDate: '2024-01-12',
      certificateId: 'CERT-2024-002',
      status: 'active'
    }
  ]);

  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [generatingCertificates, setGeneratingCertificates] = useState(false);

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBulkUploadFile(file);
      console.log('Bulk student records uploaded:', file.name);
      // TODO: Parse CSV/Excel and validate data
    }
  };

  const generateCertificate = (studentData) => {
    setGeneratingCertificates(true);
    console.log('Generating certificate for:', studentData);
    // TODO: Generate certificate with QR code and watermark
    setTimeout(() => setGeneratingCertificates(false), 2000);
  };

  const revokeCertificate = (certId) => {
    console.log('Revoking certificate:', certId);
    // TODO: Implement certificate revocation
  };

  const downloadCertificate = (certId) => {
    console.log('Downloading certificate:', certId);
    // TODO: Download certificate with security features
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="user-info">
            <div className="user-avatar">🏛️</div>
            <div className="user-details">
              <h2>Welcome, {user.name}</h2>
              <p className="user-role">Institution / University Admin</p>
              <div className="user-meta">
                {user.profile?.institutionCode && <span>Code: {user.profile.institutionCode}</span>}
                {user.profile?.institutionType && <span>Type: {user.profile.institutionType}</span>}
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
            <div className="stat-card issued">
              <div className="stat-icon">📜</div>
              <div className="stat-content">
                <div className="stat-number">1,247</div>
                <div className="stat-label">Certificates Issued</div>
              </div>
            </div>
            <div className="stat-card active">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">1,235</div>
                <div className="stat-label">Active Certificates</div>
              </div>
            </div>
            <div className="stat-card revoked">
              <div className="stat-icon">🚫</div>
              <div className="stat-content">
                <div className="stat-number">12</div>
                <div className="stat-label">Revoked</div>
              </div>
            </div>
            <div className="stat-card verified">
              <div className="stat-icon">🔍</div>
              <div className="stat-content">
                <div className="stat-number">856</div>
                <div className="stat-label">Times Verified</div>
              </div>
            </div>
          </div>

          {/* Bulk Upload Section */}
          <div className="dashboard-card primary">
            <div className="card-header">
              <h3>📚 Upload Student Records</h3>
              <p>Upload bulk student data to generate certificates</p>
            </div>
            <div className="card-content">
              <div className="bulk-upload-area">
                <div className="upload-section">
                  <input
                    type="file"
                    id="bulk-upload"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleBulkUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="bulk-upload" className="upload-btn primary">
                    <span className="upload-icon">📤</span>
                    Upload CSV/Excel File
                  </label>
                  <p className="upload-help">Supported formats: CSV, Excel (.xlsx, .xls)</p>
                  {bulkUploadFile && (
                    <div className="file-info">
                      <span className="file-name">📄 {bulkUploadFile.name}</span>
                      <button 
                        className="process-btn"
                        onClick={() => generateCertificate(bulkUploadFile)}
                        disabled={generatingCertificates}
                      >
                        {generatingCertificates ? 'Processing...' : 'Process & Generate Certificates'}
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="integration-options">
                  <h4>🔗 ERP Integration</h4>
                  <div className="integration-buttons">
                    <button className="integration-btn">
                      <span>🏫</span>
                      Connect Student Management System
                    </button>
                    <button className="integration-btn">
                      <span>📊</span>
                      Sync Academic Records
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Generation */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>🎓 Generate Individual Certificate</h3>
              <p>Create single certificate with security features</p>
            </div>
            <div className="card-content">
              <form className="certificate-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Student Name</label>
                    <input type="text" placeholder="Enter student name" />
                  </div>
                  <div className="form-group">
                    <label>Certificate Type</label>
                    <select>
                      <option value="">Select certificate type</option>
                      <option value="degree">Degree Certificate</option>
                      <option value="diploma">Diploma Certificate</option>
                      <option value="transcript">Official Transcript</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Student ID</label>
                    <input type="text" placeholder="Student ID/Roll Number" />
                  </div>
                  <div className="form-group">
                    <label>Issue Date</label>
                    <input type="date" />
                  </div>
                </div>
                <button type="button" className="generate-btn primary">
                  <span>🎯</span>
                  Generate Secure Certificate
                </button>
              </form>
            </div>
          </div>

          {/* Issued Certificates */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📜 Issued Certificates</h3>
              <p>Manage and track issued certificates</p>
            </div>
            <div className="card-content">
              <div className="certificates-list">
                {issuedCertificates.map((cert) => (
                  <div key={cert.id} className="certificate-item">
                    <div className="certificate-info">
                      <div className="student-details">
                        <div className="student-name">{cert.studentName}</div>
                        <div className="certificate-type">{cert.certificateType}</div>
                        <div className="certificate-meta">
                          <span className="cert-id">ID: {cert.certificateId}</span>
                          <span className="issue-date">Issued: {cert.issueDate}</span>
                        </div>
                      </div>
                      <div className="certificate-status">
                        <span className={`status-badge ${cert.status}`}>
                          {cert.status === 'active' ? '✅ Active' : '🚫 Revoked'}
                        </span>
                      </div>
                    </div>
                    <div className="certificate-actions">
                      <button 
                        className="action-btn secondary" 
                        onClick={() => downloadCertificate(cert.certificateId)}
                        title="Download Certificate"
                      >
                        📥
                      </button>
                      <button 
                        className="action-btn primary" 
                        title="View QR Code"
                      >
                        📱
                      </button>
                      <button 
                        className="action-btn warning" 
                        onClick={() => revokeCertificate(cert.certificateId)}
                        title="Revoke Certificate"
                      >
                        🚫
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Institution Settings */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>⚙️ Institution Settings</h3>
              <p>Configure security and certificate templates</p>
            </div>
            <div className="card-content">
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>🔐 Security Settings</h4>
                    <p>Configure encryption and watermark settings</p>
                  </div>
                  <button className="setting-btn">Configure</button>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>🎨 Certificate Templates</h4>
                    <p>Design and customize certificate layouts</p>
                  </div>
                  <button className="setting-btn">Manage Templates</button>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>👥 User Management</h4>
                    <p>Manage admin users and permissions</p>
                  </div>
                  <button className="setting-btn">Manage Users</button>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>📊 Analytics & Reports</h4>
                    <p>View certificate issuance analytics</p>
                  </div>
                  <button className="setting-btn">View Reports</button>
                </div>
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
                  <span>📚</span>
                  <div>
                    <div className="action-title">Bulk Upload</div>
                    <div className="action-desc">Upload student records</div>
                  </div>
                </button>
                <button className="dashboard-action-btn">
                  <span>🎓</span>
                  <div>
                    <div className="action-title">Generate Certificate</div>
                    <div className="action-desc">Create individual certificate</div>
                  </div>
                </button>
                <button className="dashboard-action-btn">
                  <span>📊</span>
                  <div>
                    <div className="action-title">View Analytics</div>
                    <div className="action-desc">Certificate statistics</div>
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

export default InstitutionDashboard;
