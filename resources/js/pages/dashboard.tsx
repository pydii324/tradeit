import { SectionCards } from '@/components/section-cards';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import TradingViewChart from '@/components/charts/tradingview-chart';
import { useState, useEffect } from 'react';
import WatchlistItem from '@/components/ticker';



export default function Dashboard() {
    const [chartTheme, setChartTheme] = useState('light');

    useEffect(() => {
      const checkTheme = () => {
        const isDark = document.documentElement.classList.contains('dark');
        setChartTheme(isDark ? 'dark' : 'light');
      };
  
      // Check on mount
      checkTheme();
  
      // Optional: Listen for class changes (if your app supports dynamic switching)
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
  
      return () => observer.disconnect();
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];

    const watchlist = [
        {
          symbol: 'NASDAQ:AAPL',
          title: 'Apple Inc.',
          img: '/images/tickers/aapl.png',
        },
        {
          symbol: 'NASDAQ:GOOGL',
          title: 'Alphabet Inc.',
          img: '/images/tickers/googl.png',
        },
        {
          symbol: 'NASDAQ:MSFT',
          title: 'Microsoft Corp.',
          img: '/images/tickers/msft.png',
        },
        {
          symbol: 'NASDAQ:TSLA',
          title: 'Tesla Inc.',
          img: '/images/tickers/tsla.png',
        },
    ];
    const [selectedSymbol, setSelectedSymbol] = useState(watchlist[0].symbol);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <SectionCards />
                {/* Main Section */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border shadow md:min-h-min">
                    <div className="flex h-full w-full">
                        {/* Watchlist */}
                        <aside className="w-[300px]">
                            {/* Header of Watchlist */}
                            <div className="sticky top-0 py-2">
                                <h2 className="text-center text-lg sm:text-lg md:text-xl font-bold text-foreground">Watchlist</h2>
                            </div>
                            <div className="flex flex-col h-full">
                            <ul>
                                {watchlist.map((item, index) => (
                                    <WatchlistItem
                                        key={index}
                                        item={item}
                                        isActive={item.symbol === selectedSymbol}
                                        onClick={setSelectedSymbol}
                                    />
                                ))}
                            </ul>
                            </div>
                        </aside>
                        {/* TradingView Chart */}
                        <div className="flex flex-1">
                            <TradingViewChart
                                symbol="BTCUSDT"
                                theme={chartTheme}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}