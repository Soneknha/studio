'use client';
import { useState, useEffect } from 'react';
import { useAuth, useFirestore, useFirebase } from '@/firebase/provider';
import { User } from 'firebase/auth';
import { doc, onSnapshot, DocumentSnapshot } from 'firebase/firestore';

export interface UserHookResult {
  user: User | null;
  isAdmin: boolean;
  isUserLoading: boolean;
  userError: Error | null;
}

export const useUser = (): UserHookResult => {
  const { user, isUserLoading: isAuthLoading, userError } = useFirebase();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setIsRoleLoading(false);
      return;
    }

    const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
    const unsubscribe = onSnapshot(
      adminRoleRef,
      (snapshot: DocumentSnapshot) => {
        setIsAdmin(snapshot.exists());
        setIsRoleLoading(false);
      },
      (error) => {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsRoleLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, firestore]);

  return {
    user,
    isAdmin,
    isUserLoading: isAuthLoading || isRoleLoading,
    userError,
  };
};
