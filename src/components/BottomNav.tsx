
import React from 'react';
import { Search, ArrowRight, Swipe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StockSwiper from './StockSwiper';
import { useState } from 'react';

const BottomNav: React.FC = () => {
  const [showSwiper, setShowSwiper] = useState(false);
  const navigate = useNavigate();
  
  return (
    <>
      <div className="fixed bottom-5 left-0 right-0 mx-auto px-4 max-w-md flex justify-between items-center">
        <button className="bg-black text-white rounded-full py-3 px-6 flex items-center justify-center w-[40%]">
          <Search className="mr-2" size={20} />
          <span>Suche</span>
        </button>
        
        <button 
          onClick={() => setShowSwiper(true)}
          className="bg-purple-600 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
        >
          <Swipe className="w-6 h-6" />
        </button>
        
        <button className="bg-black text-white rounded-full py-3 px-6 flex items-center justify-center w-[40%]">
          <span>Überweisen</span>
          <ArrowRight className="ml-2" size={20} />
        </button>
      </div>
      
      <StockSwiper isOpen={showSwiper} onOpenChange={setShowSwiper} />
    </>
  );
};

export default BottomNav;
