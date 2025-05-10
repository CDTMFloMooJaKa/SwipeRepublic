
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeWidget from "@/components/WelcomeWidget";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  const navigate = useNavigate();
  
  // Directly navigate to portfolio page when the component mounts
  useEffect(() => {
    navigate("/portfolio");
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-background">
      {/* WelcomeWidget is kept but not displayed */}
      <BottomNav />
    </div>
  );
};

export default Index;
