import Link from 'next/link';
import EditProductForm from '@/app/(admin)/components/Products/EditProductForm';

const EditProductPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-sm font-bold">Editar Producto</h1>
        <Link 
          href="/console/products" 
          className="bg-red-400 hover:bg-red-600 text-white text-sm font-bold py-1 px-2 rounded"
        >
          Cancelar
        </Link>
      </div>
      <EditProductForm />
    </div>
  );
};

export default EditProductPage;