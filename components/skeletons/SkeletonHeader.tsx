const HeaderSkeleton = () => {
    return (
      <header className="w-full animate-pulse">
        {/* Barra superior */}
        <div className="bg-gray-300 h-10 flex items-center justify-between px-4">
          <div className="flex items-center">
            <div className="w-6 h-4 bg-gray-400 mr-2"></div>
            <div className="h-4 w-20 bg-gray-400 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-32 bg-gray-400 rounded mr-4"></div>
            <div className="h-4 w-40 bg-gray-400 rounded"></div>
          </div>
        </div>
  
        {/* Área principal */}
        <div className="bg-gray-800 h-[80px] sm:h-[90px] md:h-[100px] flex items-center justify-between px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-600 rounded mr-4"></div>
            <div className="w-24 h-8 bg-gray-600 rounded"></div>
          </div>
  
          {/* Barra de búsqueda */}
          <div className="hidden md:block w-1/2 h-10 bg-gray-600 rounded"></div>
  
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-600 rounded-full mr-4"></div>
            <div className="w-6 h-6 bg-gray-600 rounded-full mr-4"></div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-600 rounded-full mr-2"></div>
              <div className="w-16 h-4 bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
  
        {/* Barra de categorías (visible en pantallas grandes) */}
        <div className="bg-gray-200 h-12 items-center px-4 hidden lg:flex">
          <div className="flex items-center mr-4">
            <div className="w-6 h-6 bg-gray-400 rounded mr-2"></div>
            <div className="w-20 h-4 bg-gray-400 rounded"></div>
          </div>
          <div className="flex space-x-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="w-24 h-4 bg-gray-400 rounded"></div>
            ))}
          </div>
        </div>
      </header>
    );
  };
  
  export default HeaderSkeleton;