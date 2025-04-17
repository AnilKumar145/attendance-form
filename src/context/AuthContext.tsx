import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  studentId: string | null;
  login: (studentId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const storedStudentId = localStorage.getItem('studentId');
    if (storedStudentId) {
      setIsAuthenticated(true);
      setStudentId(storedStudentId);
    }
  }, []);

  const login = (newStudentId: string) => {
    localStorage.setItem('studentId', newStudentId);
    setIsAuthenticated(true);
    setStudentId(newStudentId);
  };

  const logout = () => {
    localStorage.removeItem('studentId');
    setIsAuthenticated(false);
    setStudentId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, studentId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}