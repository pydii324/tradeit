// resources/js/Components/TradingViewChart.jsx
import React, { useEffect, useRef, useState } from 'react';

const TradingViewChart = ({ symbol = "BINANCE:BTCUSDT", height = 400 }: {symbol: string, height: number | string}) => {
  const containerRef = useRef();
  const [theme, setTheme] = useState('dark');

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
          height: height,
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
    <div className="w-full" id="tradingview_chart" ref={containerRef}></div>
  );
};

export default TradingViewChart;
