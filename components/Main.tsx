// components/Main.tsx
import React from 'react';

interface MainProps {
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <main className="min-h-[calc(100vh-200px)]">
      {children}
    </main>
  );
};

export default Main;