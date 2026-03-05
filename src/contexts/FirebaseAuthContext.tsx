import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/integrations/firebase/client";
import { getUserProfile } from "@/lib/firebase-auth";
import { AppRole, UserProfile } from "@/integrations/firebase/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: AppRole | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) return;
    
    const userProfile = await getUserProfile(user.uid);
    setProfile(userProfile);
    setRole(userProfile?.role || null);
  };

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);
        setRole(userProfile?.role || null);
      } else {
        setProfile(null);
        setRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}