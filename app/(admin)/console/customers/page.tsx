"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import UserCard from '@/app/(admin)/components/Users/UserCard';
import CreateUserForm from '@/app/(admin)/components/Users/CreateUserForm';
import EditUserForm from '@/app/(admin)/components/Users/EditUserForm';
import LoadMoreData from '@/app/(admin)/components/LoadMoreData';
import Toaster from '@/components/Toaster';
import { 
    UserListItem, 
    UserForEdit,
    fetchUsersServer,
    fetchUserDetailsServer,
    toggleUserActiveServer
} from '@/app/(admin)/actions/users';

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

    const loadUsers = useCallback(async (loadMore = false, search = '') => {
        setIsLoading(true);
        const currentPage = loadMore ? pageRef.current + 1 : 1;
        try {
            const data = await fetchUsersServer(currentPage, search);
            
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
        loadUsers(false, searchTerm);
    }, [loadUsers, searchTerm]);

    const handleCreateUser = () => {
        setShowCreateForm(true);
    };

    const handleEditUser = async (user: UserListItem) => {
        try {
            const userData = await fetchUserDetailsServer(user.id);
            setEditingUser(userData);
        } catch (error) {
            console.error('Error fetching user details:', error);
            showToasterMessage('Error al obtener los detalles del usuario', 'error');
        }
    };

    const handleCloseForm = () => {
        setShowCreateForm(false);
        setEditingUser(null);
        loadUsers(false, searchTerm);
    };

    const handleLoadMore = () => {
        loadUsers(true, searchTerm);
    };

    const handleToggleActive = async (userId: string, currentStatus: boolean) => {
        try {
            const success = await toggleUserActiveServer(userId);
            
            if (success) {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, is_active: !currentStatus } : user
                ));
                showToasterMessage(
                    `Usuario ${currentStatus ? 'desactivado' : 'activado'} exitosamente`,
                    'success'
                );
            } else {
                throw new Error('Failed to toggle user status');
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
            showToasterMessage('Error al cambiar el estado del usuario', 'error');
        }
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
                    onClick={() => loadUsers(false, searchTerm)}
                    className="bg-blue-500 text-white p-2 rounded mr-2"
                >
                    <FaSearch />
                </button>
                <button
                    onClick={() => {
                        setSearchTerm('');
                        loadUsers(false, '');
                    }}
                    className="bg-gray-300 text-gray-700 p-2 rounded"
                >
                    Resetear
                </button>
            </div>
            <div className="space-y-4">
                {isLoading && users.length === 0 ? (
                    <p>Cargando usuarios...</p>
                ) : users.length === 0 ? (
                    <p>No hay usuarios para mostrar</p>
                ) : (
                    users.map(user => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onEdit={() => handleEditUser(user)}
                            onToggleActive={() => handleToggleActive(user.id, user.is_active)}
                        />
                    ))
                )}
            </div>
            {users.length > 0 && (
                <LoadMoreData onLoadMore={handleLoadMore} isLoading={isLoading} hasMore={hasMore} />
            )}
            {showCreateForm && (
                <CreateUserForm onClose={handleCloseForm} showToasterMessage={showToasterMessage} />
            )}
            {editingUser && (
                <EditUserForm 
                    user={editingUser} 
                    onClose={handleCloseForm} 
                    showToasterMessage={showToasterMessage} 
                />
            )}
        </div>
    );
};

export default UsersAdminPage;