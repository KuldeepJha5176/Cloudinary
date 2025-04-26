"use client";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";


import { SignIn, SignInButton } from "@clerk/nextjs";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 w-full z-50 border-b backdrop-blur-sm bg-background/80 border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            CloudAI
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              toggleTheme();
              toast(`Switched to ${theme === 'light' ? 'dark' : 'light'} mode`, {
                description: `Theme preference updated.`,
                position: "bottom-right",
              });
            }}
            className="rounded-full hover:bg-muted"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <SignInButton mode="modal">
          <Button 
            variant="default" 
            className="rounded-full"
            
          >
            Get Started
          </Button>
          </SignInButton>

          
        </div>
      </div>
    </nav>
  );
};