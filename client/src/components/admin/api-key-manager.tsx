import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Eye, EyeOff, Plus, AlertTriangle } from "lucide-react";
import { ChatAPI } from "@/lib/chat-api";
import { useToast } from "@/hooks/use-toast";

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newApiKey, setNewApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadApiKeys = async () => {
    try {
      const keys = await ChatAPI.getApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error("Failed to load API keys:", error);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  const handleAddApiKey = async () => {
    if (!newApiKey.trim()) return;

    setIsLoading(true);
    try {
      await ChatAPI.addApiKey(newApiKey);
      setNewApiKey("");
      await loadApiKeys();
      toast({
        title: "Success",
        description: "API key added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add API key",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activeKey = apiKeys.find(key => key.isActive === 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key size={20} className="text-[var(--chat-primary)]" />
          API Key Management
        </CardTitle>
        <CardDescription>
          Manage your AI service API keys
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Current API Key
          </label>
          <div className="flex gap-2">
            <Input
              type={showKey ? "text" : "password"}
              value={activeKey?.key || "No API key configured"}
              readOnly
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--chat-text)]">
            New API Key
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="flex-1 bg-[var(--chat-surface-light)] border-[var(--chat-border)] text-[var(--chat-text)]"
            />
            <Button
              onClick={handleAddApiKey}
              disabled={!newApiKey.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus size={16} className="mr-2" />
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Security Notice</span>
          </div>
          <p className="text-xs text-[var(--chat-text-secondary)]">
            API keys are stored securely and used only for chat completions. 
            Adding a new key will replace the current active key.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
