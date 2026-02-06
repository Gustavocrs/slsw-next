/**
 * Hook - useAuth
 * Gerenciamento de autenticação com Firebase
 */

import {useEffect} from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {auth} from "@/lib/firebase";
import {useAuthStore} from "@/stores/characterStore";

const provider = new GoogleAuthProvider();

export function useAuth() {
  const {user, loading, setUser, setLoading, logout} = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  return {
    user,
    loading,
    loginWithGoogle,
    logoutUser,
    isAuthenticated: !!user,
  };
}

export default useAuth;
