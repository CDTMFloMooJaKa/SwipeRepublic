
import React from 'react';

export interface StoryProgressIndicatorProps {
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
    <div className="flex gap-1 w-full">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <div
          key={index}
          className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
          onClick={() => onSlideClick?.(index)}
        >
          <div
            className="h-full bg-gray-600 rounded-full"
            style={{
              width: index === activeSlide ? `${progress}%` : index < activeSlide ? '100%' : '0%'
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default StoryProgressIndicator;
