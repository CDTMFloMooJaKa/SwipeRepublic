
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StoryProgressIndicator from './StoryProgressIndicator';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export interface StoryCarouselProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  slides: React.ReactNode[];
  title: React.ReactNode;
  autoAdvanceDuration?: number;
  isPaused?: boolean;
  onPauseChange?: (paused: boolean) => void;
}

const StoryCarousel: React.FC<StoryCarouselProps> = ({
  isOpen,
  onOpenChange,
  slides,
  title,
  autoAdvanceDuration = 8000, // Default to 8 seconds per slide
  isPaused: externalIsPaused,
  onPauseChange
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [internalIsPaused, setInternalIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  // Determine actual pause state (external prop takes precedence if provided)
  const isPaused = externalIsPaused !== undefined ? externalIsPaused : internalIsPaused;
  
  const totalSlides = slides.length;
  const PROGRESS_INTERVAL = 30; // Update every 30ms
  const STEPS = autoAdvanceDuration / PROGRESS_INTERVAL;
  
  // Reset active slide when opening the carousel
  useEffect(() => {
    if (isOpen) {
      setActiveSlide(0);
      setProgress(0);
    }
  }, [isOpen]);
  
  // Reset timer when slide changes
  const resetTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(0);
  };
  
  // Start timer for auto-advancing slides
  const startTimer = () => {
    resetTimer();
    setProgress(0);
    
    intervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / STEPS);
        
        // Move to next slide when progress hits 100%
        if (newProgress >= 100) {
          if (activeSlide < totalSlides - 1) {
            setActiveSlide(prev => prev + 1);
          } else {
            onOpenChange(false); // Close carousel on last slide
          }
          return 0;
        }
        
        return newProgress;
      });
    }, PROGRESS_INTERVAL);
  };
  
  // Effect to handle timer
  useEffect(() => {
    if (isOpen && !isPaused) {
      startTimer();
    } else {
      resetTimer();
    }
    
    return () => {
      resetTimer();
    };
  }, [isOpen, activeSlide, isPaused]);
  
  // Handle manual slide change
  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
    resetTimer();
    startTimer();
  };

  // Handle navigation with left/right clicks
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const containerWidth = e.currentTarget.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    
    // If click is in the right third of the screen
    if (clickX > containerWidth * 0.7) {
      if (activeSlide < totalSlides - 1) {
        // If not on last slide, go to next slide
        setActiveSlide(prev => prev + 1);
      } else {
        // If on last slide, close and navigate to home
        onOpenChange(false);
        navigate("/portfolio");
      }
    } 
    // If click is in the left third of the screen, go to previous slide
    else if (clickX < containerWidth * 0.3) {
      if (activeSlide > 0) {
        setActiveSlide(prev => prev - 1);
      }
    }
  };
  
  // Pause on touch
  const handleTouch = () => {
    if (onPauseChange) {
      onPauseChange(true);
    } else {
      setInternalIsPaused(true);
    }
  };
  
  // Resume on touch end
  const handleTouchEnd = () => {
    if (onPauseChange) {
      onPauseChange(false);
    } else {
      setInternalIsPaused(false);
    }
  };
  
  if (!isOpen) return null;
  
  const containerClasses = isMobile 
    ? "fixed inset-0 z-50 flex flex-col bg-white"
    : "fixed inset-0 z-50 flex flex-col bg-white phone-frame-content";
    
  return (
    <div 
      className={containerClasses}
      onPointerDown={handleTouch}
      onPointerUp={handleTouchEnd}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onOpenChange(false)}
          className="mr-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      
      {/* Progress Indicator */}
      <div className="px-4 py-2">
        <StoryProgressIndicator 
          totalSlides={totalSlides} 
          activeSlide={activeSlide} 
          progress={progress} 
          onSlideClick={handleSlideChange}
        />
      </div>
      
      {/* Content - No automatic overflow */}
      <div 
        className="flex-1 w-full overflow-hidden" 
        onClick={handleContainerClick}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full p-4 overflow-auto"
          >
            {slides[activeSlide]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StoryCarousel;
