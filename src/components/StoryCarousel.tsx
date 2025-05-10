
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import StoryProgressIndicator from './StoryProgressIndicator';
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';

export interface StorySlide {
  title: string;
  content: React.ReactNode;
}

interface StoryCarouselProps {
  title?: string;
  slides: StorySlide[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const StoryCarousel: React.FC<StoryCarouselProps> = ({
  title,
  slides,
  isOpen,
  onOpenChange
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  
  // Auto-advance timer
  useEffect(() => {
    if (!isOpen || paused) return;
    
    const timePerSlide = 10000; // 10 seconds per slide
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        if (newProgress >= 100) {
          setActiveSlideIndex((prevIndex) => {
            if (prevIndex >= slides.length - 1) {
              // Last slide - close the drawer
              onOpenChange(false);
              return 0;
            }
            return prevIndex + 1;
          });
          return 0;
        }
        return newProgress;
      });
    }, timePerSlide / 100); // Update progress every 100ms
    
    return () => clearInterval(timer);
  }, [isOpen, paused, activeSlideIndex, slides.length, onOpenChange]);
  
  // Reset progress when changing slides manually
  useEffect(() => {
    setProgress(0);
  }, [activeSlideIndex]);
  
  // Reset to the first slide and progress when drawer opens
  useEffect(() => {
    if (isOpen) {
      setActiveSlideIndex(0);
      setProgress(0);
    }
  }, [isOpen]);
  
  // Handle drawer touch to pause/resume
  const handleTouch = () => {
    setPaused((prev) => !prev);
  };
  
  // Navigate to specific slide
  const goToSlide = (index: number) => {
    setActiveSlideIndex(index);
    setProgress(0);
  };
  
  const currentSlide = slides[activeSlideIndex];
  
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent className="h-[92vh] rounded-t-xl">
        <DrawerTitle className="sr-only">{title || "Story"}</DrawerTitle>
        
        {/* Progress Indicator */}
        <div className="px-4 pt-4">
          <StoryProgressIndicator
            totalSlides={slides.length}
            activeSlide={activeSlideIndex}
            progress={progress}
            onSlideClick={goToSlide}
          />
        </div>
        
        <div className="flex justify-end p-2">
          <DrawerClose className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-6 w-6" />
          </DrawerClose>
        </div>
        
        <div 
          className="px-6 pt-2 pb-16 max-w-md mx-auto h-full overflow-y-auto"
          onClick={handleTouch}
        >
          {/* Current slide title */}
          <h2 className="text-2xl font-bold mb-5">{currentSlide.title}</h2>
          
          {/* Current slide content */}
          <div>{currentSlide.content}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default StoryCarousel;
