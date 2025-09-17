import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  actions?: BotAction[];
}

interface BotAction {
  type: "assignment" | "filter" | "export";
  data: any;
  success: boolean;
  message: string;
}

export function ConversationalBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hi! I'm your AI assistant. I can help you with job assignments, data filtering, and analytics. Try commands like 'Assign jobs X, Y, Z to user@email.com' or 'How many jobs are pending in Batch-1?'",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const processCommand = async (command: string): Promise<Message> => {
    const lowerCommand = command.toLowerCase();
    
    // Assignment commands
    if (lowerCommand.includes("assign") && lowerCommand.includes("to")) {
      const jobMatch = command.match(/jobs?\s+([^to]+)\s+to\s+(\S+@\S+)/i);
      if (jobMatch) {
        const jobs = jobMatch[1].split(/[,\s]+/).filter(j => j.trim());
        const assignee = jobMatch[2];
        
        return {
          id: Date.now().toString(),
          type: "bot",
          content: `Successfully assigned ${jobs.length} jobs to ${assignee}`,
          timestamp: new Date(),
          actions: [{
            type: "assignment",
            data: { jobs, assignee },
            success: true,
            message: `Jobs ${jobs.join(", ")} assigned to ${assignee}`
          }]
        };
      }
    }
    
    // Count/Status queries
    if (lowerCommand.includes("how many") || lowerCommand.includes("count")) {
      const batchMatch = command.match(/batch[-\s]*(\d+|\w+)/i);
      const statusMatch = command.match(/(pending|completed|in[_\s]progress|rejected|approved)/i);
      
      if (batchMatch) {
        const batchId = batchMatch[1];
        const status = statusMatch ? statusMatch[1].replace(/[_\s]/g, '_') : null;
        
        // Mock data - in real implementation, this would query actual data
        const mockCounts = {
          pending: 23,
          in_progress: 15,
          completed: 67,
          approved: 45,
          rejected: 8
        };
        
        if (status) {
          const count = mockCounts[status as keyof typeof mockCounts] || 0;
          return {
            id: Date.now().toString(),
            type: "bot",
            content: `Batch-${batchId} has ${count} ${status.replace('_', ' ')} jobs.`,
            timestamp: new Date()
          };
        } else {
          return {
            id: Date.now().toString(),
            type: "bot",
            content: `Batch-${batchId} summary:\n• Pending: ${mockCounts.pending}\n• In Progress: ${mockCounts.in_progress}\n• Completed: ${mockCounts.completed}\n• Total: ${mockCounts.pending + mockCounts.in_progress + mockCounts.completed}`,
            timestamp: new Date()
          };
        }
      }
    }
    
    // Show/Filter commands
    if (lowerCommand.includes("show") && (lowerCommand.includes("rejected") || lowerCommand.includes("approved"))) {
      const batchMatch = command.match(/batch[-\s]*(\d+|\w+)/i);
      const statusMatch = command.match(/(rejected|approved)/i);
      
      if (batchMatch && statusMatch) {
        const batchId = batchMatch[1];
        const status = statusMatch[1];
        
        return {
          id: Date.now().toString(),
          type: "bot",
          content: `Showing ${status} jobs in Batch-${batchId}. Found 8 jobs matching your criteria.`,
          timestamp: new Date(),
          actions: [{
            type: "filter",
            data: { batch: batchId, status },
            success: true,
            message: `Filtered to show ${status} jobs in Batch-${batchId}`
          }]
        };
      }
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      type: "bot",
      content: "I understand you want to work with the dashboard data. Could you try rephrasing? I can help with:\n• Job assignments: 'Assign jobs A, B, C to user@email.com'\n• Status queries: 'How many pending jobs in Batch-1?'\n• Data filtering: 'Show rejected jobs in Batch-2'",
      timestamp: new Date()
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate processing delay
    setTimeout(async () => {
      const botResponse = await processCommand(userMessage.content);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          AI Analytics Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted"
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    
                    {message.actions && (
                      <div className="mt-3 space-y-2">
                        {message.actions.map((action, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {action.success ? (
                              <CheckCircle className="w-4 h-4 text-success" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-destructive" />
                            )}
                            <Badge variant={action.success ? "default" : "destructive"} className="text-xs">
                              {action.message}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about assignments, job counts, or data filtering..."
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("How many pending jobs in Batch-1?")}
              className="text-xs"
            >
              Job counts
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Show rejected jobs in Batch-2")}
              className="text-xs"
            >
              Filter data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Assign jobs job-001, job-002 to user@example.com")}
              className="text-xs"
            >
              Assign jobs
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}