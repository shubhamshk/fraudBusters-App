import React, { useState } from 'react';
import '../FileUpload.css';
import '../VerificationResult.css';

const GovAdminDashboard = ({ user, onLogout }) => {
  const [analyticsData] = useState({
    totalVerifications: 15748,
    genuineCertificates: 14235,
    suspiciousCertificates: 892,
    fakeCertificates: 621,
    institutionsOnboarded: 142,
    fraudTrends: {
      thisMonth: '+12%',
      lastMonth: '+8%',
      trend: 'increasing'
    }
  });

  const [blacklistedEntities] = useState([
    {
      id: 1,
      name: 'Fake University XYZ',
      type: 'Institution',
      reason: 'Issuing fraudulent certificates',
      dateBlacklisted: '2024-01-10',
      status: 'active'
    },
    {
      id: 2,
      name: 'John Doe Consulting',
      type: 'Individual',
      reason: 'Repeat certificate fraud offender',
      dateBlacklisted: '2024-01-05',
      status: 'active'
    }
  ]);

  const [pendingApprovals] = useState([
    {
      id: 1,
      institutionName: 'New Tech University',
      type: 'University',
      location: 'Mumbai',
      submittedDate: '2024-01-12',
      status: 'pending'
    },
    {
      id: 2,
      companyName: 'TechCorp HR Solutions',
      type: 'Employer',
      location: 'Delhi',
      submittedDate: '2024-01-10',
      status: 'pending'
    }
  ]);

  const [fraudAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      message: 'Spike in fake certificates from unknown institution detected',
      location: 'Maharashtra',
      time: '2 hours ago',
      count: 15
    },
    {
      id: 2,
      type: 'warning',
      message: 'Suspicious verification pattern detected',
      location: 'Karnataka',
      time: '4 hours ago',
      count: 8
    }
  ]);

  const approveInstitution = (id) => {
    console.log('Approving institution:', id);
    // TODO: Implement institution approval
  };

  const rejectInstitution = (id) => {
    console.log('Rejecting institution:', id);
    // TODO: Implement institution rejection
  };

  const generateReport = (reportType) => {
    console.log('Generating report:', reportType);
    // TODO: Generate policy reports
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="user-info">
            <div className="user-avatar">🏛️</div>
            <div className="user-details">
              <h2>Welcome, {user.name}</h2>
              <p className="user-role">Government / Higher Education Department</p>
              <div className="user-meta">
                {user.profile?.department && <span>Dept: {user.profile.department}</span>}
                {user.profile?.adminLevel && <span>Level: {user.profile.adminLevel}</span>}
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
          {/* Real-time Analytics Dashboard */}
          <div className="analytics-overview">
            <div className="analytics-header">
              <h2>📊 State-wide Certificate Verification Analytics</h2>
              <div className="time-filters">
                <button className="filter-btn active">Today</button>
                <button className="filter-btn">This Week</button>
                <button className="filter-btn">This Month</button>
                <button className="filter-btn">This Year</button>
              </div>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card total-verifications">
                <div className="stat-icon">🔍</div>
                <div className="stat-content">
                  <div className="stat-number">{analyticsData.totalVerifications.toLocaleString()}</div>
                  <div className="stat-label">Total Verifications</div>
                  <div className="stat-change positive">+5.2% from last month</div>
                </div>
              </div>
              
              <div className="stat-card genuine">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{analyticsData.genuineCertificates.toLocaleString()}</div>
                  <div className="stat-label">Genuine Certificates</div>
                  <div className="stat-percentage">90.4%</div>
                </div>
              </div>
              
              <div className="stat-card suspicious">
                <div className="stat-icon">⚠️</div>
                <div className="stat-content">
                  <div className="stat-number">{analyticsData.suspiciousCertificates.toLocaleString()}</div>
                  <div className="stat-label">Flagged as Suspicious</div>
                  <div className="stat-percentage">5.7%</div>
                </div>
              </div>
              
              <div className="stat-card fake">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <div className="stat-number">{analyticsData.fakeCertificates.toLocaleString()}</div>
                  <div className="stat-label">Fake Certificates</div>
                  <div className="stat-percentage">3.9%</div>
                </div>
              </div>
              
              <div className="stat-card institutions">
                <div className="stat-icon">🏫</div>
                <div className="stat-content">
                  <div className="stat-number">{analyticsData.institutionsOnboarded}</div>
                  <div className="stat-label">Institutions Onboarded</div>
                  <div className="stat-change positive">+12 this month</div>
                </div>
              </div>
              
              <div className="stat-card fraud-trend">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <div className="stat-number">{analyticsData.fraudTrends.thisMonth}</div>
                  <div className="stat-label">Fraud Detection Trend</div>
                  <div className={`stat-change ${analyticsData.fraudTrends.trend === 'increasing' ? 'negative' : 'positive'}`}>
                    {analyticsData.fraudTrends.trend}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fraud Alerts */}
          <div className="dashboard-card critical">
            <div className="card-header">
              <h3>🚨 Fraud Detection Alerts</h3>
              <p>Real-time fraud detection and security alerts</p>
            </div>
            <div className="card-content">
              <div className="alerts-list">
                {fraudAlerts.map((alert) => (
                  <div key={alert.id} className={`alert-item ${alert.type}`}>
                    <div className="alert-icon">
                      {alert.type === 'critical' ? '🚨' : '⚠️'}
                    </div>
                    <div className="alert-content">
                      <div className="alert-message">{alert.message}</div>
                      <div className="alert-meta">
                        <span className="alert-location">📍 {alert.location}</span>
                        <span className="alert-count">{alert.count} cases</span>
                        <span className="alert-time">{alert.time}</span>
                      </div>
                    </div>
                    <div className="alert-actions">
                      <button className="alert-btn investigate">Investigate</button>
                      <button className="alert-btn dismiss">Dismiss</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>⏳ Pending Approvals</h3>
              <p>Institutions and employers awaiting approval</p>
            </div>
            <div className="card-content">
              <div className="approvals-list">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="approval-item">
                    <div className="approval-info">
                      <div className="approval-name">
                        {item.institutionName || item.companyName}
                      </div>
                      <div className="approval-details">
                        <span className="approval-type">{item.type}</span>
                        <span className="approval-location">📍 {item.location}</span>
                        <span className="approval-date">Submitted: {item.submittedDate}</span>
                      </div>
                    </div>
                    <div className="approval-actions">
                      <button 
                        className="action-btn success"
                        onClick={() => approveInstitution(item.id)}
                      >
                        ✅ Approve
                      </button>
                      <button 
                        className="action-btn danger"
                        onClick={() => rejectInstitution(item.id)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Blacklist Management */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>🚫 Blacklist Management</h3>
              <p>Manage fake institutions and repeat offenders</p>
            </div>
            <div className="card-content">
              <div className="blacklist-controls">
                <input 
                  type="text" 
                  placeholder="Search or add entity to blacklist..." 
                  className="blacklist-search"
                />
                <button className="blacklist-add-btn">Add to Blacklist</button>
              </div>
              
              <div className="blacklist-items">
                {blacklistedEntities.map((entity) => (
                  <div key={entity.id} className="blacklist-item">
                    <div className="blacklist-info">
                      <div className="entity-name">{entity.name}</div>
                      <div className="entity-details">
                        <span className="entity-type">{entity.type}</span>
                        <span className="blacklist-reason">{entity.reason}</span>
                        <span className="blacklist-date">Blacklisted: {entity.dateBlacklisted}</span>
                      </div>
                    </div>
                    <div className="blacklist-actions">
                      <button className="action-btn secondary">Edit</button>
                      <button className="action-btn danger">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reports & Policy */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📋 Policy Reports</h3>
              <p>Generate reports for policy and decision-making</p>
            </div>
            <div className="card-content">
              <div className="report-options">
                <div className="report-option">
                  <div className="report-info">
                    <h4>📊 Monthly Fraud Analysis</h4>
                    <p>Comprehensive fraud detection trends and patterns</p>
                  </div>
                  <button 
                    className="report-btn"
                    onClick={() => generateReport('monthly-fraud')}
                  >
                    Generate Report
                  </button>
                </div>
                
                <div className="report-option">
                  <div className="report-info">
                    <h4>🏫 Institution Compliance Report</h4>
                    <p>Status and compliance of registered institutions</p>
                  </div>
                  <button 
                    className="report-btn"
                    onClick={() => generateReport('institution-compliance')}
                  >
                    Generate Report
                  </button>
                </div>
                
                <div className="report-option">
                  <div className="report-info">
                    <h4>🌍 State-wise Analytics</h4>
                    <p>Regional breakdown of certificate verification data</p>
                  </div>
                  <button 
                    className="report-btn"
                    onClick={() => generateReport('state-analytics')}
                  >
                    Generate Report
                  </button>
                </div>
                
                <div className="report-option">
                  <div className="report-info">
                    <h4>🔍 System Performance Report</h4>
                    <p>Technical performance and system usage statistics</p>
                  </div>
                  <button 
                    className="report-btn"
                    onClick={() => generateReport('system-performance')}
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions for Government Admin */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>⚡ Administrative Actions</h3>
            </div>
            <div className="card-content">
              <div className="action-buttons">
                <button className="dashboard-action-btn">
                  <span>⏳</span>
                  <div>
                    <div className="action-title">Review Approvals</div>
                    <div className="action-desc">Approve pending institutions</div>
                  </div>
                </button>
                <button className="dashboard-action-btn">
                  <span>🚫</span>
                  <div>
                    <div className="action-title">Manage Blacklist</div>
                    <div className="action-desc">Add/remove blacklisted entities</div>
                  </div>
                </button>
                <button className="dashboard-action-btn">
                  <span>📊</span>
                  <div>
                    <div className="action-title">Generate Reports</div>
                    <div className="action-desc">Create policy reports</div>
                  </div>
                </button>
                <button className="dashboard-action-btn">
                  <span>🚨</span>
                  <div>
                    <div className="action-title">Investigate Alerts</div>
                    <div className="action-desc">Review fraud alerts</div>
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

export default GovAdminDashboard;
