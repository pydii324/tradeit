import React from "react";
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
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Futures Trading" />

      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Left Column: Chart, Order Form, Positions */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Card>
            <TradingViewChart />
          </Card>
          <Card>
            <FuturesTradingForm />
          </Card>
          <Card>
            <PositionsTable />
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
