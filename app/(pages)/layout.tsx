"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOut,
  Menu,
  Home,
  Share2,
  Upload,
  Film,
  ChevronDown,
  User,
  Settings,
} from "lucide-react";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";

const sidebarItems = [
  { href: "/home", icon: Home, label: "Home Page" },
  { href: "/social-share", icon: Share2, label: "Social Share" },
  { href: "/video-upload", icon: Upload, label: "Video Upload" },
];

function AppLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  
  const handleLogoClick = () => {
    router.push("/");
  };
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const handleNavigateToProfile = () => {
    router.push("/profile");
    setUserMenuOpen(false);
  };
  
  const handleNavigateToSettings = () => {
    router.push("/settings");
    setUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen dark:bg-slate-900 bg-slate-50 transition-colors duration-200">
      {/* Navbar */}
      <header className="sticky top-0 z-30 w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 dark:text-slate-200 lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link 
                href="/" 
                className="flex items-center space-x-2 ml-2 lg:ml-0"
                onClick={handleLogoClick}
              >
                <Film className="h-8 w-8 text-blue-600 dark:text-indigo-400" />
                <span className="text-xl font-bold text-slate-900 dark:text-white">Cloudinary Showcase</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {user && (
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center space-x-3 text-sm focus:outline-none"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {user.username || user.emailAddresses[0].emailAddress}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-100">
                        <img
                          src={user.imageUrl}
                          alt="User"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <ChevronDown className="ml-1 h-4 w-4 text-slate-400" />
                    </div>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-slate-700 focus:outline-none">
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {user.fullName || user.username}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.emailAddresses[0].emailAddress}
                        </p>
                      </div>
                      
                      <button
                        onClick={handleNavigateToProfile}
                        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Your Profile
                      </button>
                      
                      <button
                        onClick={handleNavigateToSettings}
                        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Account Settings
                      </button>
                      
                      <div className="border-t border-slate-200 dark:border-slate-700" />
                      
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 z-20 w-64 h-[calc(100vh-64px)] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto py-5 px-3">
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-blue-100 dark:bg-indigo-900/60 text-blue-700 dark:text-indigo-200"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isActive ? "text-blue-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {user && (
              <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1 overflow-y-auto transition-colors duration-200 dark:bg-slate-900">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppLayoutContent>{children}</AppLayoutContent>
    </ThemeProvider>
  );
}