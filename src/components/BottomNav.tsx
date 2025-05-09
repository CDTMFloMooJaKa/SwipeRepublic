
import React from 'react';
import { Search } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-5 left-0 right-0 mx-auto px-4 max-w-md flex justify-between">
      <button className="bg-black text-white rounded-full py-3 px-6 flex items-center justify-center w-[48%]">
        <Search className="mr-2" size={20} />
        <span>Suche</span>
      </button>
      
      <button className="bg-black text-white rounded-full py-3 px-6 flex items-center justify-center w-[48%]">
        <span>Überweisen</span>
        <ArrowRight className="ml-2" size={20} />
      </button>
    </div>
  );
};

export default BottomNav;
