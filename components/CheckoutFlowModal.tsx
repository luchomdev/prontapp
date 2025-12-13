"use client";

import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTimes, FaUser, FaMapMarkerAlt, FaCheck, FaMapMarkedAlt } from "react-icons/fa";

import { useStore } from "@/stores/cartStore";
import SigninForm from "@/components/auth/SigninForm";
import RegisterForm from "@/components/auth/RegisterForm";

import { checkAuth, validateEmailExists } from "@/app/actions/auth";
import { fetchAddresses, setDefaultAddress } from "@/app/actions/addresses";
import { validateEmail } from "@/lib/validator";
import { useHydration } from "@/hooks/useHydration";

import type { Address } from "@/stores/cartStore";

interface CheckoutFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "email" | "signin" | "registerPrompt" | "register" | "address" | "confirmation";
type Stage = "identification" | "address" | "confirmation";

const CheckoutFlowModal: React.FC<CheckoutFlowModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const hydrated = useHydration();

  const [currentStep, setCurrentStep] = useState<Step>("email");

  // ✅ evita flash: cuando abre, primero bloqueamos UI y luego resolvemos auth
  const [authChecked, setAuthChecked] = useState(false);
  const [isSyncingAuth, setIsSyncingAuth] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isNewAddress, setIsNewAddress] = useState(false);

  const {
    isAuthenticated,
    user,
    setAuthenticated,
    setUser,
    shippingAddress,
    setShippingAddress,
    isSetAddressModalOpen,
  } = useStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    setAuthenticated: state.setAuthenticated,
    setUser: state.setUser,
    shippingAddress: state.shippingAddress,
    setShippingAddress: state.setShippingAddress,
    isSetAddressModalOpen: state.isSetAddressModalOpen,
  }));

  // ✅ signin/register siguen siendo “Identificación”
  const stage: Stage = useMemo(() => {
    if (currentStep === "address") return "address";
    if (currentStep === "confirmation") return "confirmation";
    return "identification";
  }, [currentStep]);

  // ✅ CLAVE: antes del primer paint al abrir modal, fuerza estado "cargando"
  useLayoutEffect(() => {
    if (!isOpen) return;
    // bloquea UI inmediatamente (antes de pintar)
    setAuthChecked(false);
    setIsSyncingAuth(true);
    // opcional: evita que quede un paso viejo al abrir
    setCurrentStep("email");
  }, [isOpen]);

  // ✅ Luego (async) resolvemos auth real por cookie
  useEffect(() => {
    if (!isOpen) return;
    if (!hydrated) return;

    const init = async () => {
      try {
        // Si el store YA sabe que está autenticado, entra a dirección
        if (isAuthenticated && user) {
          setCurrentStep("address");
          return;
        }

        // Validar cookie httpOnly con backend
        const res = await checkAuth();

        if (res.isAuthenticated && res.user) {
          setUser(res.user);
          setAuthenticated(true);
          setCurrentStep("address"); // ✅ siempre dirección
          return;
        }

        // No autenticado -> email
        setCurrentStep("email");
        setEmail("");
        setEmailError("");
        setIsValidating(false);
      } finally {
        setIsSyncingAuth(false);
        setAuthChecked(true);
      }
    };

    init();
  }, [isOpen, hydrated, isAuthenticated, user, setAuthenticated, setUser]);

  // ✅ cargar direcciones al entrar a address
  useEffect(() => {
    const loadAddresses = async () => {
      if (currentStep !== "address") return;
      if (!isAuthenticated) return;

      setIsLoadingAddresses(true);
      try {
        const addressesData = await fetchAddresses();
        setSavedAddresses(addressesData);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [currentStep, isAuthenticated]);

  // ✅ si se agregó nueva dirección desde ModalSetAddress, avanzar
  useEffect(() => {
    if (!isSetAddressModalOpen && shippingAddress && currentStep === "address" && isNewAddress) {
      setCurrentStep("confirmation");
      setIsNewAddress(false);
    }
  }, [isSetAddressModalOpen, shippingAddress, currentStep, isNewAddress]);

  // ✅ Escape cierra solo en identificación
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stage === "identification") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [stage, onClose]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setIsValidating(true);

    try {
      if (!validateEmail(email)) {
        setEmailError("Por favor, ingrese un email válido");
        return;
      }

      const result = await validateEmailExists(email);

      if (result.error) {
        setEmailError(result.error);
        return;
      }

      if (result.exists) {
        setCurrentStep("signin"); // ✅ sigue en Identificación
        return;
      }

      setCurrentStep("registerPrompt"); // ✅ sigue en Identificación
    } catch {
      setEmailError("Error al validar el email. Por favor, intente de nuevo.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSelectSavedAddress = async (address: Address) => {
    const ok = await setDefaultAddress(address.id);
    if (!ok) console.error("No se pudo establecer la dirección por defecto");

    setShippingAddress({
      city_id: address.city_id,
      cityName: address.cityName,
      address: address.address,
      addressComplement: address.addressComplement,
    });

    setCurrentStep("confirmation");
  };

  const handleNewAddress = () => {
    setIsNewAddress(true);
    useStore.getState().openSetAddressModal();
  };

  const renderProgressIndicator = () => {
    const progress = stage === "identification" ? 33 : stage === "address" ? 66 : 100;

    return (
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200" />
        <div
          className="absolute top-5 left-0 h-1 bg-orange-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />

        <div className="relative flex justify-between">
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full w-10 h-10 flex items-center justify-center text-white relative z-10
              ${stage === "identification" ? "bg-orange-500" : "bg-green-500"}`}
            >
              {stage === "identification" ? <FaUser /> : <FaCheck />}
            </div>
            <span className="text-xs mt-2">Identificación</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`rounded-full w-10 h-10 flex items-center justify-center text-white relative z-10
              ${
                stage === "address"
                  ? "bg-orange-500"
                  : stage === "confirmation"
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            >
              {stage === "confirmation" ? <FaCheck /> : <FaMapMarkerAlt />}
            </div>
            <span className="text-xs mt-2">Dirección</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`rounded-full w-10 h-10 flex items-center justify-center text-white relative z-10
              ${stage === "confirmation" ? "bg-orange-500" : "bg-gray-300"}`}
            >
              <FaCheck />
            </div>
            <span className="text-xs mt-2">Confirmación</span>
          </div>
        </div>
      </div>
    );
  };

  const renderEmailForm = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo electrónico"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
        {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors disabled:bg-orange-300"
        disabled={isValidating}
      >
        {isValidating ? "Validando..." : "Seguir"}
      </button>
    </form>
  );

  const renderRegisterPrompt = () => (
    <div className="space-y-4">
      <div className="p-3 rounded bg-gray-50 border">
        <p className="text-sm text-gray-700">
          No encontramos una cuenta con <b>{email}</b>.
        </p>
        <p className="text-sm text-gray-600 mt-1">Puedes registrarte para continuar con tu compra.</p>
      </div>

      <button
        onClick={() => setCurrentStep("register")}
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
      >
        Registrarme
      </button>

      <button
        onClick={() => setCurrentStep("email")}
        className="w-full border py-2 rounded hover:bg-gray-50"
      >
        Usar otro correo
      </button>
    </div>
  );

  const renderAddressStep = () => (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Dirección de envío</h3>

      {shippingAddress && (
        <div className="p-3 border rounded bg-gray-50">
          <p className="text-sm font-medium text-gray-700">Dirección actual</p>
          <p className="text-sm text-gray-600 mt-1">
            <b>{shippingAddress.cityName}</b> — {shippingAddress.address}
            {shippingAddress.addressComplement ? `, ${shippingAddress.addressComplement}` : ""}
          </p>

          <button
            onClick={() => setCurrentStep("confirmation")}
            className="mt-3 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            Continuar con esta dirección
          </button>
        </div>
      )}

      {isLoadingAddresses ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Cargando direcciones...</p>
        </div>
      ) : (
        <>
          {savedAddresses.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Selecciona una dirección de envío:</p>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedAddresses.map((address) => (
                  <button
                    key={address.id}
                    onClick={() => handleSelectSavedAddress(address)}
                    className={`w-full text-left p-3 border rounded transition-colors flex items-center gap-2
                      ${
                        address.default_address
                          ? "border-orange-500 bg-orange-50 hover:bg-orange-100"
                          : "hover:bg-gray-50"
                      }`}
                  >
                    <FaMapMarkedAlt
                      className={`flex-shrink-0 ${
                        address.default_address ? "text-orange-500" : "text-gray-400"
                      }`}
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{address.cityName}</p>
                        {address.default_address && (
                          <span className="text-xs text-orange-500 font-medium px-2 py-1 bg-orange-100 rounded-full">
                            Dirección principal
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{address.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={`flex items-center my-4 ${savedAddresses.length > 0 ? "" : "hidden"}`}>
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">O</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleNewAddress}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 px-4 rounded hover:bg-orange-600 transition-colors"
          >
            <FaMapMarkerAlt />
            {savedAddresses.length > 0 ? "Agregar nueva dirección" : "Establecer dirección de envío"}
          </button>
        </>
      )}
    </div>
  );

  const renderContent = () => {
    // ✅ nunca muestres email hasta terminar checkAuth
    if (!hydrated || !authChecked || isSyncingAuth) {
      return <div className="text-center text-gray-500 py-6">Cargando...</div>;
    }

    switch (currentStep) {
      case "email":
        return renderEmailForm();

      case "signin":
        return (
          <SigninForm
            initialEmail={email}
            onSuccess={() => setCurrentStep("address")}
            onBack={() => setCurrentStep("email")}
            onGoRegister={() => setCurrentStep("register")}
          />
        );

      case "registerPrompt":
        return renderRegisterPrompt();

      case "register":
        return <RegisterForm initialEmail={email} onSuccess={() => setCurrentStep("address")} />;

      case "address":
        return renderAddressStep();

      case "confirmation":
        return (
          <div className="text-center space-y-4">
            <div className="mb-6">
              <FaCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold">¡Falta poco para que la orden sea tuya!</h2>
              <p className="text-gray-600 mt-2">Confirma tu pedido para finalizar</p>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600"
            >
              Confirmar pedido
            </button>
          </div>
        );
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Proceso de Compra</h2>

          {stage === "identification" && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          )}
        </div>

        {renderProgressIndicator()}

        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  ) : null;
};

export default CheckoutFlowModal;
