
import React, { ReactNode } from 'react';
import { Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PhoneFrameProps {
  children: ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  // On mobile devices, render the content without the frame
  if (isMobile) {
    return <>{children}</>;
  }
  
  // On desktop, render the phone frame
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-[390px] h-[844px] bg-white rounded-[60px] shadow-2xl overflow-hidden border-[14px] border-black">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[180px] h-[30px] bg-black rounded-b-[20px] z-50 flex items-center justify-center">
          <div className="w-[10px] h-[10px] bg-gray-500 rounded-full mr-2"></div>
        </div>
        
        {/* Actual content */}
        <div className="h-full overflow-hidden" style={{ maxWidth: '362px', maxHeight: '750px' }}>
          <div className="phone-frame-content h-full overflow-y-auto overflow-x-hidden" style={{ maxHeight: '750px' }}>
            {children}
          </div>
        </div>
        
        {/* Home bar indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[134px] h-[5px] bg-gray-400 rounded-full z-50"></div>
        
        {/* Phone model indicator */}
        <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 text-gray-400 text-xs flex items-center">
          <Smartphone className="mr-1 w-4 h-4" />
          <span>Mobile View</span>
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;
