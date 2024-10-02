"use client"
import Link from 'next/link';
import { IoChevronBackSharp } from "react-icons/io5";
import { useParams } from 'next/navigation';
import CreateBannerForm from '@/app/(admin)/components/banners/CreateBannerForm';
import EditBannerForm from '@/app/(admin)/components/banners/EditBannerForm';

const BannerFormPage = () => {
    const params = useParams();
    const bannerId = params.id?.[0];

    return (
        <div className="p-6">
            <h1 className="flex items-center text-sm font-bold mb-6">
                <Link href={`/console/banners`} className='mr-2 bg-blue-400 hover:bg-blue-500 text-white flex items-center space-x-1 rounded p-1 '>
                    <IoChevronBackSharp size={20} />
                    <span>Volver</span>
                </Link>
                {bannerId ? 'Editar Banner' : 'Crear Nuevo Banner'}
            </h1>
            {bannerId ? <EditBannerForm bannerId={bannerId} /> : <CreateBannerForm />}
        </div>
    );
};

export default BannerFormPage;