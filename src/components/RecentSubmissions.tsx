import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Clock } from "lucide-react";

type Submission = {
  url: string;
  timestamp: string;
  status: "completed" | "processing";
};

// This would typically come from your backend
const recentSubmissions: Submission[] = [
  {
    url: "https://example.com/article-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: "completed",
  },
  {
    url: "https://example.com/article-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: "processing",
  },
];

export const RecentSubmissions = () => {
  return (
    <Card className="p-6 w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">Recent Submissions</h2>
        <ScrollArea className="h-[200px] w-full rounded-md border">
          {recentSubmissions.map((submission, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                {submission.status === "completed" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium truncate max-w-[300px]">
                    {submission.url}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(submission.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  submission.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {submission.status}
              </span>
            </div>
          ))}
        </ScrollArea>
      </div>
    </Card>
  );
};