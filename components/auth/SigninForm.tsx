"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useStore } from "@/stores/cartStore";
import { validateEmail } from "@/lib/validator";
import { signIn } from "@/app/actions/signin";

export interface SigninFormProps {
  initialEmail?: string;
  onSuccess?: () => void;

  // ✅ para el flujo del modal (CheckoutFlowModal)
  onBack?: () => void;
  onGoRegister?: () => void;

  // ✅ si viene del checkout, normalmente quieres bloquear el email
  lockEmail?: boolean;
}

const SigninForm: React.FC<SigninFormProps> = ({
  initialEmail = "",
  onSuccess,
  onBack,
  onGoRegister,
  lockEmail = true,
}) => {
  const router = useRouter();

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, setAuthenticated, setShippingAddress } = useStore((state) => ({
    setUser: state.setUser,
    setAuthenticated: state.setAuthenticated,
    setShippingAddress: state.setShippingAddress,
  }));

  useEffect(() => {
    setEmail(initialEmail || "");
  }, [initialEmail]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Por favor, ingrese un email válido.");
      return;
    }

    if (password.trim() === "") {
      setError("La contraseña no puede estar vacía.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn(email, password);

      if (!result?.success || !result?.user) {
        setError(result?.error || "Error al iniciar sesión");
        return;
      }

      setUser(result.user);
      setAuthenticated(true);

      // Si viene dirección por defecto en el usuario, setéala en el store
      if (result.user.defaultAddress) {
        try {
          const [addressRaw, city_idRaw, cityName] = result.user.defaultAddress.split("|~");
          const [baseAddress, complement] = addressRaw.split("~");

          setShippingAddress({
            city_id: parseInt(city_idRaw, 10),
            cityName: cityName,
            address: (baseAddress || "").trim(),
            addressComplement: complement ? complement.trim() : "",
          });
        } catch {
          // si el formato viene raro, no rompas el login
        }
      }

      // ✅ si estás dentro del modal, el modal decide qué hacer
      if (onSuccess) {
        onSuccess();
        return;
      }

      // ✅ comportamiento original fuera del modal
      if (result.user.role === "admin") {
        router.replace("/console/dashboard");
      } else {
        router.replace("/");
      }
    } catch {
      setError("Error al intentar iniciar sesión. Por favor, intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const emailReadOnly = lockEmail && !!initialEmail;

  return (
    <form name="SigninForm" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          className="w-full p-2 border rounded"
          required
          readOnly={emailReadOnly}
        />

        {/* Acciones del flujo checkout */}
        {(onBack || onGoRegister) && (
          <div className="mt-2 flex items-center justify-between text-sm">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800"
                disabled={isLoading}
              >
                Cambiar correo
              </button>
            ) : (
              <span />
            )}

            {onGoRegister ? (
              <button
                type="button"
                onClick={onGoRegister}
                className="text-orange-600 hover:text-orange-700 font-medium"
                disabled={isLoading}
              >
                Crear cuenta
              </button>
            ) : (
              <span />
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full p-2 border rounded pr-10"
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Ingresando..." : "Iniciar sesión"}
      </button>

      <div className="text-center">
        <Link href="/request-password-recovery" className="text-sm text-gray-600 hover:text-gray-800">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </form>
  );
};

export default SigninForm;
