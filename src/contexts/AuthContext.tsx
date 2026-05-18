import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    // By using dynamic Promise.all imports, we instruct Vite to code-split
    // Firebase entirely out of our critical render-blocking bundle.
    // The browser paints the HTML instantly, and Firebase loads in the background.
    Promise.all([
      import("../lib/firebase"),
      import("firebase/auth")
    ])
      .then(([{ auth }, { onAuthStateChanged }]) => {
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setIsAuthLoading(false);
        });
      })
      .catch((err) => {
        console.error("Failed to dynamically load Firebase:", err);
        setIsAuthLoading(false); // Don't hang the app if network fails
      });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
