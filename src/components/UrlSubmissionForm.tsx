import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  articleUrl: z.string().url("Please enter a valid URL"),
});

export function UrlSubmissionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      articleUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // First, make the n8n webhook request
      const response = await fetch("https://n8n.servenorobot.com/webhook/social-media-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleUrl: values.articleUrl,
          source: "web_app",
        }),
      });

      if (!response.ok) throw new Error("Failed to submit URL");

      // Make the Perplexity API request
      const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: "Summarize the following article in detail"
            },
            {
              role: "user",
              content: values.articleUrl
            }
          ],
          max_tokens: 500,
          temperature: 0.2,
          top_p: 0.9,
          search_domain_filter: ["perplexity.ai"],
          return_images: false,
          return_related_questions: false,
          search_recency_filter: "month",
          top_k: 0,
          stream: false,
          presence_penalty: 0,
          frequency_penalty: 1
        }),
      });

      if (!perplexityResponse.ok) {
        throw new Error("Failed to process with Perplexity");
      }

      // Save to localStorage for recent submissions
      const submission = {
        id: uuidv4(),
        articleUrl: values.articleUrl,
        timestamp: new Date().toISOString(),
        status: "success" as const,
      };

      const stored = localStorage.getItem("submissions");
      const submissions = stored ? JSON.parse(stored) : [];
      localStorage.setItem(
        "submissions",
        JSON.stringify([submission, ...submissions.slice(0, 9)])
      );

      toast({
        title: "Success",
        description: "URL submitted and processed successfully",
      });

      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      
      // Save failed submission to history
      const submission = {
        id: uuidv4(),
        articleUrl: values.articleUrl,
        timestamp: new Date().toISOString(),
        status: "error" as const,
      };

      const stored = localStorage.getItem("submissions");
      const submissions = stored ? JSON.parse(stored) : [];
      localStorage.setItem(
        "submissions",
        JSON.stringify([submission, ...submissions.slice(0, 9)])
      );

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit URL. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="articleUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter URL to share"
                  {...field}
                  className="h-12 text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-12 text-lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit URL"}
        </Button>
      </form>
    </Form>
  );
}