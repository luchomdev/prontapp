import { useState, useEffect } from "react";
import { useStore } from "@/stores/cartStore";

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubHydrate = useStore.persist.onHydrate(() => setHydrated(false));
    const unsubFinishHydration = useStore.persist.onFinishHydration(() => {
      setHydrated(true);
      console.log("Hydration finished");
    });

    // Check if it's already hydrated
    if (useStore.persist.hasHydrated()) {
      setHydrated(true);
      console.log("Already hydrated");
    }

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};


/* // hooks/useHydration.ts
import { useState, useEffect } from "react";
import { useStore } from "@/stores/cartStore";

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubHydrate = useStore.persist.onHydrate(() => setHydrated(false));
    const unsubFinishHydration = useStore.persist.onFinishHydration(() => setHydrated(true));

    setHydrated(useStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
}; */