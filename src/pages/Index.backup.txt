import Hero from "@/components/Landing/Hero";
import Features from "@/components/Landing/Features";
import LeadForm from "@/components/Landing/LeadForm";
import Footer from "@/components/Landing/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Index = () => {
  const { isAuthenticated } = useAuth();

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
        <Hero />
        <Features />
        <LeadForm />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
