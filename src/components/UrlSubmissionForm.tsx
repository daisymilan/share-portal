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
    <div className="space-y-4">
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
    </div>
  );
}