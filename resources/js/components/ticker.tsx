// resources/js/Components/WatchlistItem.jsx
import React from 'react';

export default function WatchlistItem({ item, isActive, onClick }) {
  return (
    <li
    onClick={() => onClick(item.symbol)}
      className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-muted-foreground/50 border-b transition ${
        isActive ? 'bg-muted-foreground/30' : ''
      }`}
    >
      <div>
        <p className="font-semibold text-accent-foreground ">{item.title}</p>
        <p className="text-xs">{item.symbol}</p>
      </div>
    </li>
  );
}
