"use client";

import React, { useCallback, useState } from "react";
import { useStore } from "@/stores/cartStore";
import AddressForm from "@/components/panel/AddressForm";
import type { Address } from "@/stores/cartStore";
import { addNewAddress, setDefaultAddress } from "@/app/actions/addresses";

function normalizeAddress(rawAddress: string, rawComplement?: string | null) {
  // si el complemento viene separado, úsalo
  if (rawComplement && rawComplement.trim()) {
    return { address: rawAddress, addressComplement: rawComplement };
  }

  // si viene codificado con "~" (tu AddressForm arma address con "~") :contentReference[oaicite:2]{index=2}
  if (rawAddress?.includes("~")) {
    const [addr, comp] = rawAddress.split("~");
    return { address: (addr ?? "").trim(), addressComplement: (comp ?? "").trim() };
  }

  return { address: rawAddress, addressComplement: "" };
}

const ModalSetAddress: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const {
    isOpen,
    close,
    setShippingAddress,
    addAddress,
  } = useStore((state) => ({
    isOpen: state.isSetAddressModalOpen,
    close: state.closeSetAddressModal,
    setShippingAddress: state.setShippingAddress,
    addAddress: state.addAddress,
  }));

  const handleSave = useCallback(
    async (newAddress: Omit<Address, "id">) => {
      setSaving(true);
      setErrorMsg("");

      try {
        // 1) Persistir en backend
        const created = await addNewAddress(newAddress);
        if (!created) {
          setErrorMsg("No se pudo guardar la dirección. Revisa que estés logueado e inténtalo nuevamente.");
          return;
        }

        // 2) (opcional) dejarla como default
        try {
          if (created.id) await setDefaultAddress(created.id);
        } catch {
          // no bloqueamos el flujo si falla el default
        }

        // 3) actualizar store de direcciones (opcional pero útil)
        try {
          await addAddress(created);
        } catch {
          //si falla, igual seguimos: shippingAddress es lo importante para checkout
        }

        // 4) Setear shippingAddress (esto también cierra el modal en tu store) :contentReference[oaicite:3]{index=3}
        const city_id = created.city_id ?? newAddress.city_id;
        const cityName = created.cityName ?? newAddress.cityName;

        const rawAddress = created.address ?? newAddress.address;
        const rawComplement = created.addressComplement ?? newAddress.addressComplement;

        const { address, addressComplement } = normalizeAddress(rawAddress, rawComplement);

        setShippingAddress({
          city_id,
          cityName,
          address,
          addressComplement,
        });
      } catch (e) {
        console.error(e);
        setErrorMsg("Ocurrió un error guardando la dirección. Revisa la consola y la pestaña Network.");
      } finally {
        setSaving(false);
      }
    },
    [addAddress, setShippingAddress]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-4">
        {errorMsg ? (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        ) : null}

        {/* AddressForm ya trae sus campos y botón Guardar */}
        <div className={saving ? "pointer-events-none opacity-70" : ""}>
          <AddressForm onCancel={close} onSave={handleSave} />
        </div>

        {saving ? (
          <div className="mt-3 text-center text-sm text-gray-500">Guardando dirección...</div>
        ) : null}
      </div>
    </div>
  );
};

export default ModalSetAddress;
