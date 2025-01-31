import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";

export const UrlSubmissionForm = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    try {
      const response = await fetch("https://n8n.servenorobot.com/webhook/social-media-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleUrl: url,
          source: "web_app",
        }),
      });

      if (!response.ok) throw new Error("Failed to submit URL");

      toast({
        title: "Success!",
        description: "Your URL has been submitted for processing.",
      });
      setUrl("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-primary">Submit Content</h2>
          <p className="text-sm text-gray-500">
            Enter the URL of the content you want to distribute across social media platforms.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="ml-2">Submit</span>
          </Button>
        </div>
      </form>
    </Card>
  );
};