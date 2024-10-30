"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ConfigList from '@/app/(admin)/components/config/ConfigList';
import EditConfigModal from '@/app/(admin)/components/config/EditConfigModal';
import NewConfigForm from '@/app/(admin)/components/config/NewConfigForm';
import Toaster from '@/components/Toaster';

interface Config {
  key: string;
  value: string | number;
}

const ConfigPage: React.FC = () => {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);
  const [showNewConfigForm, setShowNewConfigForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const fetchConfigs = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch configs');
      const data = await response.json();
      setConfigs(data);
    } catch (error) {
      console.error('Error fetching configs:', error);
      showToast('Error al cargar las configuraciones', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const handleEditConfig = (config: Config) => {
    setEditingConfig(config);
  };

  const handleUpdateConfig = async (updatedConfig: Config) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedConfig)
      });
      if (!response.ok) throw new Error('Failed to update config');
      showToast('Configuración actualizada exitosamente', 'success');
      setEditingConfig(null);
      fetchConfigs();
    } catch (error) {
      console.error('Error updating config:', error);
      showToast('Error al actualizar la configuración', 'error');
    }
  };

  const handleCreateConfig = async (newConfig: Config) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newConfig)
      });
      if (!response.ok) throw new Error('Failed to create config');
      showToast('Configuración creada exitosamente', 'success');
      setShowNewConfigForm(false);
      fetchConfigs();
    } catch (error) {
      console.error('Error creating config:', error);
      showToast('Error al crear la configuración', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando configuraciones...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Configuración Global</h1>
        <button
          onClick={() => setShowNewConfigForm(true)}
          className="text-sm bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600"
        >
          Nueva Config
        </button>
      </div>
      
      <ConfigList configs={configs} onEdit={handleEditConfig} />
      
      {editingConfig && (
        <EditConfigModal
          config={editingConfig}
          onUpdate={handleUpdateConfig}
          onClose={() => setEditingConfig(null)}
        />
      )}
      
      {showNewConfigForm && (
        <NewConfigForm
          onCreate={handleCreateConfig}
          onCancel={() => setShowNewConfigForm(false)}
        />
      )}
      
      {toastMessage && (
        <Toaster
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default ConfigPage;