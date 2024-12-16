"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LoadScriptNext } from "@react-google-maps/api";

const libraries: ("places" | "drawing")[] = ["places", "drawing"];

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error>();

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (error: Error) => {
    setLoadError(error);
  };

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      <LoadScriptNext
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={libraries}
        onLoad={handleLoad}
        onError={handleError}
        loadingElement={<div>Loading...</div>}
      >
        <div>{children}</div>
      </LoadScriptNext>
    </GoogleMapsContext.Provider>
  );
}