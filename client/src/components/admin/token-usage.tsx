import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download } from "lucide-react";
import { ChatAPI } from "@/lib/chat-api";
import { TokenUsageStats } from "@/types/chat";

export function TokenUsage() {
  const [stats, setStats] = useState<TokenUsageStats>({
    totalTokens: 0,
    todayTokens: 0,
    usageByModel: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    try {
      const data = await ChatAPI.getTokenUsage();
      setStats(data);
    } catch (error) {
      console.error("Failed to load token usage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      ...stats
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `token-usage-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className="bg-[var(--chat-surface)] border-[var(--chat-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--chat-text)] flex items-center gap-2">
            <BarChart3 size={20} className="text-[var(--chat-primary)]" />
            Token Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-[var(--chat-surface-light)] rounded mb-2"></div>
              <div className="h-8 bg-[var(--chat-surface-light)] rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 size={20} className="text-[var(--chat-primary)]" />
          Token Usage
        </CardTitle>
        <CardDescription>
          Track your API usage and costs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-sm text-muted-foreground">Total Tokens</div>
            <div className="text-xl font-semibold text-primary">
              {stats.totalTokens.toLocaleString()}
            </div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="text-sm text-[var(--chat-text-secondary)]">Today</div>
            <div className="text-xl font-semibold text-blue-400">
              {stats.todayTokens.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-[var(--chat-surface-light)] rounded-lg p-3">
          <div className="text-sm text-[var(--chat-text-secondary)] mb-2">Usage by Model</div>
          <div className="space-y-2">
            {Object.entries(stats.usageByModel).map(([model, tokens]) => (
              <div key={model} className="flex justify-between items-center">
                <span className="text-sm text-[var(--chat-text)]">{model}</span>
                <span className="text-sm font-medium text-[var(--chat-text)]">
                  {tokens.toLocaleString()} tokens
                </span>
              </div>
            ))}
            {Object.keys(stats.usageByModel).length === 0 && (
              <p className="text-sm text-[var(--chat-text-secondary)]">No usage data available</p>
            )}
          </div>
        </div>

        <Button
          onClick={handleExport}
          variant="outline"
          className="w-full border-[var(--chat-border)] hover:bg-[var(--chat-surface-light)]"
        >
          <Download size={16} className="mr-2" />
          Export Usage Report
        </Button>
      </CardContent>
    </Card>
  );
}
