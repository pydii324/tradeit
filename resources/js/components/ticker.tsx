// resources/js/Components/WatchlistItem.jsx
import React from 'react';

export default function WatchlistItem({ item, isActive, onClick }) {
  return (
    <li
      onClick={() => onClick(item.title)}
      className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 transition ${
        isActive ? 'bg-foreground text-secondary' : ''
      }`}
    >
      <img
        src={item.img}
        alt={item.title}
        className="w-8 h-8 object-contain"
      />
      <div className="hover:text-secondary-foreground">
        <p className="font-semibold text-accent-foreground ">{item.title}</p>
        <p className="text-xs">{item.symbol}</p>
      </div>
    </li>
  );
}
