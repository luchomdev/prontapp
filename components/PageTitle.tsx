import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
  return (
    <div className="w-full bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">{title}</h1>
        {subtitle && (
          <p className="text-center text-gray-600 mt-2 text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageTitle;