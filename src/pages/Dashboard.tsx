import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import ClassCard from "@/components/dashboard/ClassCard";
import FeatureCard from "@/components/dashboard/FeatureCard";
import { 
  Users, 
  Calendar, 
  FileText, 
  ClipboardCheck, 
  BookOpen, 
  MessageCircle,
  GraduationCap,
  Bell,
  Loader2
} from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // 1. State for Real Data
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 2. Fetch User Profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Get current logged in user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login"); // If no user, send to login
          return;
        }

        // Fetch user details from 'profiles' table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);

      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Static Data (Features links remain same)
  const features = [
    { icon: ClipboardCheck, label: "Attendance", color: "primary" as const, path: "/attendance" },
    { icon: FileText, label: "Report Card", color: "secondary" as const, path: "/reports" },
    { icon: Users, label: "Students", color: "success" as const, path: "/students" },
    { icon: Calendar, label: "Timetable", color: "accent" as const, path: "/timetable" },
    { icon: Bell, label: "Notice Board", color: "primary" as const, path: "/notices" },
    { icon: MessageCircle, label: "Messages", color: "secondary" as const, path: "/messages" },
    { icon: BookOpen, label: "Syllabus", color: "success" as const, path: "/syllabus" },
    { icon: GraduationCap, label: "Material", color: "accent" as const, path: "/materials" },
  ];

  // Grade Options (1 to 12)
  const gradeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header with Real Name */}
      <Header 
        onMenuClick={() => setSidebarOpen(true)} 
        userName={profile?.full_name || "User"} 
      />

      <main className="flex-1 overflow-y-auto pb-6">
        {/* Greeting Section */}
        <section className="px-5 py-6">
          <p className="text-muted-foreground text-sm">Good Morning,</p>
          <h1 className="text-2xl font-bold text-foreground mt-1">
            {profile?.full_name || "Teacher"}
          </h1>
          <p className="text-xs text-primary font-medium mt-1 uppercase tracking-wide">
            {profile?.role || "Member"} Dashboard
          </p>
        </section>

        {/* 
           NOTE: Ye UI Teacher ke liye hai (Select Class). 
           Agar User Parent hai, toh humein yahan unke "Purchased Courses" dikhane chahiye.
           Filhal main aapka purana design maintain kar raha hu.
        */}

        {/* Class Grid */}
        <section className="px-5">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Select Class</h2>
          <div className="grid grid-cols-2 gap-4">
            {gradeOptions.map((grade, index) => (
              <ClassCard
                key={grade}
                grade={grade}
                onClick={() => navigate(`/attendance?grade=${grade}`)}
                variant={index === gradeOptions.length - 1 ? "featured" : "default"}
              />
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-5 mt-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => (
              <FeatureCard
                key={feature.label}
                icon={feature.icon}
                label={feature.label}
                color={feature.color}
                onClick={() => navigate(feature.path)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
