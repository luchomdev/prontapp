"use client"
import Link from 'next/link';
import { IoChevronBackSharp } from "react-icons/io5";
import { useParams } from 'next/navigation';
import EditNotificationForm from '@/app/(admin)/components/notifications/EditNotificationForm';

const EditCampaignPage = () => {
  const params = useParams();
  const campaignId = params.id as string;

  return (
    <div className="p-6">
      <h1 className="flex items-center text-sm font-bold mb-6">
        <Link href={`/console/notifications`} className='mr-2 bg-blue-400 hover:bg-blue-500 text-white flex items-center space-x-1 rounded p-1'>
          <IoChevronBackSharp size={20} />
          <span>Volver</span>
        </Link>
        Editar Campaña de Notificación
      </h1>
      <EditNotificationForm campaignId={campaignId} />
    </div>
  );
};

export default EditCampaignPage;