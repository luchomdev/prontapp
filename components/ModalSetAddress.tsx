"use client";

import React from "react";
import { useStore } from "@/stores/cartStore";
import AddressForm from "@/components/panel/AddressForm";

export default function ModalSetAddress() {
  const isOpen = useStore((s) => s.isSetAddressModalOpen);

  const close = React.useCallback(() => {
    const st: any = useStore.getState();

    // Si existe la acción en tu store, úsala
    if (typeof st.closeSetAddressModal === "function") {
      st.closeSetAddressModal();
      return;
    }

    // Fallback seguro (zustand expone setState)
    (useStore as any).setState({ isSetAddressModalOpen: false });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50">
      {/* click fuera para cerrar */}
      <button
        aria-label="Cerrar"
        className="absolute inset-0 cursor-default"
        onClick={close}
        type="button"
      />

      {/* contenido */}
      <div className="relative z-[81] w-full max-w-lg m-4">
        {/* OJO: AddressForm ya trae su propio header/botón cancelar en tu proyecto */}
        <AddressForm
          onCancel={close}
          onSave={() => {
            // al guardar, cerramos el modal
            close();
          }}
        />
      </div>
    </div>
  );
}
