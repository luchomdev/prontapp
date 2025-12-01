// WhatsAppButton.tsx
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

type WhatsAppButtonProps = {
  phoneNumber: string;              // Ej: "573001112233"
  message?: string;
  position?: "right" | "left";
};

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "",
  position = "right",
}) => {
  if (!phoneNumber) return null;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}${
    message ? `?text=${encodedMessage}` : ""
  }`;

  const positionClasses =
    position === "left" ? "left-5" : "right-5";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={`
        fixed bottom-20 ${positionClasses}
        z-50
        flex items-center justify-center
        w-14 h-14
        rounded-full
        bg-green-500
        shadow-lg
        transition
        hover:-translate-y-0.5 hover:scale-105
        hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
      `}
    >
      <FaWhatsapp className="w-7 h-7 text-white" />
    </a>
  );
};

export default WhatsAppButton;
