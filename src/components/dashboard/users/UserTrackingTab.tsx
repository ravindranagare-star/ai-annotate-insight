import { useState } from "react";
import { MetricCard } from "../MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Award,
  Activity,
  Brain,
  ChevronUp,
  ChevronDown,
  Bot,
  Lightbulb
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const userPerformance = [
  { 
    name: "Alex Chen", 
    accuracy: 96, 
    speed: 92, 
    completed: 156, 
    avgTime: 3.2, 
    status: "active",
    trend: "up",
    speciality: "Object Detection"
  },
  { 
    name: "Emma Wilson", 
    accuracy: 94, 
    speed: 88, 
    completed: 134, 
    avgTime: 3.5, 
    status: "active",
    trend: "up",
    speciality: "Text Classification"
  },
  { 
    name: "David Kim", 
    accuracy: 92, 
    speed: 85, 
    completed: 138, 
    avgTime: 3.8, 
    status: "active",
    trend: "neutral",
    speciality: "Image Segmentation"
  },
  { 
    name: "Sarah Miller", 
    accuracy: 89, 
    speed: 82, 
    completed: 142, 
    avgTime: 4.1, 
    status: "needs_attention",
    trend: "down",
    speciality: "Object Detection"
  },
  { 
    name: "John Roberts", 
    accuracy: 88, 
    speed: 79, 
    completed: 128, 
    avgTime: 4.3, 
    status: "needs_attention",
    trend: "down",
    speciality: "Bounding Box"
  },
];

const teamComparison = [
  { metric: "Accuracy", team: 92, individual: 89 },
  { metric: "Speed", team: 85, individual: 82 },
  { metric: "Consistency", team: 88, individual: 85 },
  { metric: "Quality", team: 91, individual: 87 },
];

const skillRadarData = [
  { skill: "Object Detection", alex: 95, sarah: 82, team: 88 },
  { skill: "Text Classification", alex: 88, sarah: 94, team: 91 },
  { skill: "Image Segmentation", alex: 92, sarah: 79, team: 85 },
  { skill: "Bounding Box", alex: 89, sarah: 86, team: 87 },
  { skill: "Quality Control", alex: 94, sarah: 88, team: 90 },
];

export function UserTrackingTab() {
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [aiRecommendations, setAiRecommendations] = useState<Record<string, string>>({});

  const getAIRecommendation = (annotator: string) => {
    const recommendations = [
      "Focus on improving bounding box precision by 15%. Recommended training: Object Detection Masterclass.",
      "Excellent performance! Consider mentoring new team members to share best practices.",
      "Speed up annotation process by 20% through keyboard shortcuts training. Schedule practice session.",
      "Quality consistency needs attention. Review guidelines for text classification tasks.",
      "Outstanding accuracy! Recommend for complex annotation tasks and team leadership role."
    ];
    
    const recommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
    setAiRecommendations(prev => ({ ...prev, [annotator]: recommendation }));
  };

  return (
    <div className="space-y-6">
      {/* Batch Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">User Performance Tracking</h2>
          <p className="text-muted-foreground">Monitor annotator performance by batch</p>
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

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Active Users"
          value="23"
          change={{ value: "+2 new this week", trend: "up" }}
          icon={Users}
        />
        <MetricCard
          title="Team Accuracy"
          value="91.2%"
          change={{ value: "+1.8% improvement", trend: "up" }}
          icon={Award}
        />
        <MetricCard
          title="Avg. Idle Time"
          value="12.4min"
          change={{ value: "-3min improvement", trend: "up" }}
          icon={Clock}
        />
        <MetricCard
          title="Top Performer"
          value="Alex Chen"
          change={{ value: "96% accuracy", trend: "up" }}
          icon={TrendingUp}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Individual vs Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Individual vs Team Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamComparison}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="metric" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Bar dataKey="team" fill="hsl(var(--primary))" name="Team Average" />
                <Bar dataKey="individual" fill="hsl(var(--accent))" name="Individual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skill Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Skill Comparison (Top Performers)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" className="text-muted-foreground" />
                <PolarRadiusAxis domain={[0, 100]} className="text-muted-foreground" />
                <Radar
                  name="Alex Chen"
                  dataKey="alex"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                />
                <Radar
                  name="Sarah Miller"
                  dataKey="sarah"
                  stroke="hsl(var(--accent))"
                  fill="hsl(var(--accent))"
                  fillOpacity={0.1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Annotator Performance - {selectedBatch === "all" ? "All Batches" : selectedBatch.toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userPerformance.map((user) => (
              <div key={user.name} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.speciality}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className="font-medium">{user.accuracy}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Speed</p>
                      <p className="font-medium">{user.avgTime}min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="font-medium">{user.completed}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.trend === "up" && <ChevronUp className="w-4 h-4 text-success" />}
                      {user.trend === "down" && <ChevronDown className="w-4 h-4 text-destructive" />}
                      <Badge variant={
                        user.status === 'active' ? 'default' : 'destructive'
                      }>
                        {user.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => getAIRecommendation(user.name)}
                        disabled={!!aiRecommendations[user.name]}
                      >
                        <Bot className="w-4 h-4 mr-1" />
                        Get AI Recommendation
                      </Button>
                    </div>
                  </div>
                </div>
                {aiRecommendations[user.name] && (
                  <div className="mt-3 p-3 bg-primary/5 rounded border border-primary/20">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-primary">AI Recommendation</p>
                        <p className="text-sm text-muted-foreground">{aiRecommendations[user.name]}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Training Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Training Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
              <h4 className="font-medium text-warning mb-2">Sarah Miller - Needs Attention</h4>
              <p className="text-sm text-muted-foreground mb-2">
                8% accuracy drop in object detection tasks over the past week.
              </p>
              <p className="text-xs text-muted-foreground">
                Recommended: 1-hour refresher session on bounding box precision
              </p>
            </div>
            <div className="p-4 bg-info/5 rounded-lg border border-info/20">
              <h4 className="font-medium text-info mb-2">John Roberts - Skill Development</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Strong consistency but could improve speed on text classification.
              </p>
              <p className="text-xs text-muted-foreground">
                Recommended: Advanced keyboard shortcuts training
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}