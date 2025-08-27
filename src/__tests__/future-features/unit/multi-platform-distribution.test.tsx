// Multi-Platform Content Distribution Tests
// Testing cross-platform publishing, syndication, and content optimization

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { futureUsers } from '../../../../tests/fixtures/future-users';
import { marketplaceData } from '../../../../tests/fixtures/marketplace-data';

// Mock Multi-Platform Distribution Components
const MockDistributionHub = ({ user, platforms, onDistribute }: any) => (
  <div data-testid="distribution-hub">
    <h2>OmniNet Distribution Hub</h2>
    <div data-testid="creator-info">{user.profile.display_name}</div>
    
    {/* Content Selection */}
    <div data-testid="content-selection">
      <select data-testid="content-select">
        <option value="track-001">Neural Beat Symphony #1</option>
        <option value="art-001">Cyberpunk Dreamscape</option>
        <option value="video-001">VR Creation Process</option>
      </select>
      
      <div data-testid="content-preview">
        <div>Type: Music Track</div>
        <div>Duration: 4:23</div>
        <div>Size: 45.2 MB</div>
        <div>Format: WAV/MP3</div>
      </div>
    </div>
    
    {/* Platform Selection Grid */}
    <div data-testid="platform-grid">
      <h3>Distribution Platforms</h3>
      {platforms.map((platform: any, index: number) => (
        <div key={index} data-testid={`platform-${platform.id}`} className="platform-card">
          <div className="platform-header">
            <h4>{platform.name}</h4>
            <div data-testid={`status-${platform.id}`}>
              Status: {platform.connected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          
          <div className="platform-details">
            <div>Reach: {platform.reach.toLocaleString()} users</div>
            <div>Revenue Share: {platform.revenue_share}%</div>
            <div>Avg Upload Time: {platform.avg_upload_time}</div>
          </div>
          
          <div className="optimization-settings">
            <label>
              <input 
                type="checkbox" 
                data-testid={`auto-optimize-${platform.id}`}
                defaultChecked={platform.auto_optimize}
              />
              Auto-optimize for {platform.name}
            </label>
            
            <label>
              <input 
                type="checkbox" 
                data-testid={`schedule-${platform.id}`}
                defaultChecked={platform.scheduled}
              />
              Schedule for optimal time
            </label>
          </div>
          
          <button 
            onClick={() => onDistribute(platform.id, 'track-001')}
            data-testid={`distribute-${platform.id}`}
            disabled={!platform.connected}
          >
            Distribute to {platform.name}
          </button>
        </div>
      ))}
    </div>
    
    {/* Bulk Actions */}
    <div data-testid="bulk-actions">
      <button 
        onClick={() => onDistribute('all', 'track-001')}
        data-testid="distribute-all"
      >
        Distribute to All Platforms
      </button>
      
      <button data-testid="schedule-distribution">Schedule Distribution</button>
      <button data-testid="create-campaign">Create Campaign</button>
    </div>
  </div>
);

const MockContentOptimizer = ({ content, platform, onOptimize }: any) => (
  <div data-testid="content-optimizer">
    <h2>Neural Content Optimizer</h2>
    
    {/* Platform-Specific Settings */}
    <div data-testid="platform-settings">
      <h3>Optimizing for: {platform.name}</h3>
      <div data-testid="platform-specs">
        <div>Max File Size: {platform.max_file_size} MB</div>
        <div>Supported Formats: {platform.supported_formats.join(', ')}</div>
        <div>Recommended Resolution: {platform.recommended_resolution}</div>
        <div>Audio Bitrate: {platform.audio_bitrate} kbps</div>
      </div>
    </div>
    
    {/* Original Content Info */}
    <div data-testid="original-content">
      <h3>Original Content</h3>
      <div>Title: {content.title}</div>
      <div>Size: {content.size} MB</div>
      <div>Format: {content.format}</div>
      <div>Quality: {content.quality}</div>
    </div>
    
    {/* Optimization Options */}
    <div data-testid="optimization-options">
      <h3>Optimization Settings</h3>
      
      <div data-testid="quality-settings">
        <label>Quality Level:</label>
        <select data-testid="quality-select">
          <option value="high">High Quality (Large File)</option>
          <option value="medium">Medium Quality (Balanced)</option>
          <option value="low">Low Quality (Small File)</option>
          <option value="auto">Auto-optimize for Platform</option>
        </select>
      </div>
      
      <div data-testid="metadata-settings">
        <input 
          type="text" 
          placeholder="Platform-specific title"
          data-testid="optimized-title"
          defaultValue={content.title}
        />
        
        <textarea 
          placeholder="Platform-specific description"
          data-testid="optimized-description"
          defaultValue={content.description}
        />
        
        <input 
          type="text" 
          placeholder="Platform-specific tags"
          data-testid="optimized-tags"
          defaultValue={content.tags?.join(', ')}
        />
      </div>
      
      <div data-testid="thumbnail-settings">
        <label>Thumbnail Generation:</label>
        <select data-testid="thumbnail-select">
          <option value="auto">Auto-generate</option>
          <option value="custom">Upload Custom</option>
          <option value="none">No Thumbnail</option>
        </select>
      </div>
    </div>
    
    {/* Preview */}
    <div data-testid="optimization-preview">
      <h3>Optimization Preview</h3>
      <div data-testid="estimated-size">Estimated Size: 23.4 MB (-48%)</div>
      <div data-testid="estimated-quality">Quality Score: 87/100</div>
      <div data-testid="platform-compatibility">Platform Compatibility: 98%</div>
    </div>
    
    <button 
      onClick={() => onOptimize(content.id, platform.id)}
      data-testid="start-optimization"
    >
      Start Optimization
    </button>
  </div>
);

const MockCrossPlatformAnalytics = ({ analytics, onPlatformSelect }: any) => (
  <div data-testid="cross-platform-analytics">
    <h2>OmniNet Performance Matrix</h2>
    
    {/* Overall Performance */}
    <div data-testid="overall-performance">
      <div data-testid="total-reach">Total Reach: {analytics.total_reach.toLocaleString()}</div>
      <div data-testid="total-engagement">Total Engagement: {analytics.total_engagement.toLocaleString()}</div>
      <div data-testid="total-revenue">Total Revenue: ${analytics.total_revenue.toLocaleString()}</div>
      <div data-testid="avg-performance">Avg Performance Score: {analytics.avg_performance_score}/100</div>
    </div>
    
    {/* Platform Breakdown */}
    <div data-testid="platform-breakdown">
      <h3>Platform Performance</h3>
      {analytics.platforms.map((platform: any, index: number) => (
        <div 
          key={index} 
          data-testid={`platform-analytics-${platform.id}`}
          className="platform-analytics-card"
          onClick={() => onPlatformSelect(platform.id)}
        >
          <h4>{platform.name}</h4>
          
          <div className="metrics-grid">
            <div data-testid={`${platform.id}-views`}>Views: {platform.views.toLocaleString()}</div>
            <div data-testid={`${platform.id}-engagement`}>Engagement: {platform.engagement_rate}%</div>
            <div data-testid={`${platform.id}-revenue`}>Revenue: ${platform.revenue}</div>
            <div data-testid={`${platform.id}-ctr`}>CTR: {platform.click_through_rate}%</div>
          </div>
          
          <div className="performance-indicators">
            <div data-testid={`${platform.id}-growth`}>Growth: +{platform.growth_rate}%</div>
            <div data-testid={`${platform.id}-roi`}>ROI: {platform.roi}x</div>
            <div data-testid={`${platform.id}-score`}>Score: {platform.performance_score}/100</div>
          </div>
          
          <div className="trend-indicator">
            Trend: {platform.trend === 'up' ? '📈' : platform.trend === 'down' ? '📉' : '➡️'}
          </div>
        </div>
      ))}
    </div>
    
    {/* Cross-Platform Insights */}
    <div data-testid="cross-platform-insights">
      <h3>Multi-Platform Insights</h3>
      <div data-testid="best-performing">Best Platform: {analytics.best_performing_platform}</div>
      <div data-testid="highest-revenue">Highest Revenue: {analytics.highest_revenue_platform}</div>
      <div data-testid="fastest-growing">Fastest Growing: {analytics.fastest_growing_platform}</div>
      <div data-testid="optimal-timing">Optimal Post Time: {analytics.optimal_post_time}</div>
    </div>
  </div>
);

const MockSyndicationManager = ({ syndicationRules, onUpdateRule }: any) => (
  <div data-testid="syndication-manager">
    <h2>Content Syndication Matrix</h2>
    
    {/* Automated Rules */}
    <div data-testid="syndication-rules">
      <h3>Automation Rules</h3>
      {syndicationRules.map((rule: any, index: number) => (
        <div key={index} data-testid={`rule-${index}`} className="syndication-rule">
          <div className="rule-header">
            <h4>{rule.name}</h4>
            <div data-testid={`rule-status-${index}`}>
              {rule.active ? 'Active' : 'Inactive'}
            </div>
          </div>
          
          <div className="rule-conditions">
            <div>Trigger: {rule.trigger}</div>
            <div>Content Type: {rule.content_type}</div>
            <div>Target Platforms: {rule.target_platforms.join(', ')}</div>
            <div>Schedule: {rule.schedule}</div>
          </div>
          
          <div className="rule-actions">
            <div>Auto-optimize: {rule.auto_optimize ? 'Yes' : 'No'}</div>
            <div>Custom Metadata: {rule.custom_metadata ? 'Yes' : 'No'}</div>
            <div>Analytics Tracking: {rule.track_performance ? 'Yes' : 'No'}</div>
          </div>
          
          <button 
            onClick={() => onUpdateRule(index, !rule.active)}
            data-testid={`toggle-rule-${index}`}
          >
            {rule.active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ))}
    </div>
    
    {/* Create New Rule */}
    <div data-testid="create-rule">
      <h3>Create New Rule</h3>
      <input type="text" placeholder="Rule Name" data-testid="new-rule-name" />
      
      <select data-testid="new-rule-trigger">
        <option value="upload">On Content Upload</option>
        <option value="schedule">Scheduled</option>
        <option value="performance">Performance Threshold</option>
      </select>
      
      <button data-testid="create-rule-button">Create Rule</button>
    </div>
  </div>
);

describe('Multi-Platform Content Distribution', () => {
  const distributionUser = futureUsers.aiCreatorPro;
  
  const mockPlatforms = [
    {
      id: 'spotify',
      name: 'Spotify',
      connected: true,
      reach: 456000000,
      revenue_share: 70,
      avg_upload_time: '15 min',
      auto_optimize: true,
      scheduled: false,
      max_file_size: 100,
      supported_formats: ['MP3', 'FLAC', 'WAV'],
      recommended_resolution: 'N/A',
      audio_bitrate: 320
    },
    {
      id: 'youtube',
      name: 'YouTube',
      connected: true,
      reach: 2600000000,
      revenue_share: 55,
      avg_upload_time: '25 min',
      auto_optimize: false,
      scheduled: true,
      max_file_size: 256,
      supported_formats: ['MP4', 'MOV', 'AVI'],
      recommended_resolution: '1920x1080',
      audio_bitrate: 192
    },
    {
      id: 'instagram',
      name: 'Instagram',
      connected: false,
      reach: 1400000000,
      revenue_share: 45,
      avg_upload_time: '10 min',
      auto_optimize: true,
      scheduled: true,
      max_file_size: 15,
      supported_formats: ['MP4', 'JPG', 'PNG'],
      recommended_resolution: '1080x1080',
      audio_bitrate: 128
    }
  ];
  
  const mockContent = {
    id: 'track-001',
    title: 'Neural Beat Symphony #1',
    size: 45.2,
    format: 'WAV',
    quality: 'High',
    description: 'An AI-generated cyberpunk masterpiece',
    tags: ['synthwave', 'ai-generated', 'cyberpunk']
  };
  
  const mockAnalytics = {
    total_reach: 15347892,
    total_engagement: 1234567,
    total_revenue: 45678.90,
    avg_performance_score: 87.3,
    platforms: [
      {
        id: 'spotify',
        name: 'Spotify',
        views: 5647832,
        engagement_rate: 12.3,
        revenue: 23456.78,
        click_through_rate: 4.7,
        growth_rate: 18.9,
        roi: 3.2,
        performance_score: 89,
        trend: 'up'
      },
      {
        id: 'youtube',
        name: 'YouTube',
        views: 8934521,
        engagement_rate: 8.9,
        revenue: 19876.54,
        click_through_rate: 6.2,
        growth_rate: 23.4,
        roi: 2.8,
        performance_score: 92,
        trend: 'up'
      }
    ],
    best_performing_platform: 'YouTube',
    highest_revenue_platform: 'Spotify',
    fastest_growing_platform: 'YouTube',
    optimal_post_time: '21:00 UTC'
  };
  
  const mockSyndicationRules = [
    {
      name: 'Auto-distribute Music',
      active: true,
      trigger: 'upload',
      content_type: 'music',
      target_platforms: ['spotify', 'youtube', 'soundcloud'],
      schedule: 'immediate',
      auto_optimize: true,
      custom_metadata: true,
      track_performance: true
    },
    {
      name: 'Weekend Art Drop',
      active: false,
      trigger: 'schedule',
      content_type: 'art',
      target_platforms: ['instagram', 'twitter', 'deviantart'],
      schedule: 'saturdays 10am',
      auto_optimize: true,
      custom_metadata: false,
      track_performance: true
    }
  ];
  
  beforeEach(() => {
    // Mock platform APIs
    global.fetch = vi.fn();
    
    // Mock file processing for optimization
    global.FileReader = vi.fn().mockImplementation(() => ({
      readAsArrayBuffer: vi.fn(),
      readAsDataURL: vi.fn(),
      readAsText: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Distribution Hub', () => {
    it('should render distribution hub interface', () => {
      const mockOnDistribute = vi.fn();
      
      render(
        <MockDistributionHub 
          user={distributionUser}
          platforms={mockPlatforms}
          onDistribute={mockOnDistribute}
        />
      );
      
      expect(screen.getByTestId('distribution-hub')).toBeInTheDocument();
      expect(screen.getByText('OmniNet Distribution Hub')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Neural Beat Architect')).toBeInTheDocument();
    });
    
    it('should display platform information', () => {
      const mockOnDistribute = vi.fn();
      
      render(
        <MockDistributionHub 
          user={distributionUser}
          platforms={mockPlatforms}
          onDistribute={mockOnDistribute}
        />
      );
      
      const spotifyCard = screen.getByTestId('platform-spotify');
      expect(spotifyCard).toHaveTextContent('Spotify');
      expect(spotifyCard).toHaveTextContent('Status: Connected');
      expect(spotifyCard).toHaveTextContent('Reach: 456,000,000 users');
      expect(spotifyCard).toHaveTextContent('Revenue Share: 70%');
    });
    
    it('should handle individual platform distribution', async () => {
      const user = userEvent.setup();
      const mockOnDistribute = vi.fn();
      
      render(
        <MockDistributionHub 
          user={distributionUser}
          platforms={mockPlatforms}
          onDistribute={mockOnDistribute}
        />
      );
      
      const distributeButton = screen.getByTestId('distribute-spotify');
      await user.click(distributeButton);
      
      expect(mockOnDistribute).toHaveBeenCalledWith('spotify', 'track-001');
    });
    
    it('should handle bulk distribution', async () => {
      const user = userEvent.setup();
      const mockOnDistribute = vi.fn();
      
      render(
        <MockDistributionHub 
          user={distributionUser}
          platforms={mockPlatforms}
          onDistribute={mockOnDistribute}
        />
      );
      
      const distributeAllButton = screen.getByTestId('distribute-all');
      await user.click(distributeAllButton);
      
      expect(mockOnDistribute).toHaveBeenCalledWith('all', 'track-001');
    });
    
    it('should disable distribution for disconnected platforms', () => {
      const mockOnDistribute = vi.fn();
      
      render(
        <MockDistributionHub 
          user={distributionUser}
          platforms={mockPlatforms}
          onDistribute={mockOnDistribute}
        />
      );
      
      const instagramStatus = screen.getByTestId('status-instagram');
      expect(instagramStatus).toHaveTextContent('Status: Disconnected');
      
      const instagramButton = screen.getByTestId('distribute-instagram');
      expect(instagramButton).toBeDisabled();
    });
  });

  describe('Content Optimizer', () => {
    const selectedPlatform = mockPlatforms[1]; // YouTube
    
    it('should render content optimizer interface', () => {
      const mockOnOptimize = vi.fn();
      
      render(
        <MockContentOptimizer 
          content={mockContent}
          platform={selectedPlatform}
          onOptimize={mockOnOptimize}
        />
      );
      
      expect(screen.getByTestId('content-optimizer')).toBeInTheDocument();
      expect(screen.getByText('Neural Content Optimizer')).toBeInTheDocument();
    });
    
    it('should display platform-specific settings', () => {
      const mockOnOptimize = vi.fn();
      
      render(
        <MockContentOptimizer 
          content={mockContent}
          platform={selectedPlatform}
          onOptimize={mockOnOptimize}
        />
      );
      
      const platformSpecs = screen.getByTestId('platform-specs');
      expect(platformSpecs).toHaveTextContent('Max File Size: 256 MB');
      expect(platformSpecs).toHaveTextContent('Supported Formats: MP4, MOV, AVI');
      expect(platformSpecs).toHaveTextContent('Recommended Resolution: 1920x1080');
      expect(platformSpecs).toHaveTextContent('Audio Bitrate: 192 kbps');
    });
    
    it('should show original content information', () => {
      const mockOnOptimize = vi.fn();
      
      render(
        <MockContentOptimizer 
          content={mockContent}
          platform={selectedPlatform}
          onOptimize={mockOnOptimize}
        />
      );
      
      const originalContent = screen.getByTestId('original-content');
      expect(originalContent).toHaveTextContent(`Title: ${mockContent.title}`);
      expect(originalContent).toHaveTextContent(`Size: ${mockContent.size} MB`);
      expect(originalContent).toHaveTextContent(`Format: ${mockContent.format}`);
      expect(originalContent).toHaveTextContent(`Quality: ${mockContent.quality}`);
    });
    
    it('should provide optimization settings', async () => {
      const user = userEvent.setup();
      const mockOnOptimize = vi.fn();
      
      render(
        <MockContentOptimizer 
          content={mockContent}
          platform={selectedPlatform}
          onOptimize={mockOnOptimize}
        />
      );
      
      const qualitySelect = screen.getByTestId('quality-select');
      await user.selectOptions(qualitySelect, 'auto');
      
      expect(qualitySelect).toHaveValue('auto');
    });
    
    it('should handle optimization process', async () => {
      const user = userEvent.setup();
      const mockOnOptimize = vi.fn();
      
      render(
        <MockContentOptimizer 
          content={mockContent}
          platform={selectedPlatform}
          onOptimize={mockOnOptimize}
        />
      );
      
      const optimizeButton = screen.getByTestId('start-optimization');
      await user.click(optimizeButton);
      
      expect(mockOnOptimize).toHaveBeenCalledWith(mockContent.id, selectedPlatform.id);
    });
    
    it('should show optimization preview', () => {
      const mockOnOptimize = vi.fn();
      
      render(
        <MockContentOptimizer 
          content={mockContent}
          platform={selectedPlatform}
          onOptimize={mockOnOptimize}
        />
      );
      
      const preview = screen.getByTestId('optimization-preview');
      expect(preview).toHaveTextContent('Estimated Size: 23.4 MB (-48%)');
      expect(preview).toHaveTextContent('Quality Score: 87/100');
      expect(preview).toHaveTextContent('Platform Compatibility: 98%');
    });
  });

  describe('Cross-Platform Analytics', () => {
    it('should render cross-platform analytics interface', () => {
      const mockOnPlatformSelect = vi.fn();
      
      render(
        <MockCrossPlatformAnalytics 
          analytics={mockAnalytics}
          onPlatformSelect={mockOnPlatformSelect}
        />
      );
      
      expect(screen.getByTestId('cross-platform-analytics')).toBeInTheDocument();
      expect(screen.getByText('OmniNet Performance Matrix')).toBeInTheDocument();
    });
    
    it('should display overall performance metrics', () => {
      const mockOnPlatformSelect = vi.fn();
      
      render(
        <MockCrossPlatformAnalytics 
          analytics={mockAnalytics}
          onPlatformSelect={mockOnPlatformSelect}
        />
      );
      
      expect(screen.getByTestId('total-reach')).toHaveTextContent('Total Reach: 15,347,892');
      expect(screen.getByTestId('total-engagement')).toHaveTextContent('Total Engagement: 1,234,567');
      expect(screen.getByTestId('total-revenue')).toHaveTextContent('Total Revenue: $45,679');
      expect(screen.getByTestId('avg-performance')).toHaveTextContent('Avg Performance Score: 87.3/100');
    });
    
    it('should show platform-specific analytics', () => {
      const mockOnPlatformSelect = vi.fn();
      
      render(
        <MockCrossPlatformAnalytics 
          analytics={mockAnalytics}
          onPlatformSelect={mockOnPlatformSelect}
        />
      );
      
      const spotifyAnalytics = screen.getByTestId('platform-analytics-spotify');
      expect(spotifyAnalytics).toHaveTextContent('Views: 5,647,832');
      expect(spotifyAnalytics).toHaveTextContent('Engagement: 12.3%');
      expect(spotifyAnalytics).toHaveTextContent('Revenue: $23456.78');
      expect(spotifyAnalytics).toHaveTextContent('Growth: +18.9%');
    });
    
    it('should handle platform selection', async () => {
      const user = userEvent.setup();
      const mockOnPlatformSelect = vi.fn();
      
      render(
        <MockCrossPlatformAnalytics 
          analytics={mockAnalytics}
          onPlatformSelect={mockOnPlatformSelect}
        />
      );
      
      const spotifyCard = screen.getByTestId('platform-analytics-spotify');
      await user.click(spotifyCard);
      
      expect(mockOnPlatformSelect).toHaveBeenCalledWith('spotify');
    });
    
    it('should display cross-platform insights', () => {
      const mockOnPlatformSelect = vi.fn();
      
      render(
        <MockCrossPlatformAnalytics 
          analytics={mockAnalytics}
          onPlatformSelect={mockOnPlatformSelect}
        />
      );
      
      const insights = screen.getByTestId('cross-platform-insights');
      expect(insights).toHaveTextContent('Best Platform: YouTube');
      expect(insights).toHaveTextContent('Highest Revenue: Spotify');
      expect(insights).toHaveTextContent('Fastest Growing: YouTube');
      expect(insights).toHaveTextContent('Optimal Post Time: 21:00 UTC');
    });
  });

  describe('Syndication Manager', () => {
    it('should render syndication manager interface', () => {
      const mockOnUpdateRule = vi.fn();
      
      render(
        <MockSyndicationManager 
          syndicationRules={mockSyndicationRules}
          onUpdateRule={mockOnUpdateRule}
        />
      );
      
      expect(screen.getByTestId('syndication-manager')).toBeInTheDocument();
      expect(screen.getByText('Content Syndication Matrix')).toBeInTheDocument();
    });
    
    it('should display syndication rules', () => {
      const mockOnUpdateRule = vi.fn();
      
      render(
        <MockSyndicationManager 
          syndicationRules={mockSyndicationRules}
          onUpdateRule={mockOnUpdateRule}
        />
      );
      
      const rule1 = screen.getByTestId('rule-0');
      expect(rule1).toHaveTextContent('Auto-distribute Music');
      expect(rule1).toHaveTextContent('Trigger: upload');
      expect(rule1).toHaveTextContent('Content Type: music');
      expect(rule1).toHaveTextContent('Target Platforms: spotify, youtube, soundcloud');
      
      expect(screen.getByTestId('rule-status-0')).toHaveTextContent('Active');
    });
    
    it('should handle rule activation/deactivation', async () => {
      const user = userEvent.setup();
      const mockOnUpdateRule = vi.fn();
      
      render(
        <MockSyndicationManager 
          syndicationRules={mockSyndicationRules}
          onUpdateRule={mockOnUpdateRule}
        />
      );
      
      const toggleButton = screen.getByTestId('toggle-rule-1');
      expect(toggleButton).toHaveTextContent('Activate'); // Rule 1 is inactive
      
      await user.click(toggleButton);
      expect(mockOnUpdateRule).toHaveBeenCalledWith(1, true);
    });
  });

  describe('Platform Integration', () => {
    it('should handle platform API authentication', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'mock-token-123',
          platform: 'spotify',
          expires_in: 3600
        })
      });
      
      global.fetch = mockFetch;
      
      const authResponse = await fetch('/api/platforms/spotify/auth', {
        method: 'POST',
        body: JSON.stringify({ code: 'auth-code-123' })
      });
      
      const authData = await authResponse.json();
      
      expect(authData.access_token).toBe('mock-token-123');
      expect(authData.platform).toBe('spotify');
    });
    
    it('should optimize content for different platforms', () => {
      const optimizations = {
        youtube: {
          video_codec: 'h264',
          audio_codec: 'aac',
          max_bitrate: 8000,
          aspect_ratio: '16:9'
        },
        instagram: {
          video_codec: 'h264',
          audio_codec: 'aac', 
          max_bitrate: 3000,
          aspect_ratio: '1:1'
        },
        tiktok: {
          video_codec: 'h264',
          audio_codec: 'aac',
          max_bitrate: 2000,
          aspect_ratio: '9:16'
        }
      };
      
      Object.entries(optimizations).forEach(([platform, settings]) => {
        expect(settings.video_codec).toBe('h264');
        expect(settings.audio_codec).toBe('aac');
        expect(settings.max_bitrate).toBeGreaterThan(1000);
      });
    });
    
    it('should track distribution performance', () => {
      const distributionMetrics = {
        content_id: 'track-001',
        distributions: [
          {
            platform: 'spotify',
            status: 'success',
            upload_time: 847, // seconds
            reach: 156723,
            engagement: 12847
          },
          {
            platform: 'youtube',
            status: 'success', 
            upload_time: 1523, // seconds
            reach: 287456,
            engagement: 23456
          },
          {
            platform: 'instagram',
            status: 'failed',
            error: 'File size too large',
            retry_count: 2
          }
        ]
      };
      
      const successfulDistributions = distributionMetrics.distributions.filter(d => d.status === 'success');
      const totalReach = successfulDistributions.reduce((sum, d) => sum + (d.reach || 0), 0);
      const avgUploadTime = successfulDistributions.reduce((sum, d) => sum + (d.upload_time || 0), 0) / successfulDistributions.length;
      
      expect(successfulDistributions).toHaveLength(2);
      expect(totalReach).toBe(444179);
      expect(avgUploadTime).toBe(1185);
    });
  });
});
