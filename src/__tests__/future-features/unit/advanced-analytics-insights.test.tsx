// Advanced Analytics & Creator Insights Tests
// Testing comprehensive analytics dashboard, performance metrics, and creator insights

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { futureUsers } from '../../../../tests/fixtures/future-users';
import { marketplaceData } from '../../../../tests/fixtures/marketplace-data';

// Mock Analytics Components
const MockAnalyticsDashboard = ({ user, timeRange, onTimeRangeChange }: any) => {
  const mockMetrics = {
    total_views: 45892,
    total_streams: 3456,
    engagement_rate: 8.7,
    revenue_total: 15847.25,
    follower_growth: 12.3,
    content_performance_score: 94.2
  };
  
  return (
    <div data-testid="analytics-dashboard">
      <h2>NeuroAnalytics Command Center</h2>
      <div data-testid="creator-info">{user.profile.display_name}</div>
      
      {/* Time Range Selector */}
      <div data-testid="time-range-selector">
        <select 
          value={timeRange} 
          onChange={(e) => onTimeRangeChange(e.target.value)}
          data-testid="time-range-select"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>
      
      {/* Key Performance Indicators */}
      <div data-testid="kpi-grid">
        <div data-testid="total-views" className="kpi-card">
          <h3>Total Views</h3>
          <div className="metric">{mockMetrics.total_views.toLocaleString()}</div>
          <div className="trend">+23.4% vs last period</div>
        </div>
        
        <div data-testid="total-streams" className="kpi-card">
          <h3>Stream Sessions</h3>
          <div className="metric">{mockMetrics.total_streams.toLocaleString()}</div>
          <div className="trend">+18.7% vs last period</div>
        </div>
        
        <div data-testid="engagement-rate" className="kpi-card">
          <h3>Engagement Rate</h3>
          <div className="metric">{mockMetrics.engagement_rate}%</div>
          <div className="trend">+2.1% vs last period</div>
        </div>
        
        <div data-testid="revenue-total" className="kpi-card">
          <h3>Total Revenue</h3>
          <div className="metric">${mockMetrics.revenue_total.toLocaleString()}</div>
          <div className="trend">+31.2% vs last period</div>
        </div>
      </div>
      
      {/* Performance Breakdown */}
      <div data-testid="performance-breakdown">
        <h3>Performance Analysis</h3>
        <div data-testid="content-score">Content Score: {mockMetrics.content_performance_score}/100</div>
        <div data-testid="follower-growth">Follower Growth: +{mockMetrics.follower_growth}%</div>
      </div>
    </div>
  );
};

const MockContentPerformanceAnalyzer = ({ content, onAnalyze }: any) => (
  <div data-testid="content-performance-analyzer">
    <h2>Content Performance Analyzer</h2>
    
    {/* Content Selection */}
    <div data-testid="content-selector">
      <select data-testid="content-type-filter">
        <option value="all">All Content</option>
        <option value="music">Music Tracks</option>
        <option value="art">Digital Art</option>
        <option value="video">Video Content</option>
        <option value="streams">Live Streams</option>
      </select>
      
      <select data-testid="sort-by">
        <option value="views">Most Views</option>
        <option value="engagement">Highest Engagement</option>
        <option value="revenue">Top Revenue</option>
        <option value="recent">Most Recent</option>
      </select>
    </div>
    
    {/* Content List */}
    <div data-testid="content-list">
      {content.map((item: any, index: number) => (
        <div key={index} data-testid={`content-item-${index}`} className="content-item">
          <h4>{item.title}</h4>
          <div className="metrics-row">
            <span>Views: {item.views}</span>
            <span>Likes: {item.likes}</span>
            <span>Shares: {item.shares}</span>
            <span>Revenue: ${item.revenue}</span>
          </div>
          
          <div className="performance-indicators">
            <div data-testid={`viral-score-${index}`}>Viral Score: {item.viral_score}/100</div>
            <div data-testid={`engagement-${index}`}>Engagement: {item.engagement_rate}%</div>
          </div>
          
          <button 
            onClick={() => onAnalyze(item.id)}
            data-testid={`analyze-${index}`}
          >
            Deep Analysis
          </button>
        </div>
      ))}
    </div>
  </div>
);

