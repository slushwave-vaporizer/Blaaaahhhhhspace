import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { GlobalMusicProvider } from './components/music/GlobalMusicProvider';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Import all pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DiscordCallbackPage } from './pages/auth/DiscordCallbackPage';
import { DiscoverPage } from './pages/discover/DiscoverPage';
import { ArtistDiscoveryPage } from './pages/discover/ArtistDiscoveryPage';
import { CreatePage } from './pages/create/CreatePage';
import { CollaboratePage } from './pages/collaborate/CollaboratePage';
import { MarketplacePage } from './pages/marketplace/MarketplacePage';
import { VirtualRoomsPage } from './pages/rooms/VirtualRoomsPage';
import { MyVirtualRoomsPage } from './pages/rooms/MyVirtualRoomsPage';
import { VirtualRoomEditorPage } from './pages/rooms/VirtualRoomEditorPage';
import { VirtualRoomViewPage } from './pages/rooms/VirtualRoomViewPage';
import { CreatorStudioPage } from './pages/studio/CreatorStudioPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { SettingsPage } from './pages/settings/SettingsPage';
import SocialFeedPage from './pages/social/SocialFeedPage';
import MessagesPage from './pages/messages/MessagesPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <GlobalMusicProvider>
            <div className="App">
              <Routes>
                {/* Auth routes without layout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/discord/callback" element={<DiscordCallbackPage />} />

                {/* Main app routes with layout */}
                <Route path="/" element={
                  <Layout>
                    <HomePage />
                  </Layout>
                } />
                
                <Route path="/discover" element={
                  <Layout>
                    <DiscoverPage />
                  </Layout>
                } />
                
                <Route path="/social" element={
                  <Layout>
                    <SocialFeedPage />
                  </Layout>
                } />
                
                <Route path="/discover-artists" element={
                  <Layout>
                    <ArtistDiscoveryPage />
                  </Layout>
                } />
                
                <Route path="/marketplace" element={
                  <Layout>
                    <MarketplacePage />
                  </Layout>
                } />
                
                <Route path="/rooms" element={
                  <Layout>
                    <VirtualRoomsPage />
                  </Layout>
                } />
                
                <Route path="/rooms/:id" element={
                  <Layout>
                    <VirtualRoomViewPage />
                  </Layout>
                } />

                {/* Protected routes */}
                <Route path="/create" element={
                  <ProtectedRoute>
                    <Layout>
                      <CreatePage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/collaborate" element={
                  <ProtectedRoute>
                    <Layout>
                      <CollaboratePage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Layout>
                      <MessagesPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/rooms/manage" element={
                  <ProtectedRoute>
                    <Layout>
                      <MyVirtualRoomsPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/rooms/edit/:id" element={
                  <ProtectedRoute>
                    <Layout>
                      <VirtualRoomEditorPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/studio" element={
                  <ProtectedRoute>
                    <Layout>
                      <CreatorStudioPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Layout>
                      <AnalyticsPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <SettingsPage />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </GlobalMusicProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;