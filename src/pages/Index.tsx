
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeWidget from "@/components/WelcomeWidget";

const Index = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Only navigate to portfolio if welcome widget is dismissed
  useEffect(() => {
    if (!showWelcome) {
      navigate("/portfolio");
    }
  }, [showWelcome, navigate]);
  
  return (
    <div>
      <WelcomeWidget
        userName="Max Mustermann"
        isOpen={showWelcome}
        onOpenChange={setShowWelcome}
      />
    </div>
  );
};

export default Index;
