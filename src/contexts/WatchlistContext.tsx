
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
    image: "/lovable-uploads/87e9327e-9fdd-4acb-8304-e8c06eadf118.png" // Using Google/Alphabet appropriate image
  },
  {
    id: 7,
    name: "Meta Platforms Inc.",
    ticker: "META",
    price: "$478.22",
    change: 1.54,
    description: "Technology company that owns Facebook, Instagram, WhatsApp, and focuses on social media, advertising, and metaverse technologies.",
    industry: "Technology",
    image: "/lovable-uploads/88d6a29b-923a-4da2-b04e-81ca9bf9874c.png" // Using Meta appropriate image
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
