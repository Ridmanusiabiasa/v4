import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--chat-bg)]">
      <Card className="w-full max-w-md mx-4 bg-[var(--chat-surface)] border-[var(--chat-border)]">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-[var(--chat-text)]">Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-[var(--chat-text-secondary)]">
            Looks like you've followed a broken link or entered a URL that doesn't exist.
          </p>
          
          <div className="mt-6">
            <Link href="/">
              <Button className="w-full" variant="default">
                <Home className="w-4 h-4 mr-2" />
                Return to Chat
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