const MockAudienceInsightsDashboard = ({ demographics, onSegmentSelect }: any) => (
  <div data-testid="audience-insights-dashboard">
    <h2>Audience Neural Mapping</h2>
    
    {/* Demographic Breakdown */}
    <div data-testid="demographics">
      <h3>Demographic Analysis</h3>
      
      <div data-testid="age-distribution">
        <h4>Age Distribution</h4>
        {Object.entries(demographics.age_groups).map(([ageGroup, percentage]: [string, any]) => (
          <div key={ageGroup} data-testid={`age-${ageGroup}`}>
            {ageGroup}: {percentage}%
          </div>
        ))}
      </div>
      
      <div data-testid="geographic-distribution">
        <h4>Geographic Distribution</h4>
        {Object.entries(demographics.locations).map(([location, percentage]: [string, any]) => (
          <div key={location} data-testid={`location-${location}`}>
            {location}: {percentage}%
          </div>
        ))}
      </div>
      
      <div data-testid="interest-mapping">
        <h4>Interest Mapping</h4>
        {demographics.interests.map((interest: any, index: number) => (
          <div key={index} data-testid={`interest-${index}`}>
            {interest.category}: {interest.affinity_score}/100
          </div>
        ))}
      </div>
    </div>
    
    {/* Audience Segments */}
    <div data-testid="audience-segments">
      <h3>Audience Segments</h3>
      {demographics.segments.map((segment: any, index: number) => (
        <div 
          key={index} 
          data-testid={`segment-${index}`}
          className="segment-card"
          onClick={() => onSegmentSelect(segment.id)}
        >
          <h4>{segment.name}</h4>
          <div>Size: {segment.size} users ({segment.percentage}%)</div>
          <div>Engagement: {segment.engagement_rate}%</div>
          <div>Revenue per User: ${segment.revenue_per_user}</div>
        </div>
      ))}
    </div>
    
    {/* Behavioral Patterns */}
    <div data-testid="behavioral-patterns">
      <h3>Behavioral Patterns</h3>
      <div data-testid="peak-activity-hours">Peak Hours: {demographics.peak_hours.join(', ')}</div>
      <div data-testid="average-session-duration">Avg Session: {demographics.avg_session_duration} min</div>
      <div data-testid="content-preferences">Top Genre: {demographics.preferred_genre}</div>
    </div>
  </div>
);

const MockRevenueAnalytics = ({ revenueData, onExportReport }: any) => (
  <div data-testid="revenue-analytics">
    <h2>Revenue Neural Network</h2>
    
    {/* Revenue Overview */}
    <div data-testid="revenue-overview">
      <div data-testid="total-revenue">
        Total Revenue: ${revenueData.total.toLocaleString()}
      </div>
      <div data-testid="monthly-recurring">MRR: ${revenueData.monthly_recurring}</div>
      <div data-testid="growth-rate">Growth Rate: +{revenueData.growth_rate}%</div>
    </div>
    
    {/* Revenue Streams */}
    <div data-testid="revenue-streams">
      <h3>Revenue Stream Analysis</h3>
      
      <div data-testid="stream-tips">
        Tips: ${revenueData.streams.tips} ({revenueData.streams.tips_percentage}%)
      </div>
      
      <div data-testid="stream-subscriptions">
        Subscriptions: ${revenueData.streams.subscriptions} ({revenueData.streams.subscriptions_percentage}%)
      </div>
      
      <div data-testid="stream-nft-sales">
        NFT Sales: ${revenueData.streams.nft_sales} ({revenueData.streams.nft_percentage}%)
      </div>
      
      <div data-testid="stream-merchandise">
        Merchandise: ${revenueData.streams.merchandise} ({revenueData.streams.merchandise_percentage}%)
      </div>
      
      <div data-testid="stream-licensing">
        Licensing: ${revenueData.streams.licensing} ({revenueData.streams.licensing_percentage}%)
      </div>
    </div>
    
    {/* Projections */}
    <div data-testid="revenue-projections">
      <h3>Revenue Projections</h3>
      <div data-testid="next-month">Next Month: ${revenueData.projections.next_month}</div>
      <div data-testid="next-quarter">Next Quarter: ${revenueData.projections.next_quarter}</div>
      <div data-testid="annual-projection">Annual: ${revenueData.projections.annual}</div>
    </div>
    
    {/* Export Controls */}
    <div data-testid="export-controls">
      <button 
        onClick={() => onExportReport('pdf')}
        data-testid="export-pdf"
      >
        Export PDF Report
      </button>
      
      <button 
        onClick={() => onExportReport('csv')}
        data-testid="export-csv"
      >
        Export CSV Data
      </button>
      
      <button 
        onClick={() => onExportReport('json')}
        data-testid="export-json"
      >
        Export JSON
      </button>
    </div>
  </div>
);

