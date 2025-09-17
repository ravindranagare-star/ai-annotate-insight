import { MetricCard } from "../MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users,
  TrendingUp,
  Target,
  Activity,
  Shield
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const dailyProductivity = [
  { day: "Mon", annotations: 245, quality: 92 },
  { day: "Tue", annotations: 267, quality: 89 },
  { day: "Wed", annotations: 234, quality: 94 },
  { day: "Thu", annotations: 298, quality: 91 },
  { day: "Fri", annotations: 312, quality: 88 },
  { day: "Sat", annotations: 189, quality: 95 },
  { day: "Sun", annotations: 156, quality: 97 },
];

const taskDistribution = [
  { name: "Object Detection", value: 35, color: "hsl(var(--primary))" },
  { name: "Text Classification", value: 28, color: "hsl(var(--accent))" },
  { name: "Image Segmentation", value: 22, color: "hsl(var(--success))" },
  { name: "Other", value: 15, color: "hsl(var(--warning))" },
];

export function OverviewTab() {
  // Calculate aggregated metrics from all batches
  const batchJobs = JSON.parse(localStorage.getItem('batchJobs') || '{}');
  const allJobs = Object.values(batchJobs).flat() as any[];
  
  const totalJobs = allJobs.length;
  const completedJobs = allJobs.filter(job => job.data_status === 'completed').length;
  const pendingJobs = allJobs.filter(job => job.data_status === 'pending' || !job.data_status).length;
  const inProgressJobs = allJobs.filter(job => job.data_status === 'in_progress').length;

  return (
    <div className="space-y-6">
      {/* Aggregated Overview Header */}
      <div>
        <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
        <p className="text-muted-foreground">Aggregated view of all batch data and performance metrics</p>
      </div>

      {/* Key Metrics Grid - Aggregated Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Jobs"
          value={totalJobs.toString() || "1,247"}
          change={{ value: `${completedJobs} completed, ${pendingJobs} pending`, trend: "up" }}
          icon={CheckCircle}
        />
        <MetricCard
          title="Completion Rate"
          value={totalJobs > 0 ? `${Math.round((completedJobs / totalJobs) * 100)}%` : "91.3%"}
          change={{ value: "+2.1% from last week", trend: "up" }}
          icon={Shield}
        />
        <MetricCard
          title="Active Batches"
          value={Object.keys(batchJobs).length.toString() || "23"}
          change={{ value: "3 more than yesterday", trend: "up" }}
          icon={Users}
        />
        <MetricCard
          title="In Progress Jobs"
          value={inProgressJobs.toString() || "4.2min"}
          change={{ value: "-8% improvement", trend: "up" }}
          icon={Clock}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Productivity Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Daily Productivity Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyProductivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Line 
                  type="monotone" 
                  dataKey="annotations" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Task Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-medium text-primary">Productivity Forecast</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Current pace suggests 15% increase in weekly output. Consider scaling team.
              </p>
            </div>
            
            <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="font-medium text-warning">Quality Alert</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Annotator Sarah M. showing 8% accuracy drop. Recommend review session.
              </p>
            </div>
            
            <div className="p-4 bg-success/5 rounded-lg border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="font-medium text-success">Optimization</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Task reassignment algorithm improved efficiency by 12% this week.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}