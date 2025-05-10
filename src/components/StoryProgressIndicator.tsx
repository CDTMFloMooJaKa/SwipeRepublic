
import React from 'react';

interface StoryProgressIndicatorProps {
  totalSlides: number;
  activeSlide: number;
  progress: number;
  onSlideClick?: (index: number) => void;
}

const StoryProgressIndicator: React.FC<StoryProgressIndicatorProps> = ({ 
  totalSlides, 
  activeSlide, 
  progress,
  onSlideClick
}) => {
  return (
    <div className="w-full flex gap-1 px-2 pt-2">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <div 
          key={index}
          className="h-1 bg-gray-300 rounded-full flex-1 overflow-hidden cursor-pointer"
          onClick={() => onSlideClick?.(index)}
        >
          <div 
            className="h-full bg-gray-800 rounded-full"
            style={{ 
              width: index < activeSlide ? '100%' : 
                     index === activeSlide ? `${progress}%` : '0%',
              transition: index === activeSlide ? 'width 0.1s linear' : 'none'
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default StoryProgressIndicator;
