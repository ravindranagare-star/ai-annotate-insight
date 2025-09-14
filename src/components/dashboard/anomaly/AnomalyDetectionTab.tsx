import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Brain, 
  TrendingDown, 
  Clock,
  Target,
  CheckCircle,
  X,
  Eye
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

interface Anomaly {
  id: string;
  type: "quality_spike" | "performance_drop" | "processing_delay" | "pattern_deviation";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  batchId?: string;
  affectedJobs: number;
  detectedAt: string;
  status: "new" | "investigating" | "resolved";
  suggestedAction: string;
  resolvedBy?: string;
  resolvedAt?: string;
  notes?: string;
}

const anomalies: Anomaly[] = [
  {
    id: "anom-001",
    type: "quality_spike",
    severity: "high",
    title: "Quality Drop in Text Classification",
    description: "Accuracy dropped by 15% in text classification tasks over the past 2 hours",
    batchId: "batch-3",
    affectedJobs: 45,
    detectedAt: "2024-01-15T14:30:00Z",
    status: "investigating",
    suggestedAction: "Review recent annotations by harshita.arya@b2r.in and dimpal.arya@b2r.co.in"
  },
  {
    id: "anom-002", 
    type: "performance_drop",
    severity: "medium",
    title: "Annotator Performance Decline",
    description: "Sarah Miller's accuracy dropped from 94% to 89% over 3 days",
    affectedJobs: 28,
    detectedAt: "2024-01-15T09:15:00Z", 
    status: "new",
    suggestedAction: "Schedule refresher training session on object detection protocols"
  },
  {
    id: "anom-003",
    type: "processing_delay",
    severity: "critical",
    title: "Processing Time Anomaly",
    description: "Average processing time increased by 40% for image segmentation tasks",
    batchId: "batch-1",
    affectedJobs: 67,
    detectedAt: "2024-01-15T11:45:00Z",
    status: "resolved",
    suggestedAction: "Investigate tool performance and system resources",
    resolvedBy: "admin@company.com",
    resolvedAt: "2024-01-15T13:20:00Z",
    notes: "Issue resolved by optimizing image loading pipeline"
  },
  {
    id: "anom-004",
    type: "pattern_deviation", 
    severity: "low",
    title: "Error Pattern Change",
    description: "New error pattern detected: 30% increase in boundary precision errors",
    affectedJobs: 12,
    detectedAt: "2024-01-15T08:00:00Z",
    status: "investigating", 
    suggestedAction: "Analyze annotation guidelines for boundary marking procedures"
  }
];

const anomalyTrends = [
  { day: "Mon", anomalies: 2, severity: 1.5 },
  { day: "Tue", anomalies: 1, severity: 2.0 },
  { day: "Wed", anomalies: 4, severity: 2.8 },
  { day: "Thu", anomalies: 3, severity: 3.2 },
  { day: "Fri", anomalies: 2, severity: 1.8 },
  { day: "Sat", anomalies: 1, severity: 1.0 },
  { day: "Sun", anomalies: 0, severity: 0 },
];

const errorTypes = [
  { type: "Boundary Precision", count: 45, trend: "up" },
  { type: "Missing Objects", count: 32, trend: "down" },
  { type: "Wrong Classification", count: 28, trend: "stable" },
  { type: "Attribute Errors", count: 19, trend: "up" },
];

export function AnomalyDetectionTab() {
  const handleResolveAnomaly = (anomalyId: string) => {
    console.log("Resolving anomaly:", anomalyId);
  };

  const handleViewDetails = (anomalyId: string) => {
    console.log("Viewing anomaly details:", anomalyId);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "default";
      case "investigating": return "secondary"; 
      case "new": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Anomalies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">2 critical, 4 medium</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.2</div>
            <p className="text-xs text-destructive">-3.1% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patterns Detected</CardTitle>
            <Brain className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-success">+2 new patterns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-success">-1.3h faster</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Anomaly Detection Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={anomalyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Line 
                  type="monotone" 
                  dataKey="anomalies" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Error Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Error Pattern Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={errorTypes}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="type" className="text-muted-foreground" angle={-45} textAnchor="end" height={100} />
                <YAxis className="text-muted-foreground" />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Anomalies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Active Anomalies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <Alert key={anomaly.id} className="border">
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={getSeverityColor(anomaly.severity)}>
                        {anomaly.severity}
                      </Badge>
                      <Badge variant={getStatusColor(anomaly.status)}>
                        {anomaly.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {anomaly.affectedJobs} jobs affected
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(anomaly.detectedAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">{anomaly.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {anomaly.description}
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm">
                        <strong>Suggested Action:</strong> {anomaly.suggestedAction}
                      </p>
                    </div>
                    
                    {anomaly.status === "resolved" && (
                      <div className="bg-success/10 p-3 rounded-md border border-success/20">
                        <p className="text-sm text-success">
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          Resolved by {anomaly.resolvedBy} at {new Date(anomaly.resolvedAt!).toLocaleString()}
                        </p>
                        {anomaly.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {anomaly.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(anomaly.id)}>
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                    {anomaly.status !== "resolved" && (
                      <Button size="sm" onClick={() => handleResolveAnomaly(anomaly.id)}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Pattern Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Key Findings</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Text classification accuracy declining in afternoon shifts
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  Boundary precision errors increased 30% this week
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Overall team performance improved 8% after training
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Recommendations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Schedule boundary marking workshop for 5 annotators
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-info" />
                  Redistribute workload to optimize afternoon productivity
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-success" />
                  Implement automated quality checks for text classification
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}