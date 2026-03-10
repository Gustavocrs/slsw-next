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
import {auth, db} from "@/lib/firebase";
import {useAuthStore} from "@/stores/characterStore";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";

const provider = new GoogleAuthProvider();

export function useAuth() {
  const {user, loading, setUser, setLoading, logout} = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };
        setUser(userData);

        // Garante que o documento do usuário exista no Firestore
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(
          userRef,
          {...userData, lastLogin: serverTimestamp()},
          {merge: true},
        );
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
      alert(`Erro ao fazer login: ${error.message}`);
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
