import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'researcher' | 'public';
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'researcher' | 'public';
  organization?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@ka-eco.rw',
    name: 'Kamanzi Divin',
    role: 'admin',
    organization: 'Mount Kenya University'
  },
  {
    id: '2',
    email: 'researcher@ka-eco.rw',
    name: 'Dr. Jane Uwimana',
    role: 'researcher',
    organization: 'Rwanda Environment Management Authority'
  },
  {
    id: '3',
    email: 'public@ka-eco.rw',
    name: 'Community Member',
    role: 'public',
    organization: 'Kigali City'
  }
];

// Mock password database (in production, passwords would be hashed)
const mockCredentials = {
  'admin@ka-eco.rw': 'admin123',
  'researcher@ka-eco.rw': 'research123',
  'public@ka-eco.rw': 'public123'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on app load
    const storedUser = localStorage.getItem('ka-eco-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('ka-eco-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials
    if (mockCredentials[email as keyof typeof mockCredentials] === password) {
      const userData = mockUsers.find(u => u.email === email);
      if (userData) {
        setUser(userData);
        localStorage.setItem('ka-eco-user', JSON.stringify(userData));
        return true;
      }
    }
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    if (mockUsers.some(u => u.email === userData.email)) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      organization: userData.organization
    };

    mockUsers.push(newUser);
    mockCredentials[userData.email as keyof typeof mockCredentials] = userData.password;
    
    setUser(newUser);
    localStorage.setItem('ka-eco-user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ka-eco-user');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}