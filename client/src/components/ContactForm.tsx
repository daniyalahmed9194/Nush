import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/routes";
import { useContact } from "@/hooks/use-contact";
import { Loader2 } from "lucide-react";

export function ContactForm() {
  const mutation = useContact();
  
  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-black/5 border border-border/50">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-secondary mb-4 uppercase">
              Get in Touch
            </h2>
            <p className="text-muted-foreground">
              Have a question or feedback? We'd love to hear from you.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary ml-1">Name</label>
                <input
                  {...form.register("name")}
                  className="w-full px-5 py-4 rounded-xl bg-muted/30 border-2 border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all font-medium"
                  placeholder="John Doe"
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-xs ml-1 font-semibold">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary ml-1">Email</label>
                <input
                  {...form.register("email")}
                  className="w-full px-5 py-4 rounded-xl bg-muted/30 border-2 border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all font-medium"
                  placeholder="john@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-destructive text-xs ml-1 font-semibold">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary ml-1">Message</label>
              <textarea
                {...form.register("message")}
                rows={4}
                className="w-full px-5 py-4 rounded-xl bg-muted/30 border-2 border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all font-medium resize-none"
                placeholder="Tell us what you think..."
              />
              {form.formState.errors.message && (
                <p className="text-destructive text-xs ml-1 font-semibold">{form.formState.errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-4 bg-primary text-secondary font-black text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" />
                  Sending...
                </div>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
