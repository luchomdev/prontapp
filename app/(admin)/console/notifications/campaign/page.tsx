"use client"
import Link from 'next/link';
import { IoChevronBackSharp } from "react-icons/io5";
import CreateNotificationForm from '@/app/(admin)/components/notifications/CreateNotificationForm';

const CreateCampaignPage = () => {
  return (
    <div className="p-6">
      <h1 className="flex items-center text-sm font-bold mb-6">
        <Link href={`/console/notifications`} className='mr-2 bg-blue-400 hover:bg-blue-500 text-white flex items-center space-x-1 rounded p-1 '>
          <IoChevronBackSharp size={20} />
          <span>Volver</span>
        </Link>
        Crear Nueva Campaña de Notificación
      </h1>
      <CreateNotificationForm />
    </div>
  );
};

export default CreateCampaignPage;