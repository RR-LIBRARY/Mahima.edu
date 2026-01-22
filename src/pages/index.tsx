import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "../supabaseClient";

// Components
import Hero from "@/components/Landing/Hero";
import Features from "@/components/Landing/Features";
import LeadForm from "@/components/Landing/LeadForm";
import Footer from "@/components/Landing/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast"; // Assuming you use shadcn/ui toast
import logo from "@/assets/logo.png";

// Types for our Database Data
interface HeroContent {
  title: string;
  subtitle: string;
  cta_text: string;
}

interface FeatureItem {
  title: string;
  desc: string;
}

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // State for Dynamic Content
  const [heroData, setHeroData] = useState<HeroContent | null>(null);
  const [featuresData, setFeaturesData] = useState<FeatureItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Landing Page Content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('landing_content')
          .select('section_key, content');

        if (error) throw error;

        if (data) {
          // Parse Hero Data
          const heroSection = data.find(item => item.section_key === 'hero');
          if (heroSection) setHeroData(heroSection.content);

          // Parse Features Data
          const featureSection = data.find(item => item.section_key === 'features');
          if (featureSection && featureSection.content?.items) {
            setFeaturesData(featureSection.content.items);
          }
        }
      } catch (error) {
        console.error("Error fetching site content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // 2. Logic to Handle Lead Form Submission
  const handleLeadSubmit = async (formData: { name: string; email: string; phone?: string }) => {
    try {
      const { error } = await supabase.from('leads').insert([
        {
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your details have been submitted. We will contact you soon.",
      });
      return true; // Return success status
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong.",
      });
      return false;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Mahima Academy" className="h-10 w-10 rounded-xl" />
            <span className="font-bold text-xl text-foreground hidden sm:inline">
              Mahima Academy
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/courses">
              <Button variant="ghost" className="text-foreground hover:bg-muted">
                Courses
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground hover:bg-muted">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main content with padding for fixed nav */}
      <main className="pt-20">
        {/* Pass database data to components */}
        <Hero data={heroData} />
        
        <Features items={featuresData} />
        
        {/* Pass the submit handler to LeadForm */}
        <LeadForm onSubmit={handleLeadSubmit} />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
