import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, X, LogOut } from "lucide-react";
import { ApiKeyManager } from "./api-key-manager";
import { TokenUsage } from "./token-usage";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">RidChat AI - Admin Panel</h1>
                <p className="text-muted-foreground">System Configuration & Monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                onClick={onLogout}
                variant="outline"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ApiKeyManager />
          <TokenUsage />
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}

function SystemStatus() {
  return (
    <Card className="bg-[var(--chat-surface)] border-[var(--chat-border)]">
      <CardHeader>
        <CardTitle className="text-[var(--chat-text)] flex items-center gap-2">
          <Shield size={20} className="text-[var(--chat-primary)]" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--chat-text)]">API Connection</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-green-400">Connected</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--chat-text)]">Response Time</span>
          <span className="text-sm text-[var(--chat-text-secondary)]">~1.2s</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--chat-text)]">Storage Used</span>
          <span className="text-sm text-[var(--chat-text-secondary)]">
            {(JSON.stringify(localStorage).length / 1024 / 1024).toFixed(1)}MB
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Configuration() {
  return (
    <Card className="bg-[var(--chat-surface)] border-[var(--chat-border)]">
      <CardHeader>
        <CardTitle className="text-[var(--chat-text)] flex items-center gap-2">
          <Shield size={20} className="text-[var(--chat-primary)]" />
          Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--chat-text)]">Default Model</label>
          <select className="w-full bg-[var(--chat-surface-light)] border border-[var(--chat-border)] rounded-lg px-3 py-2 text-sm text-[var(--chat-text)]">
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
            <option value="gpt-4.1-nano">GPT-4.1 Nano</option>
            <option value="gpt-4.1">GPT-4.1</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--chat-text)]">Max Tokens</label>
          <input
            type="number"
            className="w-full bg-[var(--chat-surface-light)] border border-[var(--chat-border)] rounded-lg px-3 py-2 text-sm text-[var(--chat-text)]"
            defaultValue="150"
            min="1"
            max="4000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--chat-text)]">Temperature</label>
          <input
            type="range"
            className="w-full"
            min="0"
            max="1"
            step="0.1"
            defaultValue="0.7"
          />
          <div className="flex justify-between text-xs text-[var(--chat-text-secondary)] mt-1">
            <span>Focused</span>
            <span>Balanced</span>
            <span>Creative</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
