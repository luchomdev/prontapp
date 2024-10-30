"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import UserCard from '@/app/(admin)/components/Users/UserCard';
import CreateUserForm from '@/app/(admin)/components/Users/CreateUserForm';
import EditUserForm from '@/app/(admin)/components/Users/EditUserForm';
import LoadMoreData from '@/app/(admin)/components/LoadMoreData';
import Toaster from '@/components/Toaster';

interface UserListItem {
    id: string;
    name: string;
    last_name: string;
    email: string;
    user_role: string;
    is_active: boolean;
}

interface CustomerInfo {
    identification: string | null;
    phone: string | null;
    address: string | null;
    cityId: number | null,
    cityText: string | null;
}

interface UserForEdit {
    id: string;
    name: string;
    lastName: string;
    email: string;
    userRole: string;
    isActive: boolean;
    customerInfo: CustomerInfo
}

const UsersAdminPage = () => {
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingUser, setEditingUser] = useState<UserForEdit | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
    const [showToaster, setShowToaster] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const pageRef = useRef(page);

    useEffect(() => {
        pageRef.current = page;
    }, [page]);

    const showToasterMessage = useCallback((message: string, type: 'success' | 'error') => {
        setToasterMessage(message);
        setToasterType(type);
        setShowToaster(true);
    }, []);

    const fetchUsers = useCallback(async (loadMore = false, search = '') => {
        setIsLoading(true);
        const currentPage = loadMore ? pageRef.current + 1 : 1;
        try {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                ...(search && { search })
            });
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?${queryParams}`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (loadMore) {
                setUsers(prevUsers => [...prevUsers, ...data.users]);
                setPage(currentPage);
            } else {
                setUsers(data.users);
                setPage(1);
            }
            setHasMore(data.users.length === data.limit);
        } catch (error) {
            console.error('Error fetching users:', error);
            showToasterMessage('Error al cargar los usuarios', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToasterMessage]);

    useEffect(() => {
        fetchUsers(false, searchTerm);
    }, [fetchUsers, searchTerm]);

    const handleCreateUser = () => {
        setShowCreateForm(true);
    };

    const handleEditUser = (user: UserListItem) => {
        fetchUserDetails(user.id);
    };

    const fetchUserDetails = async (userId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const userData: UserForEdit = await response.json();
                setEditingUser(userData);
            } else {
                showToasterMessage('Error al obtener los detalles del usuario', 'error');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            showToasterMessage('Error al conectar con el servidor', 'error');
        }
    };

    const handleCloseForm = () => {
        setShowCreateForm(false);
        setEditingUser(null);
        fetchUsers(false, searchTerm);
    };

    const handleLoadMore = () => {
        fetchUsers(true, searchTerm);
    };

    const handleToggleActive = async (userId: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/toggle-active`, {
                method: 'PATCH',
                credentials: 'include',
            });

            if (response.ok) {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, is_active: !currentStatus } : user
                ));
                showToasterMessage(`Usuario ${currentStatus ? 'desactivado' : 'activado'} exitosamente`, 'success');
            } else {
                showToasterMessage('Error al cambiar el estado del usuario', 'error');
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
            showToasterMessage('Error al conectar con el servidor', 'error');
        }
    };

    const handleSearch = () => {
        fetchUsers(false, searchTerm);
    };

    const handleResetSearch = () => {
        setSearchTerm('');
        fetchUsers(false, '');
    };

    return (
        <div className="p-6">
            {showToaster && (
                <Toaster
                    message={toasterMessage}
                    type={toasterType}
                    onClose={() => setShowToaster(false)}
                />
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-sm font-bold">Administrar usuarios administrativos / clientes</h1>
                <button
                    onClick={handleCreateUser}
                    className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded flex items-center"
                >
                    <FaPlus size={20} className="mr-2" /> Agregar usuario
                </button>
            </div>
            <div className="mb-4 flex items-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar usuarios..."
                    className="border p-2 mr-2 rounded"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white p-2 rounded mr-2"
                >
                    <FaSearch />
                </button>
                <button
                    onClick={handleResetSearch}
                    className="bg-gray-300 text-gray-700 p-2 rounded"
                >
                    Resetear
                </button>
            </div>
            <div className="space-y-4">
                {users.map(user => (
                    <UserCard
                        key={user.id}
                        user={user}
                        onEdit={() => handleEditUser(user)}
                        onToggleActive={() => handleToggleActive(user.id, user.is_active)}
                    />
                ))}
            </div>
            <LoadMoreData onLoadMore={handleLoadMore} isLoading={isLoading} hasMore={hasMore} />
            {showCreateForm && (
                <CreateUserForm onClose={handleCloseForm} showToasterMessage={showToasterMessage} />
            )}
            {editingUser && (
                <EditUserForm user={editingUser} onClose={handleCloseForm} showToasterMessage={showToasterMessage} />
            )}
        </div>
    );
};

export default UsersAdminPage;