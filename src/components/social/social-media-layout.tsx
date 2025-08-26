import React from 'react';
import LeftSidebar from './left-sidebar';
import Timeline from './timeline';
import RightSidebar from './right-sidebar';
import MainContainer from './main-container';

const SocialMediaLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 xl:w-80">
          <LeftSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0 max-w-2xl">
          <MainContainer>
            <Timeline />
          </MainContainer>
        </div>
        
        {/* Right Sidebar */}
        <div className="hidden xl:block w-80">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default SocialMediaLayout;