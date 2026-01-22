import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "../supabaseClient";

// Components
import Hero, { HeroData } from "@/components/Landing/Hero"; // HeroData interface export hona chahiye Hero.tsx se
import Features from "@/components/Landing/Features";
import LeadForm from "@/components/Landing/LeadForm";
import Footer from "@/components/Landing/Footer";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

// Types
interface FeatureItem {
  title: string;
  desc: string;
}

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // State
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [featuresData, setFeaturesData] = useState<FeatureItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('landing_content')
          .select('section_key, content');

        if (error) throw error;

        if (data) {
          const heroSection = data.find(item => item.section_key === 'hero');
          if (heroSection) setHeroData(heroSection.content as HeroData);

          const featureSection = data.find(item => item.section_key === 'features');
          // Check if content is an object and has items
          if (featureSection && typeof featureSection.content === 'object' && featureSection.content !== null) {
             // Type assertion to safely access items
             const contentObj = featureSection.content as { items?: FeatureItem[] };
             if (contentObj.items) {
               setFeaturesData(contentObj.items);
             }
          }
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Mahima Academy" className="h-10 w-10 rounded-xl" />
            <span className="font-bold text-xl text-foreground hidden sm:inline">Mahima Academy</span>
          </Link>
          <div className="flex items-center gap-3">
             {/* Buttons... */}
            <Link to="/courses"><Button variant="ghost">Courses</Button></Link>
            {isAuthenticated ? (
              <Link to="/dashboard"><Button>Dashboard</Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost">Login</Button></Link>
                <Link to="/signup"><Button>Sign Up</Button></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <Hero data={heroData} />
        <Features items={featuresData} />
        
        {/* IMPORTANT FIX: No props passed here. LeadForm handles logic internally. */}
        <LeadForm />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
