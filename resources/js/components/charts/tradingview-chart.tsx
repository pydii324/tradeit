// resources/js/Components/TradingViewChart.jsx
import React, { useEffect, useRef } from 'react';

const TradingViewChart = ({ symbol, theme }) => {
  const containerRef = useRef();

  useEffect(() => {
    // Clear any existing widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: 'tradingview_chart',
          symbol: symbol,
          interval: 'D',
          width: '100%',
          height: '100%',
          timezone: 'Etc/UTC',
          theme: theme,
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
      // Clean up on unmount or dependency change
      containerRef.current.innerHTML = '';
    };
  }, [symbol, theme]); // 🧠 Trigger effect when symbol or theme changes

  return <div className="w-full h-full" id="tradingview_chart" ref={containerRef}></div>;
};

export default TradingViewChart;
