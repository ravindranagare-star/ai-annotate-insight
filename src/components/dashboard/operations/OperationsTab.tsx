import { MetricCard } from "../MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Server, 
  Zap, 
  AlertCircle,
  Users,
  BarChart3,
  Timer,
  Wifi
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

const systemHealth = [
  { time: "00:00", responseTime: 120, uptime: 99.9 },
  { time: "04:00", responseTime: 135, uptime: 99.8 },
  { time: "08:00", responseTime: 158, uptime: 99.9 },
  { time: "12:00", responseTime: 142, uptime: 99.9 },
  { time: "16:00", responseTime: 167, uptime: 99.7 },
  { time: "20:00", responseTime: 139, uptime: 99.9 },
];

const resourceUtilization = [
  { name: "Active", value: 18, color: "hsl(var(--success))" },
  { name: "Idle", value: 5, color: "hsl(var(--warning))" },
  { name: "Break", value: 3, color: "hsl(var(--muted))" },
  { name: "Offline", value: 2, color: "hsl(var(--destructive))" },
];

const workloadData = [
  { day: "Mon", assigned: 450, capacity: 500 },
  { day: "Tue", assigned: 520, capacity: 500 },
  { day: "Wed", assigned: 480, capacity: 500 },
  { day: "Thu", assigned: 600, capacity: 500 },
  { day: "Fri", assigned: 580, capacity: 500 },
];

const recentIssues = [
  {
    id: "SYS-001",
    type: "Performance",
    description: "Slow response time on image loading",
    severity: "medium",
    status: "investigating",
    time: "15 mins ago",
    assignee: "DevOps Team"
  },
  {
    id: "SYS-002",
    type: "Capacity",
    description: "High workload detected for Object Detection team",
    severity: "high",
    status: "resolved",
    time: "2 hours ago",
    assignee: "AI System"
  },
  {
    id: "SYS-003",
    type: "Quality",
    description: "Annotation tool lag reported by 3 users",
    severity: "low",
    status: "monitoring",
    time: "4 hours ago",
    assignee: "Support Team"
  },
];

export function OperationsTab() {
  return (
    <div className="space-y-6">
      {/* Operations Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="System Uptime"
          value="99.8%"
          change={{ value: "99.9% this month", trend: "up" }}
          icon={Server}
        />
        <MetricCard
          title="Avg. Response Time"
          value="142ms"
          change={{ value: "-8ms improvement", trend: "up" }}
          icon={Zap}
        />
        <MetricCard
          title="Active Annotators"
          value="18/23"
          change={{ value: "78% utilization", trend: "neutral" }}
          icon={Users}
        />
        <MetricCard
          title="System Health"
          value="Excellent"
          change={{ value: "All systems operational", trend: "up" }}
          icon={Activity}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              System Response Time (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={systemHealth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="time" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resource Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Resource Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resourceUtilization}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {resourceUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Workload Balancing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Workload vs Capacity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={workloadData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Area 
                type="monotone" 
                dataKey="capacity" 
                stackId="1"
                stroke="hsl(var(--muted))"
                fill="hsl(var(--muted))"
                fillOpacity={0.3}
              />
              <Area 
                type="monotone" 
                dataKey="assigned" 
                stackId="2"
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Recent System Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{issue.id}</span>
                      <Badge variant="outline">{issue.type}</Badge>
                      <Badge variant={
                        issue.severity === 'high' ? 'destructive' :
                        issue.severity === 'medium' ? 'secondary' : 'default'
                      }>
                        {issue.severity}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{issue.time}</span>
                    </div>
                    <p className="text-sm">{issue.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Assigned to: {issue.assignee}
                    </p>
                  </div>
                  <Badge variant={
                    issue.status === 'resolved' ? 'default' :
                    issue.status === 'investigating' ? 'secondary' : 'outline'
                  }>
                    {issue.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            AI Operations Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
              <h4 className="font-medium text-warning mb-2">Capacity Alert</h4>
              <p className="text-sm text-muted-foreground">
                Thursday workload exceeds capacity by 20%. Consider redistributing 5 object detection tasks to reduce bottleneck.
              </p>
            </div>
            <div className="p-4 bg-success/5 rounded-lg border border-success/20">
              <h4 className="font-medium text-success mb-2">Optimization Opportunity</h4>
              <p className="text-sm text-muted-foreground">
                System performance stable. Optimal window for deploying new annotation features: Saturday 2-6PM.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}