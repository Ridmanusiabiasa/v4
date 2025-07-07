import { useState, useEffect } from "react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { LoginModal } from "@/components/admin/login-modal";
import { LocalStorage } from "@/lib/storage";
import { useLocation } from "wouter";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const session = LocalStorage.getAdminSession();
    setIsAuthenticated(session);
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      LocalStorage.setAdminSession(true);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    LocalStorage.clearAdminSession();
    setIsAuthenticated(false);
    setLocation('/');
  };

  if (!isAuthenticated) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
}
