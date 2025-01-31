import { UrlSubmissionForm } from "@/components/UrlSubmissionForm";
import { RecentSubmissions } from "@/components/RecentSubmissions";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            Social Media Content Distribution
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Submit your content once and distribute it across multiple social media platforms
            automatically.
          </p>
        </div>
        <UrlSubmissionForm />
        <RecentSubmissions />
      </div>
    </div>
  );
};

export default Index;