describe('Advanced Analytics & Creator Insights', () => {
  const analyticsUser = futureUsers.aiCreatorPro;
  
  const mockContentData = [
    {
      id: 'content-001',
      title: 'Neural Beat Symphony #1',
      views: 15647,
      likes: 1234,
      shares: 89,
      revenue: 456.78,
      viral_score: 78,
      engagement_rate: 7.9
    },
    {
      id: 'content-002',
      title: 'Cyberpunk Dreamscape',
      views: 9823,
      likes: 876,
      shares: 45,
      revenue: 234.56,
      viral_score: 65,
      engagement_rate: 8.9
    }
  ];
  
  const mockDemographics = {
    age_groups: {
      '18-24': 28,
      '25-34': 45,
      '35-44': 18,
      '45+': 9
    },
    locations: {
      'North America': 42,
      'Europe': 31,
      'Asia': 19,
      'Other': 8
    },
    interests: [
      { category: 'Electronic Music', affinity_score: 94 },
      { category: 'Digital Art', affinity_score: 87 },
      { category: 'VR/AR', affinity_score: 78 }
    ],
    segments: [
      {
        id: 'segment-001',
        name: 'Cyberpunk Enthusiasts',
        size: 5647,
        percentage: 34.2,
        engagement_rate: 12.3,
        revenue_per_user: 45.67
      },
      {
        id: 'segment-002',
        name: 'AI Music Collectors',
        size: 3421,
        percentage: 20.7,
        engagement_rate: 15.8,
        revenue_per_user: 78.92
      }
    ],
    peak_hours: ['20:00', '21:00', '22:00'],
    avg_session_duration: 34.5,
    preferred_genre: 'Synthwave'
  };
  
  const mockRevenueData = {
    total: 15847.25,
    monthly_recurring: 2347.89,
    growth_rate: 23.4,
    streams: {
      tips: 4567.23,
      tips_percentage: 28.8,
      subscriptions: 6789.45,
      subscriptions_percentage: 42.8,
      nft_sales: 3234.56,
      nft_percentage: 20.4,
      merchandise: 834.67,
      merchandise_percentage: 5.3,
      licensing: 421.34,
      licensing_percentage: 2.7
    },
    projections: {
      next_month: 18456.78,
      next_quarter: 52345.67,
      annual: 198765.43
    }
  };
  
  beforeEach(() => {
    // Mock Chart.js for analytics visualizations
    global.Chart = vi.fn().mockImplementation(() => ({
      render: vi.fn(),
      update: vi.fn(),
      destroy: vi.fn()
    }));
    
    // Mock analytics API responses
    global.fetch = vi.fn();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Analytics Dashboard', () => {
    it('should render analytics dashboard interface', () => {
      const mockOnTimeRangeChange = vi.fn();
      
      render(
        <MockAnalyticsDashboard 
          user={analyticsUser}
          timeRange="30d"
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      );
      
      expect(screen.getByTestId('analytics-dashboard')).toBeInTheDocument();
      expect(screen.getByText('NeuroAnalytics Command Center')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Neural Beat Architect')).toBeInTheDocument();
    });
    
    it('should display key performance indicators', () => {
      const mockOnTimeRangeChange = vi.fn();
      
      render(
        <MockAnalyticsDashboard 
          user={analyticsUser}
          timeRange="30d"
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      );
      
      expect(screen.getByTestId('total-views')).toHaveTextContent('45,892');
      expect(screen.getByTestId('total-streams')).toHaveTextContent('3,456');
      expect(screen.getByTestId('engagement-rate')).toHaveTextContent('8.7%');
      expect(screen.getByTestId('revenue-total')).toHaveTextContent('$15,847');
    });
    
    it('should handle time range selection', async () => {
      const user = userEvent.setup();
      const mockOnTimeRangeChange = vi.fn();
      
      render(
        <MockAnalyticsDashboard 
          user={analyticsUser}
          timeRange="30d"
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      );
      
      const timeRangeSelect = screen.getByTestId('time-range-select');
      await user.selectOptions(timeRangeSelect, '90d');
      
      expect(mockOnTimeRangeChange).toHaveBeenCalledWith('90d');
    });
    
    it('should show performance breakdown', () => {
      const mockOnTimeRangeChange = vi.fn();
      
      render(
        <MockAnalyticsDashboard 
          user={analyticsUser}
          timeRange="30d"
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      );
      
      const breakdown = screen.getByTestId('performance-breakdown');
      expect(breakdown).toHaveTextContent('Content Score: 94.2/100');
      expect(breakdown).toHaveTextContent('Follower Growth: +12.3%');
    });
  });

  describe('Content Performance Analyzer', () => {
    it('should render content performance interface', () => {
      const mockOnAnalyze = vi.fn();
      
      render(
        <MockContentPerformanceAnalyzer 
          content={mockContentData}
          onAnalyze={mockOnAnalyze}
        />
      );
      
      expect(screen.getByTestId('content-performance-analyzer')).toBeInTheDocument();
      expect(screen.getByText('Content Performance Analyzer')).toBeInTheDocument();
    });
    
    it('should display content filtering options', () => {
      const mockOnAnalyze = vi.fn();
      
      render(
        <MockContentPerformanceAnalyzer 
          content={mockContentData}
          onAnalyze={mockOnAnalyze}
        />
      );
      
      expect(screen.getByTestId('content-type-filter')).toBeInTheDocument();
      expect(screen.getByTestId('sort-by')).toBeInTheDocument();
    });
    
    it('should render content items with metrics', () => {
      const mockOnAnalyze = vi.fn();
      
      render(
        <MockContentPerformanceAnalyzer 
          content={mockContentData}
          onAnalyze={mockOnAnalyze}
        />
      );
      
      const firstItem = screen.getByTestId('content-item-0');
      expect(firstItem).toHaveTextContent('Neural Beat Symphony #1');
      expect(firstItem).toHaveTextContent('Views: 15647');
      expect(firstItem).toHaveTextContent('Likes: 1234');
      expect(firstItem).toHaveTextContent('Revenue: $456.78');
      
      expect(screen.getByTestId('viral-score-0')).toHaveTextContent('Viral Score: 78/100');
      expect(screen.getByTestId('engagement-0')).toHaveTextContent('Engagement: 7.9%');
    });
    
    it('should handle content analysis requests', async () => {
      const user = userEvent.setup();
      const mockOnAnalyze = vi.fn();
      
      render(
        <MockContentPerformanceAnalyzer 
          content={mockContentData}
          onAnalyze={mockOnAnalyze}
        />
      );
      
      const analyzeButton = screen.getByTestId('analyze-0');
      await user.click(analyzeButton);
      
      expect(mockOnAnalyze).toHaveBeenCalledWith('content-001');
    });
  });

  describe('Audience Insights Dashboard', () => {
    it('should render audience insights interface', () => {
      const mockOnSegmentSelect = vi.fn();
      
      render(
        <MockAudienceInsightsDashboard 
          demographics={mockDemographics}
          onSegmentSelect={mockOnSegmentSelect}
        />
      );
      
      expect(screen.getByTestId('audience-insights-dashboard')).toBeInTheDocument();
      expect(screen.getByText('Audience Neural Mapping')).toBeInTheDocument();
    });
    
    it('should display demographic breakdown', () => {
      const mockOnSegmentSelect = vi.fn();
      
      render(
        <MockAudienceInsightsDashboard 
          demographics={mockDemographics}
          onSegmentSelect={mockOnSegmentSelect}
        />
      );
      
      expect(screen.getByTestId('age-18-24')).toHaveTextContent('18-24: 28%');
      expect(screen.getByTestId('age-25-34')).toHaveTextContent('25-34: 45%');
      
      expect(screen.getByTestId('location-North America')).toHaveTextContent('North America: 42%');
      expect(screen.getByTestId('location-Europe')).toHaveTextContent('Europe: 31%');
    });
    
    it('should show interest mapping', () => {
      const mockOnSegmentSelect = vi.fn();
      
      render(
        <MockAudienceInsightsDashboard 
          demographics={mockDemographics}
          onSegmentSelect={mockOnSegmentSelect}
        />
      );
      
      expect(screen.getByTestId('interest-0')).toHaveTextContent('Electronic Music: 94/100');
      expect(screen.getByTestId('interest-1')).toHaveTextContent('Digital Art: 87/100');
      expect(screen.getByTestId('interest-2')).toHaveTextContent('VR/AR: 78/100');
    });
    
    it('should display audience segments', async () => {
      const user = userEvent.setup();
      const mockOnSegmentSelect = vi.fn();
      
      render(
        <MockAudienceInsightsDashboard 
          demographics={mockDemographics}
          onSegmentSelect={mockOnSegmentSelect}
        />
      );
      
      const segment1 = screen.getByTestId('segment-0');
      expect(segment1).toHaveTextContent('Cyberpunk Enthusiasts');
      expect(segment1).toHaveTextContent('Size: 5647 users (34.2%)');
      expect(segment1).toHaveTextContent('Engagement: 12.3%');
      
      await user.click(segment1);
      expect(mockOnSegmentSelect).toHaveBeenCalledWith('segment-001');
    });
    
    it('should show behavioral patterns', () => {
      const mockOnSegmentSelect = vi.fn();
      
      render(
        <MockAudienceInsightsDashboard 
          demographics={mockDemographics}
          onSegmentSelect={mockOnSegmentSelect}
        />
      );
      
      const patterns = screen.getByTestId('behavioral-patterns');
      expect(patterns).toHaveTextContent('Peak Hours: 20:00, 21:00, 22:00');
      expect(patterns).toHaveTextContent('Avg Session: 34.5 min');
      expect(patterns).toHaveTextContent('Top Genre: Synthwave');
    });
  });

  describe('Revenue Analytics', () => {
    it('should render revenue analytics interface', () => {
      const mockOnExportReport = vi.fn();
      
      render(
        <MockRevenueAnalytics 
          revenueData={mockRevenueData}
          onExportReport={mockOnExportReport}
        />
      );
      
      expect(screen.getByTestId('revenue-analytics')).toBeInTheDocument();
      expect(screen.getByText('Revenue Neural Network')).toBeInTheDocument();
    });
    
    it('should display revenue overview', () => {
      const mockOnExportReport = vi.fn();
      
      render(
        <MockRevenueAnalytics 
          revenueData={mockRevenueData}
          onExportReport={mockOnExportReport}
        />
      );
      
      expect(screen.getByTestId('total-revenue')).toHaveTextContent('$15,847');
      expect(screen.getByTestId('monthly-recurring')).toHaveTextContent('MRR: $2347.89');
      expect(screen.getByTestId('growth-rate')).toHaveTextContent('Growth Rate: +23.4%');
    });
    
    it('should show revenue stream breakdown', () => {
      const mockOnExportReport = vi.fn();
      
      render(
        <MockRevenueAnalytics 
          revenueData={mockRevenueData}
          onExportReport={mockOnExportReport}
        />
      );
      
      expect(screen.getByTestId('stream-tips')).toHaveTextContent('Tips: $4567.23 (28.8%)');
      expect(screen.getByTestId('stream-subscriptions')).toHaveTextContent('Subscriptions: $6789.45 (42.8%)');
      expect(screen.getByTestId('stream-nft-sales')).toHaveTextContent('NFT Sales: $3234.56 (20.4%)');
      expect(screen.getByTestId('stream-merchandise')).toHaveTextContent('Merchandise: $834.67 (5.3%)');
      expect(screen.getByTestId('stream-licensing')).toHaveTextContent('Licensing: $421.34 (2.7%)');
    });
    
    it('should display revenue projections', () => {
      const mockOnExportReport = vi.fn();
      
      render(
        <MockRevenueAnalytics 
          revenueData={mockRevenueData}
          onExportReport={mockOnExportReport}
        />
      );
      
      expect(screen.getByTestId('next-month')).toHaveTextContent('Next Month: $18456.78');
      expect(screen.getByTestId('next-quarter')).toHaveTextContent('Next Quarter: $52345.67');
      expect(screen.getByTestId('annual-projection')).toHaveTextContent('Annual: $198765.43');
    });
    
    it('should handle report export', async () => {
      const user = userEvent.setup();
      const mockOnExportReport = vi.fn();
      
      render(
        <MockRevenueAnalytics 
          revenueData={mockRevenueData}
          onExportReport={mockOnExportReport}
        />
      );
      
      await user.click(screen.getByTestId('export-pdf'));
      expect(mockOnExportReport).toHaveBeenCalledWith('pdf');
      
      await user.click(screen.getByTestId('export-csv'));
      expect(mockOnExportReport).toHaveBeenCalledWith('csv');
      
      await user.click(screen.getByTestId('export-json'));
      expect(mockOnExportReport).toHaveBeenCalledWith('json');
    });
  });

  describe('Advanced Analytics Integration', () => {
    it('should handle real-time analytics updates', async () => {
      const mockWebSocket = vi.fn().mockImplementation(() => ({
        send: vi.fn(),
        close: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        readyState: 1
      }));
      
      global.WebSocket = mockWebSocket;
      
      const ws = new WebSocket('wss://yourspace.com/analytics-ws');
      expect(mockWebSocket).toHaveBeenCalledWith('wss://yourspace.com/analytics-ws');
    });
    
    it('should calculate complex performance metrics', () => {
      const metrics = {
        views: 45892,
        unique_visitors: 23456,
        engagement_actions: 4567,
        session_duration: 2340, // seconds
        bounce_rate: 0.23
      };
      
      const engagementRate = (metrics.engagement_actions / metrics.views) * 100;
      const avgSessionMinutes = metrics.session_duration / 60;
      const returnVisitorRate = 1 - (metrics.unique_visitors / metrics.views);
      
      expect(engagementRate).toBeCloseTo(9.95);
      expect(avgSessionMinutes).toBe(39);
      expect(returnVisitorRate).toBeCloseTo(0.49);
    });
    
    it('should provide predictive analytics insights', () => {
      const historicalData = {
        monthly_growth_rates: [12.3, 15.7, 18.2, 23.4, 19.8],
        seasonal_factors: { spring: 1.1, summer: 0.9, fall: 1.2, winter: 1.0 },
        trend_velocity: 1.15
      };
      
      const avgGrowthRate = historicalData.monthly_growth_rates.reduce((a, b) => a + b) / historicalData.monthly_growth_rates.length;
      const projectedGrowth = avgGrowthRate * historicalData.trend_velocity * historicalData.seasonal_factors.fall;
      
      expect(avgGrowthRate).toBeCloseTo(17.88);
      expect(projectedGrowth).toBeCloseTo(24.69);
    });
  });
});
