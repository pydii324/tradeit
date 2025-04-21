import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

import OrderBook from "@/components/futures/orderbook";
import TradingViewChart from "@/components/charts/tradingview-chart";
import FuturesTradingForm from "@/components/futures/futures-trading-form";
import PositionsTable from "@/components/futures/positions-table";
import { Card } from "@/components/ui/card";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Futures Trading",
    href: "/futures", // adjust this path to your actual route
  },
];

const FuturesTradingPage: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);

  useEffect(() => {
    if (!selectedPair) return;
  
    const symbol = selectedPair.replace("/", ""); // e.g., BTC/USDT -> BTCUSDT
  
    const fetchPriceData = async () => {
      try {
        // Fetch both the last price and 24hr stats
        const [priceRes, statsRes] = await Promise.all([
          fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`),
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
        ])
  
        const priceData = await priceRes.json()
        const statsData = await statsRes.json()
  
        setCurrentPrice(parseFloat(priceData.price))
        setPriceChangePercent(parseFloat(statsData.priceChangePercent))
      } catch (error) {
        console.error("Failed to fetch Binance data", error)
      }
    }
  
    fetchPriceData()
  
    const interval = setInterval(fetchPriceData, 1000) // every second
  
    return () => clearInterval(interval)
  }, [selectedPair])
  

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Futures Trading" />

      <div className="flex flex-col gap-4 p-4">
        {/* Left Column: Chart, Order Form, Positions */}
        <div className="space-y-4">
          <Card>
              <TradingViewChart symbol={selectedPair} height={400} />
          </Card>
          <Card>
            <FuturesTradingForm
              selectedPair={selectedPair}
              onPairChange={setSelectedPair}
              currentPrice={currentPrice}
              priceChangePercent={priceChangePercent} />
          </Card>
          <Card>
            <PositionsTable
              currentPrice={currentPrice} />
          </Card>
        </div>

        
      </div>
    </AppLayout>
  );
};

export default FuturesTradingPage;
