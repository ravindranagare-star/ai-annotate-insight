import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConversationalBot } from "../ai/ConversationalBot";
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Search,
  Send
} from "lucide-react";
import { useState } from "react";

const insights = [
  {
    type: "prediction",
    title: "Workload Forecast",
    description: "Based on current trends, expect 23% increase in annotation requests next week. Recommend adding 2 temporary annotators.",
    confidence: 87,
    impact: "high",
    action: "Scale team"
  },
  {
    type: "anomaly",
    title: "Quality Anomaly Detected",
    description: "Unusual error pattern in image segmentation tasks between 2-4 PM. Likely caused by lighting conditions in source images.",
    confidence: 94,
    impact: "medium",
    action: "Review guidelines"
  },
  {
    type: "optimization",
    title: "Efficiency Opportunity",
    description: "Reorganizing task assignment algorithm could improve overall throughput by 15% while maintaining quality standards.",
    confidence: 78,
    impact: "high",
    action: "Implement algorithm"
  },
  {
    type: "recommendation",
    title: "Training Suggestion",
    description: "5 annotators would benefit from advanced bounding box training. Estimated ROI: 18% accuracy improvement.",
    confidence: 91,
    impact: "medium",
    action: "Schedule training"
  }
];

const chatHistory = [
  { type: "user", message: "Show me annotators with accuracy below 90% this week" },
  { type: "ai", message: "Found 3 annotators with accuracy below 90%: Sarah Miller (89%), John Roberts (88%), and Mike Chen (87%). Would you like to see detailed performance analysis?" },
  { type: "user", message: "What's causing Sarah's accuracy drop?" },
  { type: "ai", message: "Analysis shows Sarah's accuracy dropped primarily in object detection tasks. Main issues: 1) Missing small objects (45% of errors), 2) Boundary precision (32% of errors). Recommend refresher training on detection protocols." }
];

export function InsightsTab() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendQuery = () => {
    if (!query.trim()) return;
    setIsLoading(true);
    // Simulate AI response
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            AI-Powered Insights
          </h2>
          <p className="text-muted-foreground">Advanced analytics and predictions for annotation performance</p>
        </div>
      </div>

      {/* Conversational AI Assistant */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Conversational Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConversationalBot />
        </CardContent>
      </Card>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {insight.type === 'prediction' && <TrendingUp className="w-5 h-5 text-info" />}
                  {insight.type === 'anomaly' && <AlertTriangle className="w-5 h-5 text-warning" />}
                  {insight.type === 'optimization' && <Lightbulb className="w-5 h-5 text-success" />}
                  {insight.type === 'recommendation' && <Brain className="w-5 h-5 text-primary" />}
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                </div>
                <Badge variant={insight.impact === 'high' ? 'destructive' : 'secondary'}>
                  {insight.impact} impact
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{insight.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Confidence:</span>
                  <span className="font-medium">{insight.confidence}%</span>
                </div>
                <Button size="sm" variant="outline">
                  {insight.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Predictive Analytics Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">+23%</div>
              <p className="text-sm text-muted-foreground">Expected workload increase next week</p>
            </div>
            <div className="text-center p-4 bg-success/5 rounded-lg">
              <div className="text-2xl font-bold text-success mb-2">+15%</div>
              <p className="text-sm text-muted-foreground">Potential efficiency improvement</p>
            </div>
            <div className="text-center p-4 bg-warning/5 rounded-lg">
              <div className="text-2xl font-bold text-warning mb-2">3</div>
              <p className="text-sm text-muted-foreground">Annotators needing attention</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Real-time Anomaly Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
              <div>
                <p className="font-medium text-warning">Quality Spike Detected</p>
                <p className="text-sm text-muted-foreground">Unusual error pattern in Task Group B</p>
              </div>
              <div className="text-sm text-muted-foreground">2 mins ago</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
              <div>
                <p className="font-medium text-success">Performance Recovery</p>
                <p className="text-sm text-muted-foreground">Sarah Miller's accuracy back to normal range</p>
              </div>
              <div className="text-sm text-muted-foreground">15 mins ago</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-info/5 border border-info/20 rounded-lg">
              <div>
                <p className="font-medium text-info">Capacity Threshold</p>
                <p className="text-sm text-muted-foreground">Object Detection team approaching 85% capacity</p>
              </div>
              <div className="text-sm text-muted-foreground">32 mins ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}