import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Droplets, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  User
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      key: 'dashboard',
      roles: ['admin', 'researcher', 'public']
    },
    {
      name: 'Wetlands',
      icon: Droplets,
      key: 'wetlands',
      roles: ['admin', 'researcher', 'public']
    },
    {
      name: 'Reports',
      icon: FileText,
      key: 'reports',
      roles: ['admin', 'researcher', 'public']
    },
    {
      name: 'Admin Panel',
      icon: Shield,
      key: 'admin',
      roles: ['admin']
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || 'public')
  );

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'researcher': return 'bg-blue-100 text-blue-800';
      case 'public': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="h-5 w-5" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold">Ka-Eco</h1>
              <p className="text-xs text-muted-foreground">Urban Wetlands Monitoring</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 ml-8">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.key}
                  variant={currentPage === item.key ? 'default' : 'ghost'}
                  onClick={() => onPageChange(item.key)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </nav>

          {/* User Info and Mobile Menu */}
          <div className="ml-auto flex items-center gap-4">
            {/* User Badge - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.organization}</p>
              </div>
              <Badge className={getRoleBadgeColor(user?.role || 'public')}>
                {user?.role}
              </Badge>
            </div>

            {/* Logout - Desktop */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-4 py-3 space-y-3">
              {/* User Info - Mobile */}
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.organization}</p>
                </div>
                <Badge className={getRoleBadgeColor(user?.role || 'public')}>
                  {user?.role}
                </Badge>
              </div>

              {/* Navigation Links - Mobile */}
              <nav className="space-y-1">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.key}
                      variant={currentPage === item.key ? 'default' : 'ghost'}
                      onClick={() => {
                        onPageChange(item.key);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-3"
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  );
                })}
              </nav>

              {/* Logout - Mobile */}
              <div className="pt-3 border-t">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start gap-3 text-muted-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-12">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <Droplets className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Ka-Eco Urban Wetlands Monitoring System</p>
                <p className="text-xs text-muted-foreground">
                  Developed by Kamanzi Divin, Mount Kenya University
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center md:text-right">
              <p>© 2024 Ka-Eco. All rights reserved.</p>
              <p>Supporting sustainable wetland management in Rwanda</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}