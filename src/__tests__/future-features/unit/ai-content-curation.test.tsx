// AI-Assisted Content Curation Tests
// Testing intelligent content discovery, recommendation algorithms, and curation tools

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { futureUsers } from '../../../../tests/fixtures/future-users';
import { marketplaceData } from '../../../../tests/fixtures/marketplace-data';

// Mock AI Curation Components
const MockAICurationDashboard = ({ user, onCurateContent, onUpdatePreferences }: any) => {
  const mockCuratedContent = [
    {
      id: 'curated-001',
      title: 'Emerging Synthwave Artists',
      type: 'playlist',
      content_count: 47,
      ai_confidence: 0.94,
      relevance_score: 87.3,
      engagement_prediction: 23.7
    },
    {
      id: 'curated-002',
      title: 'Cyberpunk Art Trends',
      type: 'collection',
      content_count: 23,
      ai_confidence: 0.89,
      relevance_score: 91.2,
      engagement_prediction: 31.2
    }
  ];
  
  return (
    <div data-testid="ai-curation-dashboard">
      <h2>Neural Curation Engine</h2>
      <div data-testid="curator-info">{user.profile.display_name}</div>
      
      {/* AI Curation Status */}
      <div data-testid="curation-status">
        <div data-testid="ai-status">AI Status: Active</div>
        <div data-testid="last-update">Last Update: 2 minutes ago</div>
        <div data-testid="processing-queue">Processing: 147 items</div>
        <div data-testid="confidence-level">Avg Confidence: 91.2%</div>
      </div>
      
      {/* Curation Categories */}
      <div data-testid="curation-categories">
        <h3>AI Curation Categories</h3>
        <div className="category-grid">
          <button data-testid="trending-content">Trending Content</button>
          <button data-testid="emerging-artists">Emerging Artists</button>
          <button data-testid="genre-evolution">Genre Evolution</button>
          <button data-testid="cross-genre-fusion">Cross-Genre Fusion</button>
          <button data-testid="viral-potential">Viral Potential</button>
          <button data-testid="niche-communities">Niche Communities</button>
        </div>
      </div>
      
      {/* Curated Collections */}
      <div data-testid="curated-collections">
        <h3>AI-Curated Collections</h3>
        {mockCuratedContent.map((collection, index) => (
          <div key={index} data-testid={`collection-${index}`} className="collection-card">
            <h4>{collection.title}</h4>
            <div className="collection-meta">
              <span>Type: {collection.type}</span>
              <span>Items: {collection.content_count}</span>
              <span>AI Confidence: {(collection.ai_confidence * 100).toFixed(1)}%</span>
            </div>
            
            <div className="collection-metrics">
              <div data-testid={`relevance-${index}`}>Relevance: {collection.relevance_score}/100</div>
              <div data-testid={`engagement-prediction-${index}`}>Predicted Engagement: +{collection.engagement_prediction}%</div>
            </div>
            
            <div className="collection-actions">
              <button 
                onClick={() => onCurateContent(collection.id, 'approve')}
                data-testid={`approve-${index}`}
              >
                Approve
              </button>
              <button 
                onClick={() => onCurateContent(collection.id, 'reject')}
                data-testid={`reject-${index}`}
              >
                Reject
              </button>
              <button 
                onClick={() => onCurateContent(collection.id, 'modify')}
                data-testid={`modify-${index}`}
              >
                Modify
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* AI Preferences */}
      <div data-testid="ai-preferences">
        <h3>Curation Preferences</h3>
        
        <div data-testid="discovery-settings">
          <label>Discovery Aggressiveness:</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="75"
            data-testid="discovery-slider"
          />
        </div>
        
        <div data-testid="genre-weights">
          <h4>Genre Weighting</h4>
          <div>Synthwave: <input type="number" defaultValue="30" data-testid="synthwave-weight" />%</div>
          <div>Cyberpunk: <input type="number" defaultValue="25" data-testid="cyberpunk-weight" />%</div>
          <div>Ambient: <input type="number" defaultValue="20" data-testid="ambient-weight" />%</div>
          <div>Experimental: <input type="number" defaultValue="25" data-testid="experimental-weight" />%</div>
        </div>
        
        <button 
          onClick={() => onUpdatePreferences({ discovery: 75, genres: { synthwave: 30, cyberpunk: 25 } })}
          data-testid="update-preferences"
        >
          Update Preferences
        </button>
      </div>
    </div>
  );
};

const MockContentRecommendationEngine = ({ content, userProfiles, onGenerateRecommendations }: any) => (
  <div data-testid="recommendation-engine">
    <h2>Neural Recommendation Matrix</h2>
    
    {/* Algorithm Selection */}
    <div data-testid="algorithm-selection">
      <h3>Recommendation Algorithm</h3>
      <select data-testid="algorithm-select">
        <option value="collaborative">Collaborative Filtering</option>
        <option value="content-based">Content-Based</option>
        <option value="hybrid">Hybrid Neural Network</option>
        <option value="deep-learning">Deep Learning</option>
      </select>
      
      <div data-testid="algorithm-params">
        <label>Learning Rate:</label>
        <input type="number" step="0.001" defaultValue="0.01" data-testid="learning-rate" />
        
        <label>Diversity Factor:</label>
        <input type="range" min="0" max="100" defaultValue="70" data-testid="diversity-factor" />
        
        <label>Novelty Weight:</label>
        <input type="range" min="0" max="100" defaultValue="40" data-testid="novelty-weight" />
      </div>
    </div>
    
    {/* Content Analysis */}
    <div data-testid="content-analysis">
      <h3>Content Vector Analysis</h3>
      {content.slice(0, 3).map((item: any, index: number) => (
        <div key={index} data-testid={`content-vector-${index}`} className="content-vector">
          <h4>{item.title}</h4>
          <div className="feature-vectors">
            <div>Genre Vector: [{item.genre_vector.join(', ')}]</div>
            <div>Mood Vector: [{item.mood_vector.join(', ')}]</div>
            <div>Tempo Vector: [{item.tempo_vector.join(', ')}]</div>
            <div>Popularity Score: {item.popularity_score}</div>
          </div>
          
          <div className="similarity-scores">
            <div data-testid={`similarity-${index}`}>Avg Similarity: {item.avg_similarity}%</div>
            <div data-testid={`uniqueness-${index}`}>Uniqueness: {item.uniqueness_score}%</div>
          </div>
        </div>
      ))}
    </div>
    
    {/* User Profile Clusters */}
    <div data-testid="user-clusters">
      <h3>User Preference Clusters</h3>
      {userProfiles.map((cluster: any, index: number) => (
        <div key={index} data-testid={`cluster-${index}`} className="user-cluster">
          <h4>{cluster.name}</h4>
          <div>Size: {cluster.user_count} users</div>
          <div>Primary Interests: {cluster.primary_interests.join(', ')}</div>
          <div>Engagement Pattern: {cluster.engagement_pattern}</div>
          <div>Recommendation Accuracy: {cluster.accuracy}%</div>
        </div>
      ))}
    </div>
    
    {/* Generate Recommendations */}
    <div data-testid="recommendation-controls">
      <button 
        onClick={() => onGenerateRecommendations('all')}
        data-testid="generate-all"
      >
        Generate for All Users
      </button>
      
      <button 
        onClick={() => onGenerateRecommendations('active')}
        data-testid="generate-active"
      >
        Generate for Active Users
      </button>
      
      <button 
        onClick={() => onGenerateRecommendations('cluster')}
        data-testid="generate-cluster"
      >
        Generate by Cluster
      </button>
    </div>
  </div>
);

const MockTrendAnalyzer = ({ trends, onAnalyzeTrend }: any) => (
  <div data-testid="trend-analyzer">
    <h2>Trend Prediction Network</h2>
    
    {/* Real-time Trends */}
    <div data-testid="realtime-trends">
      <h3>Current Trends</h3>
      {trends.current.map((trend: any, index: number) => (
        <div key={index} data-testid={`current-trend-${index}`} className="trend-item">
          <h4>{trend.name}</h4>
          <div className="trend-metrics">
            <span>Velocity: +{trend.velocity}%</span>
            <span>Volume: {trend.volume.toLocaleString()}</span>
            <span>Sentiment: {trend.sentiment}</span>
            <span>Peak Prediction: {trend.peak_prediction} days</span>
          </div>
          
          <div className="trend-indicators">
            <div data-testid={`trend-score-${index}`}>Trend Score: {trend.score}/100</div>
            <div data-testid={`viral-potential-${index}`}>Viral Potential: {trend.viral_potential}%</div>
          </div>
        </div>
      ))}
    </div>
    
    {/* Emerging Trends */}
    <div data-testid="emerging-trends">
      <h3>Emerging Patterns</h3>
      {trends.emerging.map((trend: any, index: number) => (
        <div key={index} data-testid={`emerging-trend-${index}`} className="emerging-trend">
          <h4>{trend.name}</h4>
          <div>Confidence: {trend.confidence}%</div>
          <div>Early Indicators: {trend.early_indicators.join(', ')}</div>
          <div>Estimated Timeline: {trend.timeline}</div>
          
          <button 
            onClick={() => onAnalyzeTrend(trend.id)}
            data-testid={`analyze-${index}`}
          >
            Deep Analysis
          </button>
        </div>
      ))}
    </div>
    
    {/* Trend Predictions */}
    <div data-testid="trend-predictions">
      <h3>AI Predictions</h3>
      <div data-testid="next-big-thing">Next Big Thing: {trends.predictions.next_big_thing}</div>
      <div data-testid="declining-trend">Declining: {trends.predictions.declining}</div>
      <div data-testid="seasonal-prediction">Seasonal Forecast: {trends.predictions.seasonal}</div>
      <div data-testid="cross-genre-fusion">Cross-Genre Fusion: {trends.predictions.fusion}</div>
    </div>
  </div>
);

const MockPersonalizationEngine = ({ user, personalizedFeed, onUpdatePersonalization }: any) => (
  <div data-testid="personalization-engine">
    <h2>Personalization Neural Core</h2>
    <div data-testid="user-profile">{user.profile.display_name}</div>
    
    {/* User Behavior Analysis */}
    <div data-testid="behavior-analysis">
      <h3>Behavior Analysis</h3>
      <div data-testid="listening-patterns">Listening Patterns: {user.behavior?.listening_patterns || 'Analyzing...'}</div>
      <div data-testid="interaction-style">Interaction Style: {user.behavior?.interaction_style || 'Learning...'}</div>
      <div data-testid="discovery-appetite">Discovery Appetite: {user.behavior?.discovery_appetite || 'Medium'}</div>
      <div data-testid="session-duration">Avg Session: {user.behavior?.avg_session_duration || '25'} min</div>
    </div>
    
    {/* Personalized Feed */}
    <div data-testid="personalized-feed">
      <h3>Your Neural Feed</h3>
      {personalizedFeed.map((item: any, index: number) => (
        <div key={index} data-testid={`feed-item-${index}`} className="feed-item">
          <h4>{item.title}</h4>
          <div className="personalization-scores">
            <div data-testid={`match-score-${index}`}>Match Score: {item.match_score}%</div>
            <div data-testid={`novelty-score-${index}`}>Novelty: {item.novelty_score}%</div>
            <div data-testid={`serendipity-${index}`}>Serendipity: {item.serendipity_score}%</div>
          </div>
          
          <div className="reasoning">
            <div data-testid={`reasoning-${index}`}>Why recommended: {item.reasoning}</div>
          </div>
          
          <div className="feedback-controls">
            <button data-testid={`like-${index}`}>Like</button>
            <button data-testid={`dislike-${index}`}>Dislike</button>
            <button data-testid={`not-interested-${index}`}>Not Interested</button>
          </div>
        </div>
      ))}
    </div>
    
    {/* Personalization Controls */}
    <div data-testid="personalization-controls">
      <h3>Personalization Settings</h3>
      
      <div data-testid="exploration-balance">
        <label>Exploration vs Exploitation:</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          defaultValue="30"
          data-testid="exploration-slider"
        />
        <span>30% exploration</span>
      </div>
      
      <div data-testid="surprise-factor">
        <label>Surprise Factor:</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          defaultValue="45"
          data-testid="surprise-slider"
        />
        <span>45% surprise</span>
      </div>
      
      <button 
        onClick={() => onUpdatePersonalization({ exploration: 30, surprise: 45 })}
        data-testid="update-personalization"
      >
        Update Settings
      </button>
    </div>
  </div>
);

describe('AI-Assisted Content Curation', () => {
  const curatorUser = futureUsers.aiCreatorPro;
  
  const mockContent = [
    {
      id: 'content-001',
      title: 'Neon Dreams Synthwave Mix',
      genre_vector: [0.9, 0.1, 0.0, 0.3],
      mood_vector: [0.8, 0.2, 0.6, 0.1],
      tempo_vector: [0.7, 0.3, 0.0],
      popularity_score: 87.3,
      avg_similarity: 73.2,
      uniqueness_score: 82.5
    },
    {
      id: 'content-002',
      title: 'Cyberpunk City Nights',
      genre_vector: [0.7, 0.8, 0.0, 0.4],
      mood_vector: [0.6, 0.4, 0.8, 0.2],
      tempo_vector: [0.5, 0.5, 0.0],
      popularity_score: 91.7,
      avg_similarity: 68.9,
      uniqueness_score: 89.1
    }
  ];
  
  const mockUserProfiles = [
    {
      name: 'Synthwave Enthusiasts',
      user_count: 15647,
      primary_interests: ['synthwave', 'retro', 'neon'],
      engagement_pattern: 'evening_binge',
      accuracy: 94.2
    },
    {
      name: 'Experimental Explorers',
      user_count: 8923,
      primary_interests: ['experimental', 'ambient', 'glitch'],
      engagement_pattern: 'deep_dive',
      accuracy: 87.6
    }
  ];
  
  const mockTrends = {
    current: [
      {
        id: 'trend-001',
        name: 'Lo-fi Cyberpunk',
        velocity: 156.3,
        volume: 45892,
        sentiment: 'positive',
        peak_prediction: 14,
        score: 94,
        viral_potential: 78
      },
      {
        id: 'trend-002',
        name: 'AI-Human Collabs',
        velocity: 234.7,
        volume: 23456,
        sentiment: 'very_positive',
        peak_prediction: 7,
        score: 89,
        viral_potential: 92
      }
    ],
    emerging: [
      {
        id: 'emerging-001',
        name: 'Neural Jazz Fusion',
        confidence: 73.4,
        early_indicators: ['increase in jazz samples', 'AI experimentation', 'cross-genre mixing'],
        timeline: '2-3 months'
      }
    ],
    predictions: {
      next_big_thing: 'Biometric-Responsive Music',
      declining: 'Static Soundscapes',
      seasonal: 'Winter Ambient Revival',
      fusion: 'Classical-Trap Fusion'
    }
  };
  
  const mockPersonalizedFeed = [
    {
      id: 'feed-001',
      title: 'Neural Dreamscape #47',
      match_score: 94.2,
      novelty_score: 23.7,
      serendipity_score: 67.8,
      reasoning: 'Matches your preference for atmospheric synthwave with experimental elements'
    },
    {
      id: 'feed-002',
      title: 'Quantum Beats Collection',
      match_score: 87.3,
      novelty_score: 78.1,
      serendipity_score: 34.2,
      reasoning: 'New artist similar to your recently liked tracks'
    }
  ];
  
  beforeEach(() => {
    // Mock ML/AI libraries
    global.tf = {
      sequential: vi.fn(() => ({
        add: vi.fn(),
        compile: vi.fn(),
        fit: vi.fn().mockResolvedValue({ history: {} }),
        predict: vi.fn(() => ({ dataSync: () => [0.87, 0.23, 0.91] }))
      })),
      layers: {
        dense: vi.fn()
      }
    } as any;
    
    // Mock recommendation API
    global.fetch = vi.fn();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('AI Curation Dashboard', () => {
    it('should render AI curation dashboard', () => {
      const mockOnCurateContent = vi.fn();
      const mockOnUpdatePreferences = vi.fn();
      
      render(
        <MockAICurationDashboard 
          user={curatorUser}
          onCurateContent={mockOnCurateContent}
          onUpdatePreferences={mockOnUpdatePreferences}
        />
      );
      
      expect(screen.getByTestId('ai-curation-dashboard')).toBeInTheDocument();
      expect(screen.getByText('Neural Curation Engine')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Neural Beat Architect')).toBeInTheDocument();
    });
    
    it('should display curation status information', () => {
      const mockOnCurateContent = vi.fn();
      const mockOnUpdatePreferences = vi.fn();
      
      render(
        <MockAICurationDashboard 
          user={curatorUser}
          onCurateContent={mockOnCurateContent}
          onUpdatePreferences={mockOnUpdatePreferences}
        />
      );
      
      const status = screen.getByTestId('curation-status');
      expect(status).toHaveTextContent('AI Status: Active');
      expect(status).toHaveTextContent('Last Update: 2 minutes ago');
      expect(status).toHaveTextContent('Processing: 147 items');
      expect(status).toHaveTextContent('Avg Confidence: 91.2%');
    });
    
    it('should show curated collections with metrics', () => {
      const mockOnCurateContent = vi.fn();
      const mockOnUpdatePreferences = vi.fn();
      
      render(
        <MockAICurationDashboard 
          user={curatorUser}
          onCurateContent={mockOnCurateContent}
          onUpdatePreferences={mockOnUpdatePreferences}
        />
      );
      
      const collection1 = screen.getByTestId('collection-0');
      expect(collection1).toHaveTextContent('Emerging Synthwave Artists');
      expect(collection1).toHaveTextContent('Items: 47');
      expect(collection1).toHaveTextContent('AI Confidence: 94.0%');
      
      expect(screen.getByTestId('relevance-0')).toHaveTextContent('Relevance: 87.3/100');
      expect(screen.getByTestId('engagement-prediction-0')).toHaveTextContent('Predicted Engagement: +23.7%');
    });
    
    it('should handle curation actions', async () => {
      const user = userEvent.setup();
      const mockOnCurateContent = vi.fn();
      const mockOnUpdatePreferences = vi.fn();
      
      render(
        <MockAICurationDashboard 
          user={curatorUser}
          onCurateContent={mockOnCurateContent}
          onUpdatePreferences={mockOnUpdatePreferences}
        />
      );
      
      await user.click(screen.getByTestId('approve-0'));
      expect(mockOnCurateContent).toHaveBeenCalledWith('curated-001', 'approve');
      
      await user.click(screen.getByTestId('reject-1'));
      expect(mockOnCurateContent).toHaveBeenCalledWith('curated-002', 'reject');
    });
    
    it('should allow preference updates', async () => {
      const user = userEvent.setup();
      const mockOnCurateContent = vi.fn();
      const mockOnUpdatePreferences = vi.fn();
      
      render(
        <MockAICurationDashboard 
          user={curatorUser}
          onCurateContent={mockOnCurateContent}
          onUpdatePreferences={mockOnUpdatePreferences}
        />
      );
      
      const updateButton = screen.getByTestId('update-preferences');
      await user.click(updateButton);
      
      expect(mockOnUpdatePreferences).toHaveBeenCalledWith({
        discovery: 75,
        genres: { synthwave: 30, cyberpunk: 25 }
      });
    });
  });

  describe('Content Recommendation Engine', () => {
    it('should render recommendation engine interface', () => {
      const mockOnGenerateRecommendations = vi.fn();
      
      render(
        <MockContentRecommendationEngine 
          content={mockContent}
          userProfiles={mockUserProfiles}
          onGenerateRecommendations={mockOnGenerateRecommendations}
        />
      );
      
      expect(screen.getByTestId('recommendation-engine')).toBeInTheDocument();
      expect(screen.getByText('Neural Recommendation Matrix')).toBeInTheDocument();
    });
    
    it('should display content vector analysis', () => {
      const mockOnGenerateRecommendations = vi.fn();
      
      render(
        <MockContentRecommendationEngine 
          content={mockContent}
          userProfiles={mockUserProfiles}
          onGenerateRecommendations={mockOnGenerateRecommendations}
        />
      );
      
      const contentVector = screen.getByTestId('content-vector-0');
      expect(contentVector).toHaveTextContent('Neon Dreams Synthwave Mix');
      expect(contentVector).toHaveTextContent('Genre Vector: [0.9, 0.1, 0, 0.3]');
      expect(contentVector).toHaveTextContent('Popularity Score: 87.3');
      
      expect(screen.getByTestId('similarity-0')).toHaveTextContent('Avg Similarity: 73.2%');
      expect(screen.getByTestId('uniqueness-0')).toHaveTextContent('Uniqueness: 82.5%');
    });
    
    it('should show user preference clusters', () => {
      const mockOnGenerateRecommendations = vi.fn();
      
      render(
        <MockContentRecommendationEngine 
          content={mockContent}
          userProfiles={mockUserProfiles}
          onGenerateRecommendations={mockOnGenerateRecommendations}
        />
      );
      
      const cluster1 = screen.getByTestId('cluster-0');
      expect(cluster1).toHaveTextContent('Synthwave Enthusiasts');
      expect(cluster1).toHaveTextContent('Size: 15647 users');
      expect(cluster1).toHaveTextContent('Primary Interests: synthwave, retro, neon');
      expect(cluster1).toHaveTextContent('Recommendation Accuracy: 94.2%');
    });
    
    it('should handle recommendation generation', async () => {
      const user = userEvent.setup();
      const mockOnGenerateRecommendations = vi.fn();
      
      render(
        <MockContentRecommendationEngine 
          content={mockContent}
          userProfiles={mockUserProfiles}
          onGenerateRecommendations={mockOnGenerateRecommendations}
        />
      );
      
      await user.click(screen.getByTestId('generate-all'));
      expect(mockOnGenerateRecommendations).toHaveBeenCalledWith('all');
      
      await user.click(screen.getByTestId('generate-cluster'));
      expect(mockOnGenerateRecommendations).toHaveBeenCalledWith('cluster');
    });
  });

  describe('Trend Analyzer', () => {
    it('should render trend analyzer interface', () => {
      const mockOnAnalyzeTrend = vi.fn();
      
      render(
        <MockTrendAnalyzer 
          trends={mockTrends}
          onAnalyzeTrend={mockOnAnalyzeTrend}
        />
      );
      
      expect(screen.getByTestId('trend-analyzer')).toBeInTheDocument();
      expect(screen.getByText('Trend Prediction Network')).toBeInTheDocument();
    });
    
    it('should display current trends with metrics', () => {
      const mockOnAnalyzeTrend = vi.fn();
      
      render(
        <MockTrendAnalyzer 
          trends={mockTrends}
          onAnalyzeTrend={mockOnAnalyzeTrend}
        />
      );
      
      const trend1 = screen.getByTestId('current-trend-0');
      expect(trend1).toHaveTextContent('Lo-fi Cyberpunk');
      expect(trend1).toHaveTextContent('Velocity: +156.3%');
      expect(trend1).toHaveTextContent('Volume: 45,892');
      expect(trend1).toHaveTextContent('Peak Prediction: 14 days');
      
      expect(screen.getByTestId('trend-score-0')).toHaveTextContent('Trend Score: 94/100');
      expect(screen.getByTestId('viral-potential-0')).toHaveTextContent('Viral Potential: 78%');
    });
    
    it('should show emerging patterns', () => {
      const mockOnAnalyzeTrend = vi.fn();
      
      render(
        <MockTrendAnalyzer 
          trends={mockTrends}
          onAnalyzeTrend={mockOnAnalyzeTrend}
        />
      );
      
      const emergingTrend = screen.getByTestId('emerging-trend-0');
      expect(emergingTrend).toHaveTextContent('Neural Jazz Fusion');
      expect(emergingTrend).toHaveTextContent('Confidence: 73.4%');
      expect(emergingTrend).toHaveTextContent('Early Indicators: increase in jazz samples, AI experimentation, cross-genre mixing');
    });
    
    it('should handle trend analysis requests', async () => {
      const user = userEvent.setup();
      const mockOnAnalyzeTrend = vi.fn();
      
      render(
        <MockTrendAnalyzer 
          trends={mockTrends}
          onAnalyzeTrend={mockOnAnalyzeTrend}
        />
      );
      
      await user.click(screen.getByTestId('analyze-0'));
      expect(mockOnAnalyzeTrend).toHaveBeenCalledWith('emerging-001');
    });
    
    it('should display AI predictions', () => {
      const mockOnAnalyzeTrend = vi.fn();
      
      render(
        <MockTrendAnalyzer 
          trends={mockTrends}
          onAnalyzeTrend={mockOnAnalyzeTrend}
        />
      );
      
      const predictions = screen.getByTestId('trend-predictions');
      expect(predictions).toHaveTextContent('Next Big Thing: Biometric-Responsive Music');
      expect(predictions).toHaveTextContent('Declining: Static Soundscapes');
      expect(predictions).toHaveTextContent('Seasonal Forecast: Winter Ambient Revival');
    });
  });

  describe('Personalization Engine', () => {
    const personalizedUser = {
      ...curatorUser,
      behavior: {
        listening_patterns: 'late_night_ambient',
        interaction_style: 'discovery_focused',
        discovery_appetite: 'high',
        avg_session_duration: 42
      }
    };
    
    it('should render personalization interface', () => {
      const mockOnUpdatePersonalization = vi.fn();
      
      render(
        <MockPersonalizationEngine 
          user={personalizedUser}
          personalizedFeed={mockPersonalizedFeed}
          onUpdatePersonalization={mockOnUpdatePersonalization}
        />
      );
      
      expect(screen.getByTestId('personalization-engine')).toBeInTheDocument();
      expect(screen.getByText('Personalization Neural Core')).toBeInTheDocument();
    });
    
    it('should display user behavior analysis', () => {
      const mockOnUpdatePersonalization = vi.fn();
      
      render(
        <MockPersonalizationEngine 
          user={personalizedUser}
          personalizedFeed={mockPersonalizedFeed}
          onUpdatePersonalization={mockOnUpdatePersonalization}
        />
      );
      
      const behaviorAnalysis = screen.getByTestId('behavior-analysis');
      expect(behaviorAnalysis).toHaveTextContent('Listening Patterns: late_night_ambient');
      expect(behaviorAnalysis).toHaveTextContent('Interaction Style: discovery_focused');
      expect(behaviorAnalysis).toHaveTextContent('Discovery Appetite: high');
      expect(behaviorAnalysis).toHaveTextContent('Avg Session: 42 min');
    });
    
    it('should show personalized feed with scores', () => {
      const mockOnUpdatePersonalization = vi.fn();
      
      render(
        <MockPersonalizationEngine 
          user={personalizedUser}
          personalizedFeed={mockPersonalizedFeed}
          onUpdatePersonalization={mockOnUpdatePersonalization}
        />
      );
      
      const feedItem1 = screen.getByTestId('feed-item-0');
      expect(feedItem1).toHaveTextContent('Neural Dreamscape #47');
      
      expect(screen.getByTestId('match-score-0')).toHaveTextContent('Match Score: 94.2%');
      expect(screen.getByTestId('novelty-score-0')).toHaveTextContent('Novelty: 23.7%');
      expect(screen.getByTestId('serendipity-0')).toHaveTextContent('Serendipity: 67.8%');
      
      expect(screen.getByTestId('reasoning-0')).toHaveTextContent(
        'Matches your preference for atmospheric synthwave with experimental elements'
      );
    });
    
    it('should handle personalization settings updates', async () => {
      const user = userEvent.setup();
      const mockOnUpdatePersonalization = vi.fn();
      
      render(
        <MockPersonalizationEngine 
          user={personalizedUser}
          personalizedFeed={mockPersonalizedFeed}
          onUpdatePersonalization={mockOnUpdatePersonalization}
        />
      );
      
      await user.click(screen.getByTestId('update-personalization'));
      expect(mockOnUpdatePersonalization).toHaveBeenCalledWith({ exploration: 30, surprise: 45 });
    });
  });

  describe('AI Algorithm Integration', () => {
    it('should process machine learning models', () => {
      // Mock TensorFlow.js model
      const mockModel = {
        add: vi.fn(),
        compile: vi.fn(),
        fit: vi.fn().mockResolvedValue({ history: { loss: [0.5, 0.3, 0.1] } }),
        predict: vi.fn(() => ({ dataSync: () => [0.87, 0.23, 0.91] }))
      };
      
      global.tf.sequential = vi.fn(() => mockModel);
      
      const model = global.tf.sequential();
      const predictions = model.predict().dataSync();
      
      expect(predictions).toEqual([0.87, 0.23, 0.91]);
    });
    
    it('should calculate content similarity scores', () => {
      const contentA = {
        genre_vector: [0.9, 0.1, 0.0, 0.3],
        mood_vector: [0.8, 0.2, 0.6, 0.1],
        tempo_vector: [0.7, 0.3, 0.0]
      };
      
      const contentB = {
        genre_vector: [0.7, 0.2, 0.1, 0.4],
        mood_vector: [0.6, 0.4, 0.8, 0.2],
        tempo_vector: [0.5, 0.5, 0.0]
      };
      
      // Cosine similarity calculation
      const cosineSimilarity = (vecA: number[], vecB: number[]) => {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        return dotProduct / (magnitudeA * magnitudeB);
      };
      
      const genreSimilarity = cosineSimilarity(contentA.genre_vector, contentB.genre_vector);
      const moodSimilarity = cosineSimilarity(contentA.mood_vector, contentB.mood_vector);
      
      expect(genreSimilarity).toBeGreaterThan(0.8);
      expect(moodSimilarity).toBeGreaterThan(0.7);
    });
    
    it('should generate recommendation explanations', () => {
      const recommendation = {
        content_id: 'track-001',
        user_id: 'user-001',
        match_score: 94.2,
        factors: {
          genre_match: 0.89,
          mood_match: 0.76,
          artist_similarity: 0.82,
          time_context: 0.93,
          social_proof: 0.67
        }
      };
      
      const generateExplanation = (rec: typeof recommendation) => {
        const topFactors = Object.entries(rec.factors)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 2)
          .map(([factor]) => factor.replace('_', ' '));
        
        return `Recommended based on ${topFactors.join(' and ')} (${rec.match_score}% match)`;
      };
      
      const explanation = generateExplanation(recommendation);
      
      expect(explanation).toContain('time context');
      expect(explanation).toContain('genre match');
      expect(explanation).toContain('94.2% match');
    });
  });
});
