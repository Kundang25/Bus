import React, { createContext, useContext, useState, ReactNode } from "react";
import { conductors, adminCredentials } from "@/lib/mockData";

interface User {
  id: string;
  name: string;
  role: "conductor" | "admin";
}

interface AuthContextType {
  user: User | null;
  conductorLogin: (id: string, pin: string) => boolean;
  adminLogin: (id: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const conductorLogin = (id: string, pin: string): boolean => {
    const conductor = conductors.find(c => c.id === id && c.pin === pin);
    if (conductor) {
      setUser({ id: conductor.id, name: conductor.name, role: "conductor" });
      return true;
    }
    return false;
  };

  const adminLogin = (id: string, password: string): boolean => {
    if (id === adminCredentials.id && password === adminCredentials.password) {
      setUser({ id: adminCredentials.id, name: "Administrator", role: "admin" });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        conductorLogin,
        adminLogin,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
