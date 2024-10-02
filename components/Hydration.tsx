// components/Hydration.tsx
"use client";

import { useEffect } from "react";
import { useStore } from "@/stores/cartStore";

const Hydration: React.FC = () => {
  useEffect(() => {
    const rehydrate = async () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("[Iniciando hidratación de Zustand...]");
      }
      
      await useStore.persist.rehydrate();
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("[Hidratación de Zustand completada]");
      }
    };
    
    rehydrate();
  }, []);

  return null;
};

export default Hydration;