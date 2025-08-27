// Enhanced Security & Privacy Controls Tests
// Testing advanced security measures, privacy settings, and data protection

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { futureUsers } from '../../../../tests/fixtures/future-users';

// Mock Security Components
const MockPrivacyControlCenter = ({ user, privacySettings, onUpdateSetting }: any) => (
  <div data-testid="privacy-control-center">
    <h2>Neural Privacy Fortress</h2>
    <div data-testid="user-info">{user.profile.display_name}</div>
    
    {/* Profile Privacy Settings */}
    <div data-testid="profile-privacy">
      <h3>Profile Visibility</h3>
      <div className="privacy-setting">
        <label>Profile Visibility:</label>
        <select 
          value={privacySettings.profile_visibility} 
          onChange={(e) => onUpdateSetting('profile_visibility', e.target.value)}
          data-testid="profile-visibility-select"
        >
          <option value="public">Public</option>
          <option value="followers">Followers Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      
      <div className="privacy-setting">
        <label>
          <input 
            type="checkbox" 
            checked={privacySettings.show_online_status}
            onChange={(e) => onUpdateSetting('show_online_status', e.target.checked)}
            data-testid="show-online-status"
          />
          Show Online Status
        </label>
      </div>
      
      <div className="privacy-setting">
        <label>
          <input 
            type="checkbox" 
            checked={privacySettings.show_last_seen}
            onChange={(e) => onUpdateSetting('show_last_seen', e.target.checked)}
            data-testid="show-last-seen"
          />
          Show Last Seen
        </label>
      </div>
      
      <div className="privacy-setting">
        <label>
          <input 
            type="checkbox" 
            checked={privacySettings.indexable_by_search}
            onChange={(e) => onUpdateSetting('indexable_by_search', e.target.checked)}
            data-testid="indexable-by-search"
          />
          Allow Search Engine Indexing
        </label>
      </div>
    </div>
    
    {/* Content Privacy */}
    <div data-testid="content-privacy">
      <h3>Content Privacy</h3>
      <div className="privacy-setting">
        <label>Default Content Visibility:</label>
        <select 
          value={privacySettings.default_content_visibility}
          onChange={(e) => onUpdateSetting('default_content_visibility', e.target.value)}
          data-testid="content-visibility-select"
        >
          <option value="public">Public</option>
          <option value="unlisted">Unlisted</option>
          <option value="followers">Followers Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      
      <div className="privacy-setting">
        <label>
          <input 
            type="checkbox" 
            checked={privacySettings.allow_downloads}
            onChange={(e) => onUpdateSetting('allow_downloads', e.target.checked)}
            data-testid="allow-downloads"
          />
          Allow Content Downloads
        </label>
      </div>
      
      <div className="privacy-setting">
        <label>
          <input 
            type="checkbox" 
            checked={privacySettings.watermark_content}
            onChange={(e) => onUpdateSetting('watermark_content', e.target.checked)}
            data-testid="watermark-content"
          />
          Add Watermark to Content
        </label>
      </div>
    </div>
    
    {/* Data & Analytics Privacy */}
    <div data-testid="data-privacy">
      <h3>Data & Analytics</h3>
      <div className="privacy-setting">
        <label>
          <input 
            type="checkbox" 
            checked={privacySettings.analytics_tracking}
            onChange={(e) => onUpdateSetting('analytics_tracking', e.target.checked)}
            data-testid="analytics-tracking"
          />
          Allow Analytics Tracking
        </label>
      </div>
      
      <div className="privacy-setting">
        <label>
          <input 
            type="checkbox" 
            checked={privacySettings.personalized_ads}
            onChange={(e) => onUpdateSetting('personalized_ads', e.target.checked)}
            data-testid="personalized-ads"
          />
          Personalized Advertisements
        </label>
      </div>
      
      <div className="privacy-setting">
        <label>
          <input 
            type="checkbox" 
            checked={privacySettings.data_sharing_partners}
            onChange={(e) => onUpdateSetting('data_sharing_partners', e.target.checked)}
            data-testid="data-sharing-partners"
          />
          Share Data with Partners
        </label>
      </div>
    </div>
  </div>
);

