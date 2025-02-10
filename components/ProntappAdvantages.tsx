import { 
    FaMoneyBillWave, 
    FaShieldAlt, 
    FaExchangeAlt,
    FaBoxOpen
  } from 'react-icons/fa';
  import { FaTruckFast } from "react-icons/fa6";
  
  const advantages = [
    {
      icon: FaTruckFast,
      lightText: "Envío a",
      boldText: "todo el país"
    },
    {
      icon: FaMoneyBillWave,
      lightText: "Pago",
      boldText: "contraentrega",
      highlight: true
    },
    {
      icon: FaShieldAlt,
      lightText: "Compra",
      boldText: "Segura y Garantizada"
    },
    {
      icon: FaExchangeAlt,
      lightText: "Devoluciones",
      boldText: "Sin problemas"
    },
    {
      icon: FaBoxOpen,
      lightText: "1000 +",
      boldText: "Productos vendidos"
    }
  ];
  
  const ProntappAdvantages = () => {
    return (
      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
            {advantages.map((item, index) => (
              <div 
                key={index} 
                className={`
                  flex items-center justify-center lg:justify-start space-x-3 
                  border border-white/20 rounded-lg p-3 transition-all duration-300
                  hover:border-white/40 
                  ${item.highlight ? 
                    'bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 border-none shadow-lg shadow-orange-500/30' 
                    : 'hover:bg-white/5'
                  }
                `}
              >
                <item.icon 
                  className={`text-3xl flex-shrink-0 ${
                    item.highlight ? 'text-white' : 'text-orange-500'
                  }`} 
                />
                <div className="flex flex-col">
                  <span className={`font-light text-sm ${
                    item.highlight ? 'text-white/90' : ''
                  }`}>
                    {item.lightText}
                  </span>
                  <span className={`font-bold text-sm ${
                    item.highlight ? 'text-white' : ''
                  }`}>
                    {item.boldText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default ProntappAdvantages;