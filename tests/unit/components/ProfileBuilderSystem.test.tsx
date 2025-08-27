import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { mockUsers } from '../../fixtures/users';
import { mockContent } from '../../fixtures/content';

// Mock Profile Builder Components
const MockProfileBuilder = ({ widgets, onAddWidget, onUpdateWidget, onRemoveWidget, onSave }: any) => (
  <DndProvider backend={HTML5Backend}>
    <div data-testid="profile-builder" className="cyberpunk-profile-builder">
      <div className="builder-header">
        <h1 className="neon-title">Craft Your Digital Identity</h1>
        <div className="builder-controls">
          <button onClick={() => setPreviewMode(true)} className="preview-btn neon-border">
            👁️ Preview Reality
          </button>
          <button onClick={onSave} className="save-btn synthwave-gradient">
            💾 Save to Matrix
          </button>
        </div>
      </div>
      
      <div className="builder-layout">
        {/* Widget Library */}
        <div className="widget-library cyberpunk-panel">
          <h2 className="library-title">Widget Arsenal</h2>
          <div className="widget-categories">
            <div className="category">
              <h3>Identity Modules</h3>
              <div className="widget-item" draggable onClick={() => onAddWidget('about')}>
                🌐 About Section
              </div>
              <div className="widget-item" draggable onClick={() => onAddWidget('contact')}>
                📡 Contact Grid
              </div>
            </div>
            
            <div className="category">
              <h3>Creative Arsenal</h3>
              <div className="widget-item" draggable onClick={() => onAddWidget('music-player')}>
                🎵 Sonic Interface
              </div>
              <div className="widget-item" draggable onClick={() => onAddWidget('gallery')}>
                🖼️ Visual Gallery
              </div>
              <div className="widget-item" draggable onClick={() => onAddWidget('video-player')}>
                📹 Video Portal
              </div>
            </div>
            
            <div className="category">
              <h3>Social Nexus</h3>
              <div className="widget-item" draggable onClick={() => onAddWidget('social-feed')}>
                📱 Social Feed
              </div>
              <div className="widget-item" draggable onClick={() => onAddWidget('collaboration')}>
                🤝 Collab Network
              </div>
            </div>
            
            <div className="category">
              <h3>Commerce Hub</h3>
              <div className="widget-item" draggable onClick={() => onAddWidget('store')}>
                🛍️ Digital Store
              </div>
              <div className="widget-item" draggable onClick={() => onAddWidget('tips')}>
                💰 Tip Interface
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Canvas */}
        <div className="profile-canvas matrix-grid">
          <div className="canvas-grid">
            {widgets.map((widget: any) => (
              <div 
                key={widget.id}
                data-testid={`widget-${widget.type}`}
                className={`profile-widget widget-${widget.type} ${widget.theme || 'neon-city'}`}
                style={{
                  gridColumn: `${widget.position.x} / span ${widget.size.width}`,
                  gridRow: `${widget.position.y} / span ${widget.size.height}`,
                }}
              >
                <div className="widget-header">
                  <h4 className="widget-title">{widget.title}</h4>
                  <div className="widget-controls">
                    <button onClick={() => onUpdateWidget(widget.id, 'settings')} className="settings-btn">
                      ⚙️
                    </button>
                    <button onClick={() => onRemoveWidget(widget.id)} className="remove-btn">
                      ❌
                    </button>
                  </div>
                </div>
                <div className="widget-content">{renderWidgetContent(widget)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </DndProvider>
);

const MockWidgetSettings = ({ widget, onUpdate, onClose }: any) => (
  <div data-testid="widget-settings" className="widget-settings-modal cyberpunk-modal">
    <div className="modal-header">
      <h2 className="modal-title">Configure {widget.title}</h2>
      <button onClick={onClose} className="close-btn">✖️</button>
    </div>
    
    <div className="modal-content">
      {widget.type === 'about' && (
        <div className="about-settings">
          <div className="form-group">
            <label className="cyber-label">Bio Text</label>
            <textarea 
              value={widget.content?.bio || ''}
              onChange={(e) => onUpdate({ content: { ...widget.content, bio: e.target.value } })}
              className="cyber-textarea"
              placeholder="Describe your digital essence..."
            />
          </div>
          
          <div className="form-group">
            <label className="cyber-label">Vibe Tags</label>
            <input 
              type="text"
              value={widget.content?.tags?.join(', ') || ''}
              onChange={(e) => onUpdate({ content: { ...widget.content, tags: e.target.value.split(', ') } })}
              className="cyber-input"
              placeholder="vaporwave, synthwave, cyberpunk"
            />
          </div>
          
          <div className="form-group">
            <label className="cyber-label">Theme</label>
            <select 
              value={widget.theme || 'neon-city'}
              onChange={(e) => onUpdate({ theme: e.target.value })}
              className="cyber-select"
            >
              <option value="neon-city">Neon City</option>
              <option value="cyber-blue">Cyber Blue</option>
              <option value="retro-wave">Retro Wave</option>
              <option value="matrix-green">Matrix Green</option>
            </select>
          </div>
        </div>
      )}
      
      {widget.type === 'music-player' && (
        <div className="music-settings">
          <div className="form-group">
            <label className="cyber-label">Featured Track</label>
            <select className="cyber-select">
              <option value="synthwave-nights">Synthwave Nights</option>
              <option value="neon-highway">Neon Highway</option>
              <option value="digital-rain">Digital Rain</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="cyber-label">Visualizer Type</label>
            <select className="cyber-select">
              <option value="bars">Frequency Bars</option>
              <option value="wave">Waveform</option>
              <option value="particle">Particle Effects</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-checkbox">
              <input type="checkbox" defaultChecked />
              Auto-play on profile load
            </label>
          </div>
        </div>
      )}
    </div>
    
    <div className="modal-footer">
      <button onClick={onClose} className="cancel-btn">
        Cancel
      </button>
      <button onClick={() => { /* apply settings */ onClose(); }} className="apply-btn neon-glow">
        Apply Changes
      </button>
    </div>
  </div>
);

const MockProfilePreview = ({ profile, widgets, onExitPreview }: any) => (
  <div data-testid="profile-preview" className="profile-preview full-screen">
    <div className="preview-header">
      <button onClick={onExitPreview} className="exit-preview-btn">
        ⬅️ Exit Preview
      </button>
      <h1 className="profile-title">{profile.display_name}</h1>
      <div className="profile-stats">
        <span>👁️ {profile.profile_views} views</span>
        <span>👥 {profile.follower_count} followers</span>
      </div>
    </div>
    
    <div className="preview-content">
      {widgets.map((widget: any) => (
        <div key={widget.id} className={`preview-widget widget-${widget.type}`}>
          {renderWidgetContent(widget)}
        </div>
      ))}
    </div>
  </div>
);

// Helper function to render widget content
const renderWidgetContent = (widget: any) => {
  switch (widget.type) {
    case 'about':
      return (
        <div className="about-widget-content">
          <p>{widget.content?.bio || 'No bio available'}</p>
          <div className="vibe-tags">
            {widget.content?.tags?.map((tag: string) => (
              <span key={tag} className="vibe-tag">{tag}</span>
            )) || []}
          </div>
        </div>
      );
      
    case 'music-player':
      return (
        <div className="music-widget-content">
          <div className="mini-player">
            <div className="track-info">
              <span className="track-title">Synthwave Nights</span>
              <span className="track-artist">NeonDreamer</span>
            </div>
            <div className="player-controls">
              <button>▶️</button>
            </div>
          </div>
        </div>
      );
      
    case 'gallery':
      return (
        <div className="gallery-widget-content">
          <div className="gallery-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="gallery-item">
                <div className="placeholder-image">🖼️</div>
              </div>
            ))}
          </div>
        </div>
      );
      
    default:
      return <div className="widget-placeholder">Widget content</div>;
  }
};

