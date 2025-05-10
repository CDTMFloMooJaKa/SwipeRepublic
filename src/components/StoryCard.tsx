
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface StoryCardProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  onClick: () => void;
  variant?: 'card' | 'button';
}

const StoryCard: React.FC<StoryCardProps> = ({
  title,
  subtitle,
  backgroundImage,
  onClick,
  variant = 'card'
}) => {
  const commonStyles = {
    minHeight: "120px",
    width: "70%", 
    minWidth: "240px"
  };

  const commonClassNames = "p-4 flex flex-col justify-between border rounded-lg hover:bg-gray-50/80 transition-all relative overflow-hidden flex-shrink-0";

  const contentElement = (
    <>
      {/* Background image div */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          opacity: 0.85
        }} 
      />
      
      {/* Overlay to ensure text visibility */}
      <div className="absolute inset-0 bg-black/30 z-10" />
      
      {/* Content with z-index to appear above the background */}
      <div className="relative z-20 h-full flex flex-col justify-end">
        <div>
          <p className="text-gray-100 text-xs mb-1">{subtitle}</p>
        </div>
        <div className="flex items-center justify-between w-full">
          {title === "Your Insights" && (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          )}
          {title !== "Your Insights" && (
            <h2 className="text-xl font-bold text-white">{title}</h2>
          )}
        </div>
      </div>
    </>
  );

  if (variant === 'button') {
    return (
      <Button 
        variant="outline" 
        className={`${commonClassNames} cursor-pointer h-auto items-start`}
        onClick={onClick} 
        style={commonStyles}
      >
        {contentElement}
      </Button>
    );
  }

  return (
    <Card 
      className={`${commonClassNames} cursor-pointer`}
      style={commonStyles}
      onClick={onClick}
    >
      {contentElement}
    </Card>
  );
};

export default StoryCard;
