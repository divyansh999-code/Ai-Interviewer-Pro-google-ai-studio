
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session persistence
    const storedUser = localStorage.getItem('ai_interviewer_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // 1. Try Supabase Login (Database check)
      // We use maybeSingle() to avoid throwing an error immediately if no row is found
      let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      // 2. Fallback to Local Storage if Supabase failed or didn't find the user
      // This ensures offline demo capabilities still work
      if (error || !data) {
        const storedUsers = JSON.parse(localStorage.getItem('ai_interviewer_users_db') || '[]');
        const localUser = storedUsers.find((u: any) => u.email === email);
        
        if (localUser) {
           data = localUser; // Treat local user as the source of truth
           error = null;     // Clear any previous error
        }
      }

      // 3. User Existence Check
      if (!data) {
        // User is not in DB and not in Local Storage
        throw new Error("First create account");
      }

      // 4. Password Validation
      if (data.password !== password) {
        throw new Error("Invalid credentials");
      }

      // 5. Successful Login
      const appUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar
      };

      setUser(appUser);
      localStorage.setItem('ai_interviewer_user', JSON.stringify(appUser));

    } catch (error: any) {
      console.warn("Login flow error:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);

    try {
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
      let newUser: User | null = null;

      // 1. Try Supabase Insert
      const { data, error } = await supabase
        .from('users')
        .insert([{ 
            name, 
            email, 
            password, // Plain text for demo only
            avatar: avatarUrl 
        }])
        .select()
        .single();

      if (error) {
        console.warn("Supabase signup failed, using local storage fallback:", error.message);
        
        // Fallback: Simulate DB in LocalStorage
        const storedUsers = JSON.parse(localStorage.getItem('ai_interviewer_users_db') || '[]');
        if (storedUsers.some((u: any) => u.email === email)) {
           throw new Error("User already exists (Local)");
        }
        
        const localUser = {
           id: crypto.randomUUID(),
           name,
           email,
           password,
           avatar: avatarUrl,
           created_at: new Date().toISOString()
        };
        
        storedUsers.push(localUser);
        localStorage.setItem('ai_interviewer_users_db', JSON.stringify(storedUsers));
        
        newUser = {
           id: localUser.id,
           name: localUser.name,
           email: localUser.email,
           avatar: localUser.avatar
        };
      } else {
        newUser = {
           id: data.id,
           name: data.name,
           email: data.email,
           avatar: data.avatar
        };
      }

      if (newUser) {
        setUser(newUser);
        localStorage.setItem('ai_interviewer_user', JSON.stringify(newUser));
      }

    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai_interviewer_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
