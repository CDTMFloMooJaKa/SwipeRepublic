
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Stock, stocks } from '../components/StockSwiper';

// Additional stocks for the default watchlist
const defaultWatchlistStocks: Stock[] = [
  {
    id: 6,
    name: "Alphabet Inc.",
    ticker: "GOOGL",
    price: "$165.98",
    change: 0.87,
    description: "Technology company focusing on online advertising, search engine, cloud computing, and more.",
    industry: "Technology",
    image: "/lovable-uploads/8abae172-83fe-4ef8-aadd-fb27c22ba5a7.png"
  },
  {
    id: 7,
    name: "Meta Platforms Inc.",
    ticker: "META",
    price: "$478.22",
    change: 1.54,
    description: "Technology company that owns Facebook, Instagram, WhatsApp, and focuses on social media, advertising, and metaverse technologies.",
    industry: "Technology",
    image: "/lovable-uploads/42dec5de-4be6-487c-902e-1c251e61c932.png"
  },
];

interface WatchlistContextType {
  watchlist: Stock[];
  addToWatchlist: (stock: Stock) => void;
  removeFromWatchlist: (stockId: number) => void;
}

export const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  addToWatchlist: () => {},
  removeFromWatchlist: () => {},
});

export const WatchlistProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Stock[]>(defaultWatchlistStocks);

  const addToWatchlist = (stock: Stock) => {
    setWatchlist(prev => {
      // Check if the stock is already in the watchlist
      if (!prev.some(item => item.id === stock.id)) {
        return [...prev, stock];
      }
      return prev;
    });
  };

  const removeFromWatchlist = (stockId: number) => {
    setWatchlist(prev => prev.filter(stock => stock.id !== stockId));
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