const MockSecurityDashboard = ({ securityStatus, threats, onTakeAction }: any) => (
  <div data-testid="security-dashboard">
    <h2>Cyber Defense Matrix</h2>
    
    {/* Security Status Overview */}
    <div data-testid="security-status">
      <div className="security-score">
        <h3>Security Score</h3>
        <div data-testid="security-score-value" className="score-value">{securityStatus.security_score}/100</div>
        <div data-testid="security-level" className="security-level">{securityStatus.security_level}</div>
      </div>
      
      <div className="security-metrics">
        <div data-testid="threats-blocked">Threats Blocked: {securityStatus.threats_blocked}</div>
        <div data-testid="login-attempts">Failed Logins: {securityStatus.failed_login_attempts}</div>
        <div data-testid="last-scan">Last Scan: {securityStatus.last_security_scan}</div>
        <div data-testid="vpn-status">VPN Status: {securityStatus.vpn_active ? 'Active' : 'Inactive'}</div>
      </div>
    </div>
    
    {/* Active Threats */}
    <div data-testid="active-threats">
      <h3>Security Alerts</h3>
      {threats.length > 0 ? (
        threats.map((threat: any, index: number) => (
          <div key={index} data-testid={`threat-${index}`} className={`threat-item ${threat.severity}`}>
            <div className="threat-header">
              <h4>{threat.title}</h4>
              <div data-testid={`threat-severity-${index}`} className="severity">{threat.severity}</div>
            </div>
            
            <div className="threat-details">
              <div data-testid={`threat-description-${index}`}>{threat.description}</div>
              <div data-testid={`threat-source-${index}`}>Source: {threat.source}</div>
              <div data-testid={`threat-time-${index}`}>Detected: {threat.detected_at}</div>
            </div>
            
            <div className="threat-actions">
              <button 
                onClick={() => onTakeAction(threat.id, 'block')}
                data-testid={`block-threat-${index}`}
              >
                Block
              </button>
              
              <button 
                onClick={() => onTakeAction(threat.id, 'investigate')}
                data-testid={`investigate-threat-${index}`}
              >
                Investigate
              </button>
              
              <button 
                onClick={() => onTakeAction(threat.id, 'dismiss')}
                data-testid={`dismiss-threat-${index}`}
              >
                Dismiss
              </button>
            </div>
          </div>
        ))
      ) : (
        <div data-testid="no-threats">No active threats detected</div>
      )}
    </div>
    
    {/* Security Tools */}
    <div data-testid="security-tools">
      <h3>Security Tools</h3>
      <div className="tools-grid">
        <button data-testid="run-security-scan">Run Security Scan</button>
        <button data-testid="enable-2fa">Enable 2FA</button>
        <button data-testid="generate-backup-codes">Backup Codes</button>
        <button data-testid="review-login-history">Login History</button>
        <button data-testid="manage-sessions">Active Sessions</button>
        <button data-testid="export-data">Export My Data</button>
      </div>
    </div>
  </div>
);

