
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SidebarItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebarItems,
  title,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar - Mobile Toggle */}
      <div className="md:hidden bg-white p-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-ecg-primary">{title}</h1>
          <Button variant="outline" size="sm">
            Menu
          </Button>
        </div>
      </div>
      
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-ecg-primary">{title}</h1>
        </div>
        
        <nav className="flex-1 px-4 py-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                    pathname === item.href
                      ? "bg-ecg-light text-ecg-primary font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="text-sm font-medium truncate">{currentUser?.name}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
