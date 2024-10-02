import React from 'react';

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-orange-500 pb-2">
      {title}
    </h1>
  );
};

export default PageTitle;