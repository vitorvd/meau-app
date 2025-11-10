import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebaseConfig";
import { registerForPushNotificationsAsync } from "../core/services/notifications";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta mudanças no estado de login do Firebase
    const unsubscribeAuth = onAuthStateChanged(auth, async (userAuth: User | null) => {
      setUser(userAuth);
      setLoading(false);

      if(userAuth){
        try{
          const token = await registerForPushNotificationsAsync(userAuth.uid);
          
          if(token){
            console.log("tokne de notificação", token);

            await setDoc(
              doc(db, "users", userAuth.uid),
              { expoPushToken: token},
              { merge: true }
            );
          }
        } catch (error){
          console.error("erro ao registrar notificações", error);
        }
      }
    });

  return unsubscribeAuth;
}, []);

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
};
