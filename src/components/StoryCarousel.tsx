
import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetClose } from '@/components/ui/sheet';
import StoryProgressIndicator from './StoryProgressIndicator';
import { Button } from './ui/button';

interface StoryCarouselProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  slides: React.ReactNode[];
  title: string;
  autoAdvanceDuration?: number;
  isPaused?: boolean;
  onPauseChange?: (paused: boolean) => void;
  onSlideChange?: (index: number) => void;
}

const StoryCarousel: React.FC<StoryCarouselProps> = ({
  isOpen,
  onOpenChange,
  slides,
  title,
  autoAdvanceDuration = 5000,
  isPaused = false,
  onPauseChange,
  onSlideChange
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Reset state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentSlide(0);
      setProgress(0);
      if (onPauseChange) onPauseChange(false);
    }
  }, [isOpen, onPauseChange]);
  
  // Handle slide change with external callback
  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentSlide);
    }
  }, [currentSlide, onSlideChange]);

  // Progress bar animation
  useEffect(() => {
    if (!isOpen || isPaused || isTouching) return;

    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const newProgress = Math.min(100, (elapsed / autoAdvanceDuration) * 100);
      
      setProgress(newProgress);
      
      if (newProgress < 100) {
        timerRef.current = window.requestAnimationFrame(animate);
      } else {
        handleNext();
      }
    };
    
    timerRef.current = window.requestAnimationFrame(animate);
    
    return () => {
      if (timerRef.current) {
        window.cancelAnimationFrame(timerRef.current);
      }
    };
  }, [isOpen, currentSlide, isPaused, isTouching, autoAdvanceDuration]);

  // Custom slide controls
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    } else {
      onOpenChange(false);
    }
  };
  
  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setProgress(0);
    }
  };

  // Touch events to pause progress
  const handleTouchStart = () => {
    setIsTouching(true);
    if (onPauseChange) onPauseChange(true);
  };
  
  const handleTouchEnd = () => {
    setIsTouching(false);
    if (onPauseChange) onPauseChange(false);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[92vh] p-0 rounded-t-xl overflow-hidden" 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-full flex flex-col bg-background">
          {/* Header with progress indicators */}
          <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <SheetClose className="rounded-full p-1.5 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </SheetClose>
            </div>
            
            <div className="px-4 pb-2 flex gap-1">
              {slides.map((_, i) => (
                <StoryProgressIndicator 
                  key={i}
                  isActive={i === currentSlide}
                  progress={i === currentSlide ? progress : i < currentSlide ? 100 : 0}
                />
              ))}
            </div>
          </div>
          
          {/* Slide content */}
          <div className="flex-1 overflow-hidden relative">
            <div className="h-full p-6">
              {slides[currentSlide]}
            </div>
            
            {/* Navigation buttons */}
            <Button 
              variant="outline" 
              size="icon" 
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm ${currentSlide === 0 ? 'invisible' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StoryCarousel;
