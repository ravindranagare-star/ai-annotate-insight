import { MetricCard } from "../MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Calendar,
  Target
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

const weeklyData = [
  { week: "Week 1", assigned: 450, completed: 423, pending: 27 },
  { week: "Week 2", assigned: 520, completed: 498, pending: 22 },
  { week: "Week 3", assigned: 480, completed: 465, pending: 15 },
  { week: "Week 4", assigned: 600, completed: 580, pending: 20 },
];

const hourlyProductivity = [
  { hour: "9AM", annotations: 45 },
  { hour: "10AM", annotations: 68 },
  { hour: "11AM", annotations: 72 },
  { hour: "12PM", annotations: 58 },
  { hour: "1PM", annotations: 42 },
  { hour: "2PM", annotations: 65 },
  { hour: "3PM", annotations: 78 },
  { hour: "4PM", annotations: 69 },
  { hour: "5PM", annotations: 52 },
];

const annotatorPerformance = [
  { name: "Alex Chen", completed: 156, avgTime: 3.2, accuracy: 94 },
  { name: "Sarah Miller", completed: 142, avgTime: 4.1, accuracy: 89 },
  { name: "David Kim", completed: 138, avgTime: 3.8, accuracy: 92 },
  { name: "Emma Wilson", completed: 134, avgTime: 3.5, accuracy: 96 },
  { name: "John Roberts", completed: 128, avgTime: 4.3, accuracy: 88 },
];

export function ProductionTab() {
  return (
    <div className="space-y-6">
      {/* Production Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Assigned This Week"
          value="2,050"
          change={{ value: "+15% from last week", trend: "up" }}
          icon={FileText}
        />
        <MetricCard
          title="Completed"
          value="1,966"
          change={{ value: "95.9% completion rate", trend: "up" }}
          icon={CheckCircle}
        />
        <MetricCard
          title="Pending"
          value="84"
          change={{ value: "-12% from yesterday", trend: "up" }}
          icon={Clock}
        />
        <MetricCard
          title="Avg. Time per Task"
          value="3.7min"
          change={{ value: "-5% improvement", trend: "up" }}
          icon={Target}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Production Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Weekly Production Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Bar dataKey="assigned" fill="hsl(var(--muted))" name="Assigned" />
                <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" />
                <Bar dataKey="pending" fill="hsl(var(--warning))" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Productivity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Hourly Productivity Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyProductivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="hour" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Area 
                  type="monotone" 
                  dataKey="annotations" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Top Performers This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Annotator</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Completed</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Avg. Time</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Accuracy</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {annotatorPerformance.map((annotator, index) => (
                  <tr key={annotator.name} className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4 font-medium">{annotator.name}</td>
                    <td className="py-3 px-4">{annotator.completed}</td>
                    <td className="py-3 px-4">{annotator.avgTime}min</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        annotator.accuracy >= 95 ? 'bg-success/10 text-success' :
                        annotator.accuracy >= 90 ? 'bg-primary/10 text-primary' :
                        'bg-warning/10 text-warning'
                      }`}>
                        {annotator.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm text-muted-foreground">Active</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            AI Production Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-info/5 rounded-lg border border-info/20">
              <h4 className="font-medium text-info mb-2">Delay Prediction</h4>
              <p className="text-sm text-muted-foreground">
                Object detection tasks may experience 15-20min delays due to complexity spike. Consider reassigning 3 tasks to experienced annotators.
              </p>
            </div>
            <div className="p-4 bg-success/5 rounded-lg border border-success/20">
              <h4 className="font-medium text-success mb-2">Throughput Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Peak productivity window: 10AM-12PM and 2PM-4PM. Schedule high-priority tasks during these hours for 23% efficiency boost.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}