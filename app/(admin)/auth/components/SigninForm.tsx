"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useStore } from "@/stores/cartStore";
import { validateEmail } from "@/lib/validator";
import { signIn } from "@/app/actions/signin";

interface SigninFormProps {
  initialEmail?: string;
  onSuccess?: () => void;

  // NUEVO: para CheckoutFlowModal
  onBack?: () => void;        // volver a cambiar el correo
  onGoRegister?: () => void;  // ir al registro
  lockEmail?: boolean;        // bloquear el input de email (default: true si viene initialEmail)
}

const SigninForm: React.FC<SigninFormProps> = ({
  onSuccess,
  initialEmail = "",
  onBack,
  onGoRegister,
  lockEmail = !!initialEmail,
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

  // Actualizar email cuando cambia initialEmail
  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const togglePasswordVisibility = () => setShowPassword((p) => !p);

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

      if (!result.success || !result.user) {
        setError(result.error || "Error al iniciar sesión");
        return;
      }

      setUser(result.user);
      setAuthenticated(true);

      // Si viene una dirección por defecto, setearla en el store
      if (result.user.defaultAddress) {
        const [address, city_id, cityName] = result.user.defaultAddress.split("|~");
        const [baseAddress, complement] = address.split("~");

        setShippingAddress({
          city_id: parseInt(city_id),
          cityName: cityName,
          address: baseAddress.trim(),
          addressComplement: complement ? complement.trim() : "",
        });
      }

      if (onSuccess) {
        onSuccess();
      } else if (result.user.role === "admin") {
        router.replace("/console/dashboard");
      } else {
        router.replace("/");
      }
    } catch (err) {
      setError("Error al intentar iniciar sesión. Por favor, intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form name="SigninForm" onSubmit={handleSubmit}>
      {/* Header pequeño para volver/cambiar correo */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-2 text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Cambiar correo
        </button>
      )}

      <input
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        className="w-full p-2 mb-4 border rounded"
        required
        readOnly={lockEmail}
      />

      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full p-2 mb-4 border rounded pr-10"
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 -top-3 right-0 pr-3 flex items-center text-sm leading-5"
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Link
        onClick={onSuccess}
        href="/request-password-recovery"
        className="flex items-center justify-end text-sm text-blue-600 hover:underline mb-4"
      >
        ¿Olvidaste tu contraseña?
      </Link>

      <button
        type="submit"
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 mb-3 disabled:bg-orange-300"
        disabled={isLoading}
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>

      {/* CTA registro: si viene del modal, úsalo; si no, link normal */}
      {onGoRegister ? (
        <button
          type="button"
          onClick={onGoRegister}
          className="w-full border py-2 rounded hover:bg-gray-50"
        >
          Crear cuenta
        </button>
      ) : (
        <Link
          href="/register"
          className="block w-full text-center border py-2 rounded hover:bg-gray-50"
        >
          Crear cuenta
        </Link>
      )}
    </form>
  );
};

export default SigninForm;
