import React from 'react';
import { FaPhoneAlt, FaFacebookF, FaTwitter } from 'react-icons/fa';
import HighlightCategoriesFooter from '@/components/HighlightCategoriesFooter';
import DownloadAppCard from './DownloadAppCard';
import PaySecureText from './SecurePaymentText';
import { getPublicHighlightCategories } from '@/lib/dataLayer';
import Link from "next/link";

const Footer: React.FC = async () => {
  const highlightCategories = await getPublicHighlightCategories();
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Columna 1 */}
          <div className="lg:col-span-1">
            <div className="mt-4 flex items-start">
              <FaPhoneAlt className="text-orange-500 text-5xl mr-4" />
              <div>
                <p className="text-sm">Tienes preguntas ? Llámanos!</p>
                <p className="text-xl font-bold">(57) 8001-8588</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="font-bold mb-2">Información de Contacto</h3>
              <p className="text-sm">Dirección bodegas bogotá carrera 12 09 39</p>
              <div className="mt-4 flex space-x-4">
                <FaFacebookF className="text-2xl" />
                <FaTwitter className="text-2xl" />
              </div>
            </div>
          </div>

          {/* Columna 2 */}
          <HighlightCategoriesFooter categories={highlightCategories} />

          {/* Columna 3 */}
          <div className='hidden sm:block'>
            <DownloadAppCard />
          </div>

          {/* Columna 4 */}
          <div>
            <h3 className="font-bold mb-4">Zona de Clientes</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/panel/account">Mi Cuenta</Link></li>
              <li><Link href="/panel/orders">Pedidos</Link></li>
              <li><Link href="/panel/orders">Seguimiento de Guías</Link></li>
              <li><Link href="/devoluciones-cambios">Devoluciones y Cambios</Link></li>
              <li><Link href="/pqrs">PQR's</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fila 2 */}
      <div className="bg-gray-900 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-sm">&copy; Prontapp - Todos los derechos reservados</p>
          <PaySecureText />
        </div>
      </div>
    </footer>
  );
};

export default Footer;