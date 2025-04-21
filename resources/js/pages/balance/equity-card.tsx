import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";

const EquityCard = () => {
  const { balance, open_positions } = usePage().props;
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      const symbols = open_positions.map(pos => pos.market);
      const uniqueSymbols = [...new Set(symbols)];

      const results: Record<string, number> = {};

      for (const symbol of uniqueSymbols) {
        try {
          const res = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
          results[symbol] = parseFloat(res.data.price);
        } catch (err) {
          console.error("Failed to fetch price for", symbol);
        }
      }

      setPrices(results);
      setIsLoaded(true); // ✅ Mark prices as loaded
    };

    if (open_positions.length) {
      fetchPrices();
    }

    const interval = setInterval(fetchPrices, 1000);
  }, [open_positions]);

  const calculateUnrealizedPnL = (position) => {
    const entry = Number(position.entry_price);
    const current = prices[position.market];
    const amount = Number(position.amount);
    const leverage = Number(position.leverage);
    const type = position.type;

    if (!entry || !current || !amount || !leverage || !type) return 0;

    const positionSize = (amount * leverage) / entry;
    const priceDiff = type === "long" ? current - entry : entry - current;

    return priceDiff * positionSize;
  };

  const unrealizedPnL = open_positions.reduce((total, pos) => {
    const currentPrice = prices[pos.market];
    if (typeof currentPrice !== "number") return total; // 🛑 skip if missing
    return total + calculateUnrealizedPnL(pos);
  }, 0);

  const equity = balance + unrealizedPnL;

  return (
    <Card className="@container/card">
      <CardHeader>
        <h3 className="text-lg text-accent-foreground/50">Account Equity</h3>
        <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {isLoaded ? `$${equity.toFixed(2)}` : "Loading..."}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          The most important thing is to always win money!
        </div>
      </CardFooter>
    </Card>
  );
};

export default EquityCard;
