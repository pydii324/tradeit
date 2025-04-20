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
  const [currentPrice, setCurrentPrice] = useState<number>(0)

  useEffect(() => {
    if (!selectedPair) return;
  
    const symbol = selectedPair.replace("/", ""); // e.g., BTC/USDT -> BTCUSDT
  
    const fetchPrice = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        const data = await response.json();
        setCurrentPrice(parseFloat(data.price));
      } catch (error) {
        console.error("Failed to fetch price from Binance", error);
      }
    };
  
    fetchPrice(); // initial fetch
  
    // Optional: Auto-refresh every second
    const interval = setInterval(fetchPrice, 1000);
  
    return () => clearInterval(interval); // cleanup
  }, [selectedPair]); // 👈 run this whenever selectedPair changes

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Futures Trading" />

      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Left Column: Chart, Order Form, Positions */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Card>
              <TradingViewChart symbol={selectedPair} height={400} />
          </Card>
          <Card>
            <FuturesTradingForm
              selectedPair={selectedPair}
              onPairChange={setSelectedPair}
              currentPrice={currentPrice} />
          </Card>
          <Card>
            <PositionsTable
              currentPrice={currentPrice} />
          </Card>
        </div>

        {/* Right Column: Order Book */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full">
            <OrderBook />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default FuturesTradingPage;