const MockDataProtectionCenter = ({ dataUsage, onDataAction }: any) => (
  <div data-testid="data-protection-center">
    <h2>Data Protection Nexus</h2>
    
    {/* Data Usage Overview */}
    <div data-testid="data-usage-overview">
      <h3>Your Data Footprint</h3>
      <div className="data-metrics">
        <div data-testid="total-data-size">Total Data: {dataUsage.total_size} GB</div>
        <div data-testid="personal-data-points">Personal Data Points: {dataUsage.personal_data_points}</div>
        <div data-testid="tracking-cookies">Tracking Cookies: {dataUsage.tracking_cookies}</div>
        <div data-testid="third-party-shares">Shared with Partners: {dataUsage.third_party_shares}</div>
      </div>
    </div>
    
    {/* Data Categories */}
    <div data-testid="data-categories">
      <h3>Data Categories</h3>
      {dataUsage.categories.map((category: any, index: number) => (
        <div key={index} data-testid={`data-category-${index}`} className="data-category">
          <div className="category-header">
            <h4>{category.name}</h4>
            <div data-testid={`category-size-${index}`}>{category.size} MB</div>
          </div>
          
          <div className="category-details">
            <div data-testid={`category-items-${index}`}>Items: {category.item_count}</div>
            <div data-testid={`category-retention-${index}`}>Retention: {category.retention_period}</div>
            <div data-testid={`category-encrypted-${index}`}>Encrypted: {category.encrypted ? 'Yes' : 'No'}</div>
          </div>
          
          <div className="category-actions">
            <button 
              onClick={() => onDataAction(category.id, 'download')}
              data-testid={`download-category-${index}`}
            >
              Download
            </button>
            
            <button 
              onClick={() => onDataAction(category.id, 'delete')}
              data-testid={`delete-category-${index}`}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
    
    {/* GDPR Controls */}
    <div data-testid="gdpr-controls">
      <h3>Privacy Rights (GDPR)</h3>
      <div className="gdpr-actions">
        <button 
          onClick={() => onDataAction('all', 'export')}
          data-testid="export-all-data"
        >
          Export All Data
        </button>
        
        <button 
          onClick={() => onDataAction('all', 'delete')}
          data-testid="delete-all-data"
        >
          Delete All Data
        </button>
        
        <button 
          onClick={() => onDataAction('all', 'portability')}
          data-testid="data-portability"
        >
          Data Portability
        </button>
        
        <button 
          onClick={() => onDataAction('processing', 'object')}
          data-testid="object-processing"
        >
          Object to Processing
        </button>
      </div>
    </div>
    
    {/* Consent Management */}
    <div data-testid="consent-management">
      <h3>Consent Management</h3>
      <div data-testid="consent-history">
        <div>Marketing Consent: {dataUsage.consents.marketing ? 'Given' : 'Withdrawn'}</div>
        <div>Analytics Consent: {dataUsage.consents.analytics ? 'Given' : 'Withdrawn'}</div>
        <div>Functional Consent: {dataUsage.consents.functional ? 'Given' : 'Withdrawn'}</div>
      </div>
      
      <button 
        onClick={() => onDataAction('consent', 'manage')}
        data-testid="manage-consent"
      >
        Update Consent Preferences
      </button>
    </div>
  </div>
);

const MockEncryptionManager = ({ encryptionStatus, onEncryptionAction }: any) => (
  <div data-testid="encryption-manager">
    <h2>Quantum Encryption Core</h2>
    
    {/* Encryption Status */}
    <div data-testid="encryption-status">
      <h3>Encryption Overview</h3>
      <div className="encryption-metrics">
        <div data-testid="encryption-level">Encryption Level: {encryptionStatus.encryption_level}</div>
        <div data-testid="key-strength">Key Strength: {encryptionStatus.key_strength} bit</div>
        <div data-testid="algorithm">Algorithm: {encryptionStatus.algorithm}</div>
        <div data-testid="last-key-rotation">Last Key Rotation: {encryptionStatus.last_key_rotation}</div>
      </div>
    </div>
    
    {/* File Encryption */}
    <div data-testid="file-encryption">
      <h3>File Encryption</h3>
      {encryptionStatus.encrypted_files.map((file: any, index: number) => (
        <div key={index} data-testid={`encrypted-file-${index}`} className="encrypted-file">
          <div className="file-info">
            <div data-testid={`file-name-${index}`}>{file.name}</div>
            <div data-testid={`file-size-${index}`}>{file.size} MB</div>
            <div data-testid={`file-encryption-${index}`}>Encryption: {file.encryption_status}</div>
          </div>
          
          <div className="file-actions">
            <button 
              onClick={() => onEncryptionAction(file.id, 'decrypt')}
              data-testid={`decrypt-file-${index}`}
            >
              Decrypt
            </button>
            
            <button 
              onClick={() => onEncryptionAction(file.id, 'reencrypt')}
              data-testid={`reencrypt-file-${index}`}
            >
              Re-encrypt
            </button>
          </div>
        </div>
      ))}
    </div>
    
    {/* Key Management */}
    <div data-testid="key-management">
      <h3>Key Management</h3>
      <div className="key-actions">
        <button 
          onClick={() => onEncryptionAction('keys', 'generate')}
          data-testid="generate-new-key"
        >
          Generate New Key
        </button>
        
        <button 
          onClick={() => onEncryptionAction('keys', 'rotate')}
          data-testid="rotate-keys"
        >
          Rotate All Keys
        </button>
        
        <button 
          onClick={() => onEncryptionAction('keys', 'backup')}
          data-testid="backup-keys"
        >
          Backup Keys
        </button>
        
        <button 
          onClick={() => onEncryptionAction('keys', 'export')}
          data-testid="export-keys"
        >
          Export Public Keys
        </button>
      </div>
    </div>
    
    {/* Zero-Knowledge Features */}
    <div data-testid="zero-knowledge">
      <h3>Zero-Knowledge Security</h3>
      <div className="zk-features">
        <div data-testid="client-side-encryption">Client-Side Encryption: {encryptionStatus.client_side_encryption ? 'Enabled' : 'Disabled'}</div>
        <div data-testid="server-blind">Server Blind: {encryptionStatus.server_blind ? 'Yes' : 'No'}</div>
        <div data-testid="end-to-end">End-to-End: {encryptionStatus.end_to_end_encryption ? 'Active' : 'Inactive'}</div>
      </div>
    </div>
  </div>
);

describe('Enhanced Security & Privacy Controls', () => {
  const secureUser = futureUsers.aiCreatorPro;
  
  const mockPrivacySettings = {
    profile_visibility: 'followers',
    show_online_status: true,
    show_last_seen: false,
    indexable_by_search: false,
    default_content_visibility: 'public',
    allow_downloads: false,
    watermark_content: true,
    analytics_tracking: false,
    personalized_ads: false,
    data_sharing_partners: false
  };
  
  const mockSecurityStatus = {
    security_score: 87,
    security_level: 'High',
    threats_blocked: 23,
    failed_login_attempts: 2,
    last_security_scan: '2 hours ago',
    vpn_active: true
  };
  
  const mockThreats = [
    {
      id: 'threat-001',
      title: 'Suspicious Login Attempt',
      severity: 'medium',
      description: 'Login attempt from unknown IP address in different country',
      source: '192.168.1.100',
      detected_at: '15 minutes ago'
    },
    {
      id: 'threat-002',
      title: 'Potential Account Takeover',
      severity: 'high',
      description: 'Multiple failed login attempts followed by password reset request',
      source: 'Multiple IPs',
      detected_at: '1 hour ago'
    }
  ];
  
  const mockDataUsage = {
    total_size: 2.7,
    personal_data_points: 1247,
    tracking_cookies: 23,
    third_party_shares: 5,
    categories: [
      {
        id: 'cat-001',
        name: 'Profile Data',
        size: 145,
        item_count: 47,
        retention_period: 'Until account deletion',
        encrypted: true
      },
      {
        id: 'cat-002',
        name: 'Content Data',
        size: 2341,
        item_count: 234,
        retention_period: 'Indefinite',
        encrypted: true
      },
      {
        id: 'cat-003',
        name: 'Analytics Data',
        size: 234,
        item_count: 15623,
        retention_period: '2 years',
        encrypted: false
      }
    ],
    consents: {
      marketing: false,
      analytics: false,
      functional: true
    }
  };
  
  const mockEncryptionStatus = {
    encryption_level: 'Military Grade',
    key_strength: 256,
    algorithm: 'AES-256-GCM',
    last_key_rotation: '7 days ago',
    client_side_encryption: true,
    server_blind: true,
    end_to_end_encryption: true,
    encrypted_files: [
      {
        id: 'file-001',
        name: 'neural-beats-collection.wav',
        size: 45.7,
        encryption_status: 'AES-256 Encrypted'
      },
      {
        id: 'file-002',
        name: 'cyberpunk-artwork.psd',
        size: 123.4,
        encryption_status: 'AES-256 Encrypted'
      }
    ]
  };
  
  beforeEach(() => {
    // Mock Web Crypto API
    global.crypto = {
      subtle: {
        generateKey: vi.fn().mockResolvedValue({ type: 'secret', algorithm: { name: 'AES-GCM' } }),
        encrypt: vi.fn().mockResolvedValue(new ArrayBuffer(16)),
        decrypt: vi.fn().mockResolvedValue(new ArrayBuffer(16)),
        sign: vi.fn().mockResolvedValue(new ArrayBuffer(16)),
        verify: vi.fn().mockResolvedValue(true),
        digest: vi.fn().mockResolvedValue(new ArrayBuffer(32))
      },
      getRandomValues: vi.fn((array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      })
    } as any;
    
    // Mock fingerprinting detection
    global.navigator.hardwareConcurrency = 8;
    global.screen.width = 1920;
    global.screen.height = 1080;
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Privacy Control Center', () => {
    it('should render privacy control interface', () => {
      const mockOnUpdateSetting = vi.fn();
      
      render(
        <MockPrivacyControlCenter 
          user={secureUser}
          privacySettings={mockPrivacySettings}
          onUpdateSetting={mockOnUpdateSetting}
        />
      );
      
      expect(screen.getByTestId('privacy-control-center')).toBeInTheDocument();
      expect(screen.getByText('Neural Privacy Fortress')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Neural Beat Architect')).toBeInTheDocument();
    });
    
    it('should display profile privacy settings', () => {
      const mockOnUpdateSetting = vi.fn();
      
      render(
        <MockPrivacyControlCenter 
          user={secureUser}
          privacySettings={mockPrivacySettings}
          onUpdateSetting={mockOnUpdateSetting}
        />
      );
      
      const visibilitySelect = screen.getByTestId('profile-visibility-select');
      expect(visibilitySelect).toHaveValue('followers');
      
      expect(screen.getByTestId('show-online-status')).toBeChecked();
      expect(screen.getByTestId('show-last-seen')).not.toBeChecked();
      expect(screen.getByTestId('indexable-by-search')).not.toBeChecked();
    });
    
    it('should handle privacy setting updates', async () => {
      const user = userEvent.setup();
      const mockOnUpdateSetting = vi.fn();
      
      render(
        <MockPrivacyControlCenter 
          user={secureUser}
          privacySettings={mockPrivacySettings}
          onUpdateSetting={mockOnUpdateSetting}
        />
      );
      
      await user.selectOptions(screen.getByTestId('profile-visibility-select'), 'private');
      expect(mockOnUpdateSetting).toHaveBeenCalledWith('profile_visibility', 'private');
      
      await user.click(screen.getByTestId('show-last-seen'));
      expect(mockOnUpdateSetting).toHaveBeenCalledWith('show_last_seen', true);
    });
    
    it('should display content privacy settings', () => {
      const mockOnUpdateSetting = vi.fn();
      
      render(
        <MockPrivacyControlCenter 
          user={secureUser}
          privacySettings={mockPrivacySettings}
          onUpdateSetting={mockOnUpdateSetting}
        />
      );
      
      expect(screen.getByTestId('content-visibility-select')).toHaveValue('public');
      expect(screen.getByTestId('allow-downloads')).not.toBeChecked();
      expect(screen.getByTestId('watermark-content')).toBeChecked();
    });
    
    it('should show data and analytics privacy controls', () => {
      const mockOnUpdateSetting = vi.fn();
      
      render(
        <MockPrivacyControlCenter 
          user={secureUser}
          privacySettings={mockPrivacySettings}
          onUpdateSetting={mockOnUpdateSetting}
        />
      );
      
      expect(screen.getByTestId('analytics-tracking')).not.toBeChecked();
      expect(screen.getByTestId('personalized-ads')).not.toBeChecked();
      expect(screen.getByTestId('data-sharing-partners')).not.toBeChecked();
    });
  });

  describe('Security Dashboard', () => {
    it('should render security dashboard interface', () => {
      const mockOnTakeAction = vi.fn();
      
      render(
        <MockSecurityDashboard 
          securityStatus={mockSecurityStatus}
          threats={mockThreats}
          onTakeAction={mockOnTakeAction}
        />
      );
      
      expect(screen.getByTestId('security-dashboard')).toBeInTheDocument();
      expect(screen.getByText('Cyber Defense Matrix')).toBeInTheDocument();
    });
    
    it('should display security status metrics', () => {
      const mockOnTakeAction = vi.fn();
      
      render(
        <MockSecurityDashboard 
          securityStatus={mockSecurityStatus}
          threats={mockThreats}
          onTakeAction={mockOnTakeAction}
        />
      );
      
      expect(screen.getByTestId('security-score-value')).toHaveTextContent('87/100');
      expect(screen.getByTestId('security-level')).toHaveTextContent('High');
      expect(screen.getByTestId('threats-blocked')).toHaveTextContent('Threats Blocked: 23');
      expect(screen.getByTestId('login-attempts')).toHaveTextContent('Failed Logins: 2');
      expect(screen.getByTestId('vpn-status')).toHaveTextContent('VPN Status: Active');
    });
    
    it('should show active security threats', () => {
      const mockOnTakeAction = vi.fn();
      
      render(
        <MockSecurityDashboard 
          securityStatus={mockSecurityStatus}
          threats={mockThreats}
          onTakeAction={mockOnTakeAction}
        />
      );
      
      const threat1 = screen.getByTestId('threat-0');
      expect(threat1).toHaveTextContent('Suspicious Login Attempt');
      expect(screen.getByTestId('threat-severity-0')).toHaveTextContent('medium');
      expect(screen.getByTestId('threat-description-0')).toHaveTextContent(
        'Login attempt from unknown IP address in different country'
      );
      expect(screen.getByTestId('threat-source-0')).toHaveTextContent('Source: 192.168.1.100');
    });
    
    it('should handle threat management actions', async () => {
      const user = userEvent.setup();
      const mockOnTakeAction = vi.fn();
      
      render(
        <MockSecurityDashboard 
          securityStatus={mockSecurityStatus}
          threats={mockThreats}
          onTakeAction={mockOnTakeAction}
        />
      );
      
      await user.click(screen.getByTestId('block-threat-0'));
      expect(mockOnTakeAction).toHaveBeenCalledWith('threat-001', 'block');
      
      await user.click(screen.getByTestId('investigate-threat-1'));
      expect(mockOnTakeAction).toHaveBeenCalledWith('threat-002', 'investigate');
      
      await user.click(screen.getByTestId('dismiss-threat-0'));
      expect(mockOnTakeAction).toHaveBeenCalledWith('threat-001', 'dismiss');
    });
    
    it('should display no threats message when list is empty', () => {
      const mockOnTakeAction = vi.fn();
      
      render(
        <MockSecurityDashboard 
          securityStatus={mockSecurityStatus}
          threats={[]}
          onTakeAction={mockOnTakeAction}
        />
      );
      
      expect(screen.getByTestId('no-threats')).toHaveTextContent('No active threats detected');
    });
    
    it('should provide security tools', () => {
      const mockOnTakeAction = vi.fn();
      
      render(
        <MockSecurityDashboard 
          securityStatus={mockSecurityStatus}
          threats={mockThreats}
          onTakeAction={mockOnTakeAction}
        />
      );
      
      expect(screen.getByTestId('run-security-scan')).toBeInTheDocument();
      expect(screen.getByTestId('enable-2fa')).toBeInTheDocument();
      expect(screen.getByTestId('generate-backup-codes')).toBeInTheDocument();
      expect(screen.getByTestId('review-login-history')).toBeInTheDocument();
      expect(screen.getByTestId('manage-sessions')).toBeInTheDocument();
      expect(screen.getByTestId('export-data')).toBeInTheDocument();
    });
  });

  describe('Data Protection Center', () => {
    it('should render data protection interface', () => {
      const mockOnDataAction = vi.fn();
      
      render(
        <MockDataProtectionCenter 
          dataUsage={mockDataUsage}
          onDataAction={mockOnDataAction}
        />
      );
      
      expect(screen.getByTestId('data-protection-center')).toBeInTheDocument();
      expect(screen.getByText('Data Protection Nexus')).toBeInTheDocument();
    });
    
    it('should display data usage overview', () => {
      const mockOnDataAction = vi.fn();
      
      render(
        <MockDataProtectionCenter 
          dataUsage={mockDataUsage}
          onDataAction={mockOnDataAction}
        />
      );
      
      expect(screen.getByTestId('total-data-size')).toHaveTextContent('Total Data: 2.7 GB');
      expect(screen.getByTestId('personal-data-points')).toHaveTextContent('Personal Data Points: 1247');
      expect(screen.getByTestId('tracking-cookies')).toHaveTextContent('Tracking Cookies: 23');
      expect(screen.getByTestId('third-party-shares')).toHaveTextContent('Shared with Partners: 5');
    });
    
    it('should show data categories with details', () => {
      const mockOnDataAction = vi.fn();
      
      render(
        <MockDataProtectionCenter 
          dataUsage={mockDataUsage}
          onDataAction={mockOnDataAction}
        />
      );
      
      const category1 = screen.getByTestId('data-category-0');
      expect(category1).toHaveTextContent('Profile Data');
      expect(screen.getByTestId('category-size-0')).toHaveTextContent('145 MB');
      expect(screen.getByTestId('category-items-0')).toHaveTextContent('Items: 47');
      expect(screen.getByTestId('category-encrypted-0')).toHaveTextContent('Encrypted: Yes');
    });
    
    it('should handle data category actions', async () => {
      const user = userEvent.setup();
      const mockOnDataAction = vi.fn();
      
      render(
        <MockDataProtectionCenter 
          dataUsage={mockDataUsage}
          onDataAction={mockOnDataAction}
        />
      );
      
      await user.click(screen.getByTestId('download-category-0'));
      expect(mockOnDataAction).toHaveBeenCalledWith('cat-001', 'download');
      
      await user.click(screen.getByTestId('delete-category-1'));
      expect(mockOnDataAction).toHaveBeenCalledWith('cat-002', 'delete');
    });
    
    it('should provide GDPR compliance controls', async () => {
      const user = userEvent.setup();
      const mockOnDataAction = vi.fn();
      
      render(
        <MockDataProtectionCenter 
          dataUsage={mockDataUsage}
          onDataAction={mockOnDataAction}
        />
      );
      
      await user.click(screen.getByTestId('export-all-data'));
      expect(mockOnDataAction).toHaveBeenCalledWith('all', 'export');
      
      await user.click(screen.getByTestId('data-portability'));
      expect(mockOnDataAction).toHaveBeenCalledWith('all', 'portability');
      
      await user.click(screen.getByTestId('object-processing'));
      expect(mockOnDataAction).toHaveBeenCalledWith('processing', 'object');
    });
    
    it('should display consent management', () => {
      const mockOnDataAction = vi.fn();
      
      render(
        <MockDataProtectionCenter 
          dataUsage={mockDataUsage}
          onDataAction={mockOnDataAction}
        />
      );
      
      const consentHistory = screen.getByTestId('consent-history');
      expect(consentHistory).toHaveTextContent('Marketing Consent: Withdrawn');
      expect(consentHistory).toHaveTextContent('Analytics Consent: Withdrawn');
      expect(consentHistory).toHaveTextContent('Functional Consent: Given');
    });
  });

  describe('Encryption Manager', () => {
    it('should render encryption manager interface', () => {
      const mockOnEncryptionAction = vi.fn();
      
      render(
        <MockEncryptionManager 
          encryptionStatus={mockEncryptionStatus}
          onEncryptionAction={mockOnEncryptionAction}
        />
      );
      
      expect(screen.getByTestId('encryption-manager')).toBeInTheDocument();
      expect(screen.getByText('Quantum Encryption Core')).toBeInTheDocument();
    });
    
    it('should display encryption status', () => {
      const mockOnEncryptionAction = vi.fn();
      
      render(
        <MockEncryptionManager 
          encryptionStatus={mockEncryptionStatus}
          onEncryptionAction={mockOnEncryptionAction}
        />
      );
      
      expect(screen.getByTestId('encryption-level')).toHaveTextContent('Encryption Level: Military Grade');
      expect(screen.getByTestId('key-strength')).toHaveTextContent('Key Strength: 256 bit');
      expect(screen.getByTestId('algorithm')).toHaveTextContent('Algorithm: AES-256-GCM');
      expect(screen.getByTestId('last-key-rotation')).toHaveTextContent('Last Key Rotation: 7 days ago');
    });
    
    it('should show encrypted files', () => {
      const mockOnEncryptionAction = vi.fn();
      
      render(
        <MockEncryptionManager 
          encryptionStatus={mockEncryptionStatus}
          onEncryptionAction={mockOnEncryptionAction}
        />
      );
      
      expect(screen.getByTestId('file-name-0')).toHaveTextContent('neural-beats-collection.wav');
      expect(screen.getByTestId('file-size-0')).toHaveTextContent('45.7 MB');
      expect(screen.getByTestId('file-encryption-0')).toHaveTextContent('Encryption: AES-256 Encrypted');
    });
    
    it('should handle encryption actions', async () => {
      const user = userEvent.setup();
      const mockOnEncryptionAction = vi.fn();
      
      render(
        <MockEncryptionManager 
          encryptionStatus={mockEncryptionStatus}
          onEncryptionAction={mockOnEncryptionAction}
        />
      );
      
      await user.click(screen.getByTestId('decrypt-file-0'));
      expect(mockOnEncryptionAction).toHaveBeenCalledWith('file-001', 'decrypt');
      
      await user.click(screen.getByTestId('generate-new-key'));
      expect(mockOnEncryptionAction).toHaveBeenCalledWith('keys', 'generate');
      
      await user.click(screen.getByTestId('rotate-keys'));
      expect(mockOnEncryptionAction).toHaveBeenCalledWith('keys', 'rotate');
    });
    
    it('should display zero-knowledge features', () => {
      const mockOnEncryptionAction = vi.fn();
      
      render(
        <MockEncryptionManager 
          encryptionStatus={mockEncryptionStatus}
          onEncryptionAction={mockOnEncryptionAction}
        />
      );
      
      expect(screen.getByTestId('client-side-encryption')).toHaveTextContent('Client-Side Encryption: Enabled');
      expect(screen.getByTestId('server-blind')).toHaveTextContent('Server Blind: Yes');
      expect(screen.getByTestId('end-to-end')).toHaveTextContent('End-to-End: Active');
    });
  });

  describe('Security Implementation', () => {
    it('should implement Web Crypto API encryption', async () => {
      const data = new TextEncoder().encode('sensitive data');
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      
      expect(crypto.subtle.generateKey).toHaveBeenCalled();
      expect(key.type).toBe('secret');
    });
    
    it('should generate secure random values', () => {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      
      expect(crypto.getRandomValues).toHaveBeenCalledWith(array);
      
      // Check that values were modified (not all zeros)
      const hasNonZero = Array.from(array).some(val => val !== 0);
      expect(hasNonZero).toBe(true);
    });
    
    it('should detect security threats', () => {
      const securityAnalyzer = {
        analyzeLoginAttempt: (ip: string, userAgent: string, location: string) => {
          const suspiciousIps = ['192.168.1.100', '10.0.0.1'];
          const suspiciousLocations = ['Unknown', 'VPN'];
          
          const isSuspiciousIp = suspiciousIps.includes(ip);
          const isSuspiciousLocation = suspiciousLocations.includes(location);
          
          return {
            threat_level: isSuspiciousIp || isSuspiciousLocation ? 'medium' : 'low',
            requires_2fa: isSuspiciousIp || isSuspiciousLocation,
            block_attempt: isSuspiciousIp && isSuspiciousLocation
          };
        }
      };
      
      const analysis1 = securityAnalyzer.analyzeLoginAttempt('192.168.1.100', 'Chrome/96.0', 'Unknown');
      const analysis2 = securityAnalyzer.analyzeLoginAttempt('203.0.113.1', 'Chrome/96.0', 'New York');
      
      expect(analysis1.threat_level).toBe('medium');
      expect(analysis1.block_attempt).toBe(true);
      expect(analysis2.threat_level).toBe('low');
      expect(analysis2.block_attempt).toBe(false);
    });
    
    it('should implement privacy-preserving analytics', () => {
      const privacyAnalytics = {
        hashUserId: (userId: string) => {
          // Simulate SHA-256 hash
          return `hashed_${userId.split('').reverse().join('')}`;
        },
        
        aggregateData: (events: any[]) => {
          // Remove personally identifiable information
          return events.map(event => ({
            event_type: event.type,
            timestamp: Math.floor(event.timestamp / 3600000) * 3600000, // Round to hour
            category: event.category,
            // Remove specific user data
            user_id: undefined,
            ip_address: undefined
          }));
        }
      };
      
      const events = [
        { type: 'content_view', timestamp: 1640995200000, category: 'music', user_id: 'user-123', ip: '192.168.1.1' },
        { type: 'content_like', timestamp: 1640998800000, category: 'art', user_id: 'user-456', ip: '192.168.1.2' }
      ];
      
      const hashedId = privacyAnalytics.hashUserId('user-123');
      const aggregated = privacyAnalytics.aggregateData(events);
      
      expect(hashedId).toBe('hashed_321-resu');
      expect(aggregated[0].user_id).toBeUndefined();
      expect(aggregated[0].ip_address).toBeUndefined();
      expect(aggregated[0].event_type).toBe('content_view');
    });
    
    it('should validate security configurations', () => {
      const securityValidator = {
        validatePasswordStrength: (password: string) => {
          const minLength = password.length >= 12;
          const hasUppercase = /[A-Z]/.test(password);
          const hasLowercase = /[a-z]/.test(password);
          const hasNumbers = /\d/.test(password);
          const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          
          const score = [minLength, hasUppercase, hasLowercase, hasNumbers, hasSpecialChars].filter(Boolean).length;
          
          return {
            score: score * 20,
            strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong',
            recommendations: [
              !minLength && 'Use at least 12 characters',
              !hasUppercase && 'Include uppercase letters',
              !hasNumbers && 'Include numbers',
              !hasSpecialChars && 'Include special characters'
            ].filter(Boolean)
          };
        }
      };
      
      const weakPassword = securityValidator.validatePasswordStrength('password');
      const strongPassword = securityValidator.validatePasswordStrength('MyStr0ng!P@ssw0rd123');
      
      expect(weakPassword.strength).toBe('weak');
      expect(weakPassword.score).toBeLessThan(60);
      expect(strongPassword.strength).toBe('strong');
      expect(strongPassword.score).toBe(100);
    });
  });
});
