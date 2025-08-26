import React from 'react';

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <main className="flex w-full h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-200 dark:border-gray-800">
      {children}
    </main>
  );
};

export default MainContainer;