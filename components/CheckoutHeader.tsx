import Logo from '@/components/Logo';
import { FaLock } from 'react-icons/fa';

const CheckoutHeader = () => {
  return (
    <header className="bg-black py-4 px-6 flex justify-between items-center">
      <Logo />
      <div className="flex items-center">
        <FaLock className="text-green-500 mr-2" size={20} />
        <span className="text-white">Pago seguro</span>
      </div>
    </header>
  );
};

export default CheckoutHeader;