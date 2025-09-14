import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  CheckCircle, 
  Users, 
  Settings, 
  Home,
  TrendingUp,
  Shield,
  Activity
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "production", label: "Production", icon: BarChart3 },
  { id: "quality", label: "Quality", icon: Shield },
  { id: "users", label: "User Tracking", icon: Users },
  { id: "operations", label: "Operations", icon: Activity },
  { id: "insights", label: "AI Insights", icon: TrendingUp },
];

export function DashboardSidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">AI Annotation</h1>
            <p className="text-sm text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                activeTab === item.id && "bg-secondary text-secondary-foreground font-medium"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-3 h-11">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}