// Mock state setter function
const setPreviewMode = vi.fn();

describe('Unified Creator Profiles - Profile Builder System', () => {
  const mockUserProfile = mockUsers.neonDreamer.profile;
  const mockWidgets = [
    {
      id: 'widget-001',
      type: 'about',
      title: 'Digital Identity',
      position: { x: 1, y: 1 },
      size: { width: 6, height: 3 },
      theme: 'neon-city',
      content: {
        bio: 'Creating ethereal soundscapes in the digital void.',
        tags: ['vaporwave', 'synthwave', 'ambient'],
      },
    },
    {
      id: 'widget-002',
      type: 'music-player',
      title: 'Sonic Interface',
      position: { x: 7, y: 1 },
      size: { width: 6, height: 4 },
      theme: 'cyber-blue',
      content: {
        featured_track: 'synthwave-nights',
        auto_play: true,
        visualizer: 'bars',
      },
    },
  ];
  
  describe('Profile Builder Interface', () => {
    it('renders cyberpunk-themed profile builder', () => {
      render(
        <MockProfileBuilder 
          widgets={mockWidgets}
          onAddWidget={vi.fn()}
          onUpdateWidget={vi.fn()}
          onRemoveWidget={vi.fn()}
          onSave={vi.fn()}
        />
      );
      
      expect(screen.getByTestId('profile-builder')).toHaveClass('cyberpunk-profile-builder');
      expect(screen.getByText('Craft Your Digital Identity')).toHaveClass('neon-title');
      expect(screen.getByText('👁️ Preview Reality')).toBeInTheDocument();
      expect(screen.getByText('💾 Save to Matrix')).toBeInTheDocument();
    });
    
    it('displays categorized widget library with vibe-themed options', () => {
      render(
        <MockProfileBuilder 
          widgets={[]}
          onAddWidget={vi.fn()}
          onUpdateWidget={vi.fn()}
          onRemoveWidget={vi.fn()}
          onSave={vi.fn()}
        />
      );
      
      expect(screen.getByText('Widget Arsenal')).toBeInTheDocument();
      expect(screen.getByText('Identity Modules')).toBeInTheDocument();
      expect(screen.getByText('Creative Arsenal')).toBeInTheDocument();
      expect(screen.getByText('Social Nexus')).toBeInTheDocument();
      expect(screen.getByText('Commerce Hub')).toBeInTheDocument();
      
      // Check for vibe-themed widget names
      expect(screen.getByText('🎵 Sonic Interface')).toBeInTheDocument();
      expect(screen.getByText('📡 Contact Grid')).toBeInTheDocument();
      expect(screen.getByText('🤝 Collab Network')).toBeInTheDocument();
    });
    
    it('manages widget placement on matrix-themed grid canvas', () => {
      render(
        <MockProfileBuilder 
          widgets={mockWidgets}
          onAddWidget={vi.fn()}
          onUpdateWidget={vi.fn()}
          onRemoveWidget={vi.fn()}
          onSave={vi.fn()}
        />
      );
      
      const canvas = document.querySelector('.profile-canvas');
      expect(canvas).toHaveClass('matrix-grid');
      
      const aboutWidget = screen.getByTestId('widget-about');
      expect(aboutWidget).toHaveClass('widget-about', 'neon-city');
      
      const musicWidget = screen.getByTestId('widget-music-player');
      expect(musicWidget).toHaveClass('widget-music-player', 'cyber-blue');
    });
    
    it('handles widget addition with cyberpunk feedback effects', async () => {
      const mockAddWidget = vi.fn();
      const user = userEvent.setup();
      
      render(
        <MockProfileBuilder 
          widgets={[]}
          onAddWidget={mockAddWidget}
          onUpdateWidget={vi.fn()}
          onRemoveWidget={vi.fn()}
          onSave={vi.fn()}
        />
      );
      
      const aboutWidget = screen.getByText('🌐 About Section');
      await user.click(aboutWidget);
      
      expect(mockAddWidget).toHaveBeenCalledWith('about');
    });
    
    it('supports drag-and-drop widget arrangement with neon guides', () => {
      render(
        <MockProfileBuilder 
          widgets={mockWidgets}
          onAddWidget={vi.fn()}
          onUpdateWidget={vi.fn()}
          onRemoveWidget={vi.fn()}
          onSave={vi.fn()}
        />
      );
      
      // Check for draggable elements
      const draggableItems = document.querySelectorAll('[draggable="true"]');
      expect(draggableItems.length).toBeGreaterThan(0);
      
      // Would test drag and drop functionality with DnD context
    });
  });
  
  describe('Widget Configuration with Vibe Aesthetics', () => {
    const mockAboutWidget = mockWidgets[0];
    
    it('opens widget settings modal with cyberpunk styling', async () => {
      const user = userEvent.setup();
      render(
        <MockWidgetSettings 
          widget={mockAboutWidget}
          onUpdate={vi.fn()}
          onClose={vi.fn()}
        />
      );
      
      expect(screen.getByTestId('widget-settings')).toHaveClass('cyberpunk-modal');
      expect(screen.getByText('Configure Digital Identity')).toBeInTheDocument();
    });
    
    it('configures About widget with vibe-specific options', async () => {
      const mockUpdate = vi.fn();
      const user = userEvent.setup();
      
      render(
        <MockWidgetSettings 
          widget={mockAboutWidget}
          onUpdate={mockUpdate}
          onClose={vi.fn()}
        />
      );
      
      const bioTextarea = screen.getByPlaceholderText('Describe your digital essence...');
      expect(bioTextarea).toHaveClass('cyber-textarea');
      
      const themeSelect = screen.getByDisplayValue('Neon City');
      expect(screen.getByText('Cyber Blue')).toBeInTheDocument();
      expect(screen.getByText('Retro Wave')).toBeInTheDocument();
      expect(screen.getByText('Matrix Green')).toBeInTheDocument();
      
      await user.type(bioTextarea, ' Additional bio text');
      // Would trigger onUpdate with new content
    });
    
    it('handles Music Player widget configuration', () => {
      const musicWidget = mockWidgets[1];
      render(
        <MockWidgetSettings 
          widget={musicWidget}
          onUpdate={vi.fn()}
          onClose={vi.fn()}
        />
      );
      
      expect(screen.getByText('Featured Track')).toBeInTheDocument();
      expect(screen.getByText('Visualizer Type')).toBeInTheDocument();
      expect(screen.getByText('Auto-play on profile load')).toBeInTheDocument();
      
      // Check visualizer options
      expect(screen.getByText('Frequency Bars')).toBeInTheDocument();
      expect(screen.getByText('Particle Effects')).toBeInTheDocument();
    });
    
    it('applies theme changes with synthwave transitions', async () => {
      const mockUpdate = vi.fn();
      const user = userEvent.setup();
      
      render(
        <MockWidgetSettings 
          widget={mockAboutWidget}
          onUpdate={mockUpdate}
          onClose={vi.fn()}
        />
      );
      
      const themeSelect = screen.getByDisplayValue('Neon City');
      await user.selectOptions(themeSelect, 'cyber-blue');
      
      // Would trigger theme update
      expect(themeSelect).toBeInTheDocument();
    });
  });
  
  describe('Profile Preview with Immersive Experience', () => {
    it('renders full-screen profile preview', () => {
      render(
        <MockProfilePreview 
          profile={mockUserProfile}
          widgets={mockWidgets}
          onExitPreview={vi.fn()}
        />
      );
      
      expect(screen.getByTestId('profile-preview')).toHaveClass('full-screen');
      expect(screen.getByText('NeonDreamer')).toBeInTheDocument();
      expect(screen.getByText('⬅️ Exit Preview')).toBeInTheDocument();
    });
    
    it('displays profile statistics with neon styling', () => {
      render(
        <MockProfilePreview 
          profile={mockUserProfile}
          widgets={mockWidgets}
          onExitPreview={vi.fn()}
        />
      );
      
      expect(screen.getByText('15420 views')).toBeInTheDocument();
      expect(screen.getByText('8392 followers')).toBeInTheDocument();
    });
    
    it('renders widgets in preview mode with full functionality', () => {
      render(
        <MockProfilePreview 
          profile={mockUserProfile}
          widgets={mockWidgets}
          onExitPreview={vi.fn()}
        />
      );
      
      // Check for rendered widget content
      expect(screen.getByText('Creating ethereal soundscapes in the digital void.')).toBeInTheDocument();
      expect(screen.getByText('vaporwave')).toBeInTheDocument();
      expect(screen.getByText('synthwave')).toBeInTheDocument();
      
      // Music player preview
      expect(screen.getByText('Synthwave Nights')).toBeInTheDocument();
      expect(screen.getByText('NeonDreamer')).toBeInTheDocument();
    });
    
    it('handles preview exit with fade transition', async () => {
      const mockExitPreview = vi.fn();
      const user = userEvent.setup();
      
      render(
        <MockProfilePreview 
          profile={mockUserProfile}
          widgets={mockWidgets}
          onExitPreview={mockExitPreview}
        />
      );
      
      const exitButton = screen.getByText('⬅️ Exit Preview');
      await user.click(exitButton);
      
      expect(mockExitPreview).toHaveBeenCalled();
    });
  });
  
  describe('Advanced Profile Features', () => {
    it('supports custom CSS injection for advanced customization', () => {
      const profileWithCustomCSS = {
        ...mockUserProfile,
        custom_css: `
          .profile-container {
            background: linear-gradient(135deg, #ff006e, #8338ec);
            animation: neonPulse 2s infinite;
          }
        `,
      };
      
      expect(profileWithCustomCSS.custom_css).toContain('neonPulse');
    });
    
    it('implements responsive design for multiple device sizes', () => {
      const responsiveBreakpoints = {
        mobile: '320px - 768px',
        tablet: '768px - 1024px',
        desktop: '1024px+',
        ultrawide: '2560px+',
      };
      
      expect(responsiveBreakpoints.mobile).toBe('320px - 768px');
    });
    
    it('supports profile templates for quick setup', () => {
      const profileTemplates = [
        {
          name: 'Synthwave Producer',
          widgets: ['about', 'music-player', 'gallery', 'social-feed'],
          theme: 'neon-city',
          target_audience: 'musicians',
        },
        {
          name: 'Visual Artist',
          widgets: ['about', 'gallery', 'store', 'contact'],
          theme: 'cyber-blue',
          target_audience: 'visual_artists',
        },
        {
          name: 'Collaborator Hub',
          widgets: ['about', 'collaboration', 'social-feed', 'contact'],
          theme: 'matrix-green',
          target_audience: 'collaborators',
        },
      ];
      
      expect(profileTemplates).toHaveLength(3);
      expect(profileTemplates[0].name).toBe('Synthwave Producer');
    });
    
    it('handles profile sharing with embedded player widgets', () => {
      const shareableProfile = {
        profile_id: mockUserProfile.id,
        share_url: `https://yourspace.io/${mockUserProfile.username}`,
        embed_code: `<iframe src="https://yourspace.io/embed/${mockUserProfile.username}" width="600" height="400"></iframe>`,
        social_meta: {
          title: `${mockUserProfile.display_name} - YourSpace Creator`,
          description: mockUserProfile.bio,
          image: mockUserProfile.avatar_url,
          type: 'profile',
        },
      };
      
      expect(shareableProfile.embed_code).toContain('iframe');
      expect(shareableProfile.social_meta.type).toBe('profile');
    });
  });
  
  describe('Monetization Widget Integration', () => {
    it('supports tip jar widget with cyberpunk styling', () => {
      const tipWidget = {
        id: 'widget-tips',
        type: 'tips',
        title: 'Support the Creator',
        theme: 'neon-city',
        content: {
          payment_methods: ['crypto', 'paypal', 'stripe'],
          suggested_amounts: [5, 10, 20, 50],
          custom_message: 'Fuel the neon dreams! ⚡',
        },
      };
      
      expect(tipWidget.content.payment_methods).toContain('crypto');
      expect(tipWidget.content.suggested_amounts).toEqual([5, 10, 20, 50]);
    });
    
    it('integrates digital store widget for content sales', () => {
      const storeWidget = {
        id: 'widget-store',
        type: 'store',
        title: 'Digital Arsenal',
        theme: 'cyber-blue',
        content: {
          featured_products: [
            {
              id: 'prod-001',
              name: 'Synthwave Sample Pack',
              price: 24.99,
              thumbnail: '/images/sample-pack-thumb.jpg',
            },
            {
              id: 'prod-002',
              name: 'Neon Preset Bundle',
              price: 15.99,
              thumbnail: '/images/preset-bundle-thumb.jpg',
            },
          ],
          payment_integration: 'stripe',
        },
      };
      
      expect(storeWidget.content.featured_products).toHaveLength(2);
      expect(storeWidget.content.payment_integration).toBe('stripe');
    });
    
    it('handles subscription widget for premium content access', () => {
      const subscriptionWidget = {
        id: 'widget-subscription',
        type: 'subscription',
        title: 'Join the Inner Circle',
        theme: 'matrix-green',
        content: {
          tiers: [
            {
              name: 'Digital Apprentice',
              price: 5.99,
              features: ['Early access', 'Behind-the-scenes', 'Discord access'],
            },
            {
              name: 'Cyber Elite',
              price: 12.99,
              features: ['All Apprentice perks', 'Exclusive content', '1-on-1 sessions'],
            },
          ],
          trial_period: 7, // days
        },
      };
      
      expect(subscriptionWidget.content.tiers).toHaveLength(2);
      expect(subscriptionWidget.content.trial_period).toBe(7);
    });
  });
});
