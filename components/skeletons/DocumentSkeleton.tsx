const DocumentSkeleton = () => {
    return (
      <div className="animate-pulse">
        {/* Título */}
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-8"></div>
        
        {/* 20 líneas de texto */}
        {[...Array(20)].map((_, index) => (
          <div key={index} className="space-y-3 mb-4">
            {/* Línea con ancho variable para simular texto real */}
            <div 
              className="h-4 bg-gray-200 rounded" 
              style={{ 
                width: `${Math.random() * (95 - 70) + 70}%`
              }}
            ></div>
          </div>
        ))}
      </div>
    );
  };
  
  export default DocumentSkeleton;