"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ConfigList from '@/app/(admin)/components/config/ConfigList';
import EditConfigModal from '@/app/(admin)/components/config/EditConfigModal';
import NewConfigForm from '@/app/(admin)/components/config/NewConfigForm';
import Toaster from '@/components/Toaster';
import { Config, fetchConfigs, updateConfig, createConfig } from '@/app/(admin)/actions/config';

const ConfigPage: React.FC = () => {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);
  const [showNewConfigForm, setShowNewConfigForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const loadConfigs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchConfigs();
      setConfigs(data);
    } catch (error) {
      console.error('Error fetching configs:', error);
      showToast('Error al cargar las configuraciones', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const handleEditConfig = (config: Config) => {
    setEditingConfig(config);
  };

  const handleUpdateConfig = async (updatedConfig: Config) => {
    try {
      const success = await updateConfig(updatedConfig);
      
      if (success) {
        showToast('Configuración actualizada exitosamente', 'success');
        setEditingConfig(null);
        loadConfigs();
      } else {
        throw new Error('Failed to update config');
      }
    } catch (error) {
      console.error('Error updating config:', error);
      showToast('Error al actualizar la configuración', 'error');
    }
  };

  const handleCreateConfig = async (newConfig: Config) => {
    try {
      const success = await createConfig(newConfig);
      
      if (success) {
        showToast('Configuración creada exitosamente', 'success');
        setShowNewConfigForm(false);
        loadConfigs();
      } else {
        throw new Error('Failed to create config');
      }
    } catch (error) {
      console.error('Error creating config:', error);
      showToast('Error al crear la configuración', 'error');
    }
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