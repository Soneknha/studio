'use client';

import React, { useMemo, type ReactNode, useState, useEffect } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // Use state to hold the initialized services. Start with null.
  const [firebaseServices, setFirebaseServices] = useState<{
    firebaseApp: ReturnType<typeof initializeFirebase>['firebaseApp'] | null;
    auth: ReturnType<typeof initializeFirebase>['auth'] | null;
    firestore: ReturnType<typeof initializeFirebase>['firestore'] | null;
  }>({
    firebaseApp: null,
    auth: null,
    firestore: null,
  });

  // useEffect runs only on the client, after the component mounts.
  useEffect(() => {
    // We only want to initialize Firebase on the client.
    if (typeof window !== 'undefined') {
      const services = initializeFirebase();
      setFirebaseServices(services);
    }
  }, []);

  // If services are not yet initialized, don't render the children.
  // This prevents child components from calling useFirebase() too early.
  if (!firebaseServices.firebaseApp) {
    // You could return a global loader here if you wanted.
    return null;
  }

  // Once services are initialized, render the provider and children.
  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth!}
      firestore={firebaseServices.firestore!}
    >
      {children}
    </FirebaseProvider>
  );
}
