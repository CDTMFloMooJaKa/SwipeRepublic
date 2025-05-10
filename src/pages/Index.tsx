
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeWidget from "@/components/WelcomeWidget";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const isMobile = useIsMobile();
  
  // Only navigate to portfolio if welcome widget is dismissed
  useEffect(() => {
    if (!showWelcome && isMobile !== undefined) {
      navigate("/portfolio");
    }
  }, [showWelcome, navigate, isMobile]);
  
  return (
    <div className="min-h-screen bg-background">
      {/* This empty div ensures the page has some content even if the WelcomeWidget is not shown */}
      <WelcomeWidget
        userName="Max Mustermann"
        isOpen={showWelcome}
        onOpenChange={setShowWelcome}
      />
      <BottomNav />
    </div>
  );
};

export default Index;
