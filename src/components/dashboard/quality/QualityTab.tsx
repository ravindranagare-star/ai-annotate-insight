import { useState } from "react";
import { MetricCard } from "../MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown, 
  Target,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from "recharts";

const errorTrends = [
  { day: "Mon", errors: 12, total: 245 },
  { day: "Tue", errors: 18, total: 267 },
  { day: "Wed", errors: 8, total: 234 },
  { day: "Thu", errors: 22, total: 298 },
  { day: "Fri", errors: 15, total: 312 },
  { day: "Sat", errors: 6, total: 189 },
  { day: "Sun", errors: 4, total: 156 },
];

const taskTypeErrors = [
  { type: "Object Detection", errors: 45, accuracy: 92 },
  { type: "Text Classification", errors: 28, accuracy: 95 },
  { type: "Image Segmentation", errors: 67, accuracy: 88 },
  { type: "Bounding Box", errors: 34, accuracy: 94 },
];

const recentReviews = [
  { 
    id: "ANN-001", 
    annotator: "Sarah Miller", 
    task: "Object Detection", 
    status: "rejected", 
    feedback: "Missed small objects in corners",
    reviewer: "Alex Chen",
    time: "2 hours ago"
  },
  { 
    id: "ANN-002", 
    annotator: "David Kim", 
    task: "Text Classification", 
    status: "approved", 
    feedback: "Excellent accuracy",
    reviewer: "Emma Wilson",
    time: "3 hours ago"
  },
  { 
    id: "ANN-003", 
    annotator: "John Roberts", 
    task: "Image Segmentation", 
    status: "needs_revision", 
    feedback: "Boundary precision needs improvement",
    reviewer: "Alex Chen",
    time: "4 hours ago"
  },
];

export function QualityTab() {
  const [selectedBatch, setSelectedBatch] = useState<string>("all");

  return (
    <div className="space-y-6">
      {/* Batch Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Quality Analytics</h2>
          <p className="text-muted-foreground">Monitor quality metrics by batch</p>
        </div>
        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            <SelectItem value="batch-1">Batch-1 (Editor Performance)</SelectItem>
            <SelectItem value="batch-2">Batch-2 (Attribute Errors)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Overall Accuracy"
          value="92.3%"
          change={{ value: "+1.2% from last week", trend: "up" }}
          icon={Shield}
        />
        <MetricCard
          title="Rejection Rate"
          value="7.8%"
          change={{ value: "-0.5% improvement", trend: "up" }}
          icon={XCircle}
        />
        <MetricCard
          title="Avg. Review Time"
          value="2.4min"
          change={{ value: "-15% faster", trend: "up" }}
          icon={Eye}
        />
        <MetricCard
          title="Error Rate"
          value="4.2%"
          change={{ value: "-0.8% improvement", trend: "up" }}
          icon={AlertTriangle}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Error Rate Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={errorTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Line 
                  type="monotone" 
                  dataKey="errors" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Type Accuracy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Accuracy by Task Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskTypeErrors}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="type" className="text-muted-foreground" angle={-45} textAnchor="end" height={100} />
                <YAxis className="text-muted-foreground" />
                <Bar dataKey="accuracy" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Recent Quality Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{review.id}</span>
                      <Badge variant={
                        review.status === 'approved' ? 'default' :
                        review.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {review.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{review.time}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{review.annotator}</span> • {review.task}
                    </div>
                    <p className="text-sm text-muted-foreground">{review.feedback}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reviewed by {review.reviewer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Quality Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            AI Quality Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
              <h4 className="font-medium text-warning mb-2">Pattern Detection</h4>
              <p className="text-sm text-muted-foreground">
                Image segmentation tasks show 15% higher error rate on images with low contrast. Consider pre-processing pipeline adjustment.
              </p>
            </div>
            <div className="p-4 bg-info/5 rounded-lg border border-info/20">
              <h4 className="font-medium text-info mb-2">Training Recommendation</h4>
              <p className="text-sm text-muted-foreground">
                3 annotators would benefit from additional training on bounding box precision. Estimated 12% accuracy improvement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}