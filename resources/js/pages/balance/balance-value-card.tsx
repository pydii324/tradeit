import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardAction, CardFooter, CardDescription } from "@/components/ui/card";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

const BalanceCard = () => {
  const { balance } = usePage().props;

  return (
    <Card className="@container/card">
    <CardHeader>
      <h3 className="text-lg text-accent-foreground/50">Current Balance</h3>
      <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
        ${parseFloat(balance.toString()).toFixed(2)}
      </CardTitle>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="text-muted-foreground">
        The most important thing is to never lose money!
      </div>
    </CardFooter>
  </Card>
  );
};

export default BalanceCard;