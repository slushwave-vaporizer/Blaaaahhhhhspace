# YourSpace Creative Labs - Comprehensive Test Suite

This directory contains a complete testing infrastructure for YourSpace Interactive Creative Labs platform, covering all current and planned features.

## Test Coverage Overview

This test suite covers **31 major feature categories** with multiple test types:

### Core Platform Features
- ✅ **Unified Creator Profiles** - Modular profile system with portfolio, monetization widgets
- ✅ **Content Upload & Display Tools** - Multi-media support (images, audio, video, downloadables)
- ✅ **Social Interaction System** - Likes, comments, follows, reposts, notifications
- ✅ **Discovery & Explore** - Trending content, new creators, search, categorization
- ✅ **EPK Builder** - 7-step Electronic Press Kit creation with export functionality
- ✅ **Music Player System** - Advanced audio player with collaborative features

### Advanced Features
- ✅ **Virtual Rooms & Spaces** - 3D environments, customizable rooms, interactive objects
- ✅ **Learning & Mentorship** - Resource sharing, Q&A boards, mentor availability
- ✅ **Collaboration Tools** - Remix/fork functionality, collab requests, credit tagging
- ✅ **Monetization Infrastructure** - Tips, subscriptions, marketplace, payment processing
- ✅ **Content Feed with Audio Integration** - Click-to-play functionality
- ✅ **WebXR & Immersive Galleries** - Virtual reality spaces, 3D content display

### Roadmap Features
- ✅ **Enhanced Discovery Algorithms** - Personalized recommendations, AI-powered search
- ✅ **Advanced Collaboration Tools** - Real-time multiplayer canvas, pair programming
- ✅ **Learning & Workshops Integration** - Live streaming, webinars, learning paths
- ✅ **Marketplace Expansion** - Asset stores, physical goods, sample libraries
- ✅ **Mobile App/PWA** - Native mobile experience, push notifications
- ✅ **Moderation & Community Health** - AI content filtering, community moderation
- ✅ **Performance & Scalability** - CDN optimization, user quotas, low-fi modes

### Emotional & Vibe-Centric UX Features
- ✅ **Vaporwave/Cyberpunk Aesthetics** - Theme system, visual effects, ambient design
- ✅ **Ambient Audio & Sound Design** - Background music, UI sounds, responsive soundscapes
- ✅ **Synesthetic & Reactive Elements** - Interactive visualizers, cursor effects, parallax
- ✅ **Personal Theming** - Custom themes, background images, room customization
- ✅ **Emotion-Responsive UI** - Mood toggles, ambient mode, adaptive interfaces

### Technical Infrastructure
- ✅ **Authentication System** - User registration, login, profile management
- ✅ **Database Operations** - CRUD operations for all data models
- ✅ **File Storage & Management** - Media uploads, file validation, CDN delivery
- ✅ **Real-time Features** - Live collaboration, chat, notifications
- ✅ **API Endpoints** - All Edge Functions and API routes
- ✅ **Security Features** - RLS policies, input validation, authentication checks

## Test Types

### 🧪 Unit Tests (`/unit`)
- **Components**: Individual component testing (React Testing Library)
- **Hooks**: Custom hooks testing
- **Utils**: Utility function testing
- **Contexts**: Context provider testing

### 🔗 Integration Tests (`/integration`)
- **Auth Flow**: Authentication integration testing
- **Content Management**: Content CRUD operations
- **Music System**: Audio player integration
- **Collaboration**: Real-time collaboration features
- **Payment Processing**: Stripe/payment integration
- **Room Interactions**: 3D room and object interactions

### 🎭 E2E Tests (`/e2e`)
- **User Journeys**: Complete user workflow testing
- **Creator Workflows**: Content creation and publishing
- **Collaborative Features**: Multi-user interaction scenarios
- **Cross-browser**: Chrome, Firefox, Safari, Mobile

### 🛡️ API Tests (`/api`)
- **Edge Functions**: All Supabase Edge Function testing
- **Database**: CRUD operations and data integrity
- **Storage**: File upload/download operations
- **Real-time**: WebSocket and real-time features

### 🎨 UI Tests (`/ui`)
- **Visual Regression**: Screenshot comparison testing
- **Theme System**: Visual theme switching
- **Responsive Design**: Multi-device layout testing
- **Animation**: Motion and transition testing

### ⚡ Performance Tests (`/performance`)
- **Load Testing**: High-traffic simulation
- **Audio Streaming**: Music player performance
- **3D Rendering**: Virtual room performance
- **Bundle Analysis**: Code splitting and optimization

### 🔒 Security Tests (`/security`)
- **Authentication**: Login/logout security
- **Authorization**: Permission and access control
- **Input Validation**: XSS and injection prevention
- **File Upload**: Malicious file protection

### ♿ Accessibility Tests (`/accessibility`)
- **WCAG Compliance**: Web accessibility standards
- **Keyboard Navigation**: Non-mouse interaction
- **Screen Reader**: Assistive technology support
- **Color Contrast**: Visual accessibility

### 📱 Mobile/Responsive Tests (`/mobile`)
- **Cross-Device**: Phone, tablet, desktop testing
- **Touch Interactions**: Mobile-specific gestures
- **PWA Features**: Progressive web app functionality
- **Offline Mode**: Offline-first features

### 🎵 Audio/Media Tests (`/media`)
- **Music Player**: Audio playback and controls
- **File Streaming**: Media streaming performance
- **Format Support**: Multiple audio/video formats
- **Real-time Audio**: Live collaboration features

## Directory Structure

```
tests/
├── fixtures/                    # Test data and mock files
│   ├── users.ts                # Mock user profiles
│   ├── content.ts              # Mock content and media
│   ├── rooms.ts                # Mock virtual room data
│   └── audio.ts                # Mock audio tracks and playlists
├── helpers/                     # Test utility functions
│   ├── auth-helpers.ts         # Authentication test utilities
│   ├── db-helpers.ts           # Database test utilities
│   ├── media-helpers.ts        # Media upload/download utilities
│   └── room-helpers.ts         # Virtual room test utilities
├── mocks/                       # Mock implementations
│   ├── supabase.ts             # Supabase client mocks
│   ├── three.ts                # Three.js mocks
│   ├── audio.ts                # Web Audio API mocks
│   └── storage.ts              # Storage API mocks
├── unit/                        # Unit tests
├── integration/                 # Integration tests
├── e2e/                        # End-to-end tests
├── api/                        # API tests
├── ui/                         # UI/Visual tests
├── performance/                # Performance tests
├── security/                   # Security tests
├── accessibility/              # Accessibility tests
├── mobile/                     # Mobile/responsive tests
└── media/                      # Audio/media tests
```

## Running Tests

### Quick Start
```bash
# Install dependencies
npm install

# Run all tests
npm run test:all

# Run specific test types
npm run test:unit
npm run test:integration  
npm run test:e2e
npm run test:api
npm run test:security
npm run test:performance
```

### Development Workflow
```bash
# Watch mode for active development
npm run test:watch

# Coverage reporting
npm run test:coverage

# UI test runner
npm run test:ui

# Specific test files
npm run test -- --run profile
npm run test -- --run music-player
```

### CI/CD Integration
```bash
# Full CI pipeline
npm run ci:test

# Security scanning
npm run test:security:full

# Performance benchmarking
npm run test:performance:benchmark
```

## Configuration Files

- `vitest.config.ts` - Unit/Integration test configuration
- `playwright.config.ts` - E2E test configuration
- `jest-puppeteer.config.js` - Performance test configuration
- `axe.config.js` - Accessibility test configuration

## Test Data & Fixtures

All test data follows YourSpace's vaporwave/cyberpunk aesthetic:
- **User Profiles**: Realistic creator personas with various specialties
- **Content**: Sample audio, visual art, and multimedia content
- **Rooms**: Pre-configured virtual spaces with different themes
- **Interactions**: Realistic social interaction patterns

## Contribution Guidelines

1. **Feature Coverage**: All new features must include comprehensive tests
2. **Test Types**: Include unit, integration, and E2E tests for major features
3. **Documentation**: Update test documentation when adding new test suites
4. **Performance**: Ensure tests run efficiently and don't slow down CI/CD
5. **Realistic Data**: Use authentic, YourSpace-themed test data

## Test Quality Standards

- **Coverage Requirements**: 80% minimum for all code paths
- **Performance Targets**: Tests should complete within CI time limits
- **Reliability**: Tests should be deterministic and not flaky
- **Maintainability**: Tests should be easy to update as features evolve

## Debugging Tests

### Unit/Integration Tests
```bash
# Debug with Vitest UI
npm run test:ui

# Debug specific tests
npm run test:debug -- ProfileBuilder.test.tsx
```

### E2E Tests
```bash
# Debug with Playwright UI
npm run e2e:ui

# Debug with headed browser
npm run e2e:debug
```

### API Tests
```bash
# Test specific endpoints
npm run test:api -- content-upload

# Test with verbose logging
npm run test:api:verbose
```

---

**Production-Ready Testing Infrastructure for YourSpace Creative Labs**

*Comprehensive coverage of all planned features and roadmap items*
