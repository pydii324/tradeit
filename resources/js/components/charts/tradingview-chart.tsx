// resources/js/Components/TradingViewChart.jsx
import React, { useEffect, useRef, useState } from 'react';

const TradingViewChart = ({ symbol = "BINANCE:BTCUSDT" }) => {
  const containerRef = useRef();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Get current theme from <html class="dark">
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    // Clear container before adding the script again
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: 'tradingview_chart',
          symbol,
          interval: 'D',
          width: '100%',
          height: 400, // 👈 FIX: Set explicit height
          timezone: 'Etc/UTC',
          theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_top_toolbar: false,
          save_image: false,
          studies: [],
        });
      }
    };

    containerRef.current.appendChild(script);

    return () => {
      containerRef.current.innerHTML = '';
    };
  }, [symbol, theme]);

  return (
    <div className="w-full h-[400px]" id="tradingview_chart" ref={containerRef}></div> // 👈 FIX: Apply same height here
  );
};

export default TradingViewChart;
