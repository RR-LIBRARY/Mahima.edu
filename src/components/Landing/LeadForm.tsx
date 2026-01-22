import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { supabase } from "../supabaseClient";

const LeadForm = () => {
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    grade: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.parentName || !formData.email || !formData.grade) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Database me data bhejna
      // Hum column names match kar rahe hain jo humne SQL me banaye (parent_name, etc.)
      const { error } = await supabase
        .from('leads') 
        .insert([
          {
            parent_name: formData.parentName,
            email: formData.email,
            grade: formData.grade,
          }
        ]);

      if (error) {
        throw error;
      }

      // 2. Success message
      toast.success("Thank you! We'll contact you soon.");
      
      // Form reset karna
      setFormData({ parentName: "", email: "", grade: "" });
      
    } catch (error: any) {
      console.error("Error submitting lead:", error);
      toast.error(error.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-[image:var(--gradient-primary)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-xl mx-auto bg-card rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Get Started Today
            </h2>
            <p className="text-muted-foreground">
              Schedule a free demo class for your child
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Parent's Name"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="bg-background border-border"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background border-border"
              />
            </div>
            <div>
              <Select
                value={formData.grade}
                onValueChange={(value) => setFormData({ ...formData, grade: value })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((grade) => (
                    <SelectItem key={grade} value={String(grade)}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Request Demo"}
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;
