import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/routes";
import { useContact } from "@/hooks/use-contact";
import { Loader2, Send } from "lucide-react";

export function ContactForm() {
  const mutation = useContact();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = (data: InsertContactMessage) => {
    mutation.mutate(data, { onSuccess: () => form.reset() });
  };

  return (
    <section id="contact" className="py-24 bg-[#fafafa]">
      <div className="container mx-auto px-5">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-3 block">
              — Say Hello
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl text-secondary tracking-tight mb-3">
              Get in Touch
            </h2>
            <p className="text-muted-foreground text-sm">
              Have a question or feedback? We'd love to hear from you.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-[2rem] p-7 md:p-10 shadow-xl shadow-black/5 border border-border/40">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-secondary/70 uppercase tracking-wider block">
                    Name
                  </label>
                  <input
                    {...form.register("name")}
                    className="w-full bg-muted/50 border border-transparent rounded-xl px-4 py-3 text-sm text-secondary placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:bg-white focus:border-primary/50 focus:shadow-lg focus:shadow-primary/8 hover:bg-muted/80"
                    placeholder="John Doe"
                  />
                  {form.formState.errors.name && (
                    <p className="text-destructive text-xs font-semibold">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-secondary/70 uppercase tracking-wider block">
                    Email
                  </label>
                  <input
                    {...form.register("email")}
                    className="w-full bg-muted/50 border border-transparent rounded-xl px-4 py-3 text-sm text-secondary placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:bg-white focus:border-primary/50 focus:shadow-lg focus:shadow-primary/8 hover:bg-muted/80"
                    placeholder="john@example.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-destructive text-xs font-semibold">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary/70 uppercase tracking-wider block">
                  Message
                </label>
                <textarea
                  {...form.register("message")}
                  rows={4}
                  className="w-full bg-muted/50 border border-transparent rounded-xl px-4 py-3 text-sm text-secondary placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:bg-white focus:border-primary/50 focus:shadow-lg focus:shadow-primary/8 hover:bg-muted/80 resize-none"
                  placeholder="Tell us what you think..."
                />
                {form.formState.errors.message && (
                  <p className="text-destructive text-xs font-semibold">{form.formState.errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-3.5 bg-primary text-secondary font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
