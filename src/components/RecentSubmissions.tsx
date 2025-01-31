import { useQuery } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface Submission {
  id: string;
  articleUrl: string;
  timestamp: string;
  status: "success" | "error" | "pending";
}

export function RecentSubmissions() {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["submissions"],
    queryFn: async () => {
      // In a real app, this would fetch from your API
      // For demo, we'll use localStorage
      const stored = localStorage.getItem("submissions");
      return stored ? (JSON.parse(stored) as Submission[]) : [];
    },
    // Refetch every 5 seconds to show new submissions
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">Recent Submissions</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary">Recent Submissions</h2>
        <Card className="p-6">
          <p className="text-gray-500">No submissions yet</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary">Recent Submissions</h2>
      <div className="space-y-3">
        {submissions.map((submission) => (
          <Card key={submission.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-gray-900 truncate max-w-[300px]">
                  {submission.articleUrl}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(submission.timestamp).toLocaleString()}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  submission.status === "success"
                    ? "bg-green-100 text-green-800"
                    : submission.status === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {submission.status}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}