import { useState } from "react";
import { DashboardSidebar } from "./dashboard/DashboardSidebar";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { OverviewTab } from "./dashboard/overview/OverviewTab";
import { ProductionTab } from "./dashboard/production/ProductionTab";
import { QualityTab } from "./dashboard/quality/QualityTab";
import { UserTrackingTab } from "./dashboard/users/UserTrackingTab";
import { OperationsTab } from "./dashboard/operations/OperationsTab";
import { InsightsTab } from "./dashboard/insights/InsightsTab";

const tabConfig = {
  overview: {
    title: "Dashboard Overview",
    subtitle: "AI-powered annotation performance insights",
    component: OverviewTab
  },
  production: {
    title: "Production Analytics",
    subtitle: "Track annotation throughput and completion rates",
    component: ProductionTab
  },
  quality: {
    title: "Quality Control",
    subtitle: "Monitor accuracy and error trends",
    component: QualityTab
  },
  users: {
    title: "User Performance",
    subtitle: "Individual and team performance tracking",
    component: UserTrackingTab
  },
  operations: {
    title: "Operations Center",
    subtitle: "System health and resource management",
    component: OperationsTab
  },
  insights: {
    title: "AI Insights",
    subtitle: "Predictive analytics and recommendations",
    component: InsightsTab
  }
};

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const currentTab = tabConfig[activeTab as keyof typeof tabConfig];
  const TabComponent = currentTab.component;

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title={currentTab.title}
          subtitle={currentTab.subtitle}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <TabComponent />
        </main>
      </div>
    </div>
  );
}