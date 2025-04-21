"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, ChevronDown, Info, Minus, Plus, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { router, usePage } from "@inertiajs/react"

type Props = {
  selectedPair: string;
  onPairChange: (pair: string) => void;
  currentPrice: number; // 👈 lowercase
  priceChangePercent: number; // 👈 lowercase
}

export default function FuturesTradingForm({positions, selectedPair, onPairChange, currentPrice, priceChangePercent }: Props) {
  const [amount, setAmount] = useState<number>(100)
  const [leverage, setLeverage] = useState<number>(5)
  const [stopLoss, setStopLoss] = useState<number | null>(null)
  const [takeProfit, setTakeProfit] = useState<number | null>(null)
  const [direction, setDirection] = useState<"long" | "short">("long")

  const { balance } = usePage().props;
  

  // Calculate position details
  const positionSize = amount * leverage
  const liquidationPrice =
  direction === "long"
    ? currentPrice * (1 - 1 / leverage)
    : currentPrice * (1 + 1 / leverage);

  const handleAmountChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setAmount(numValue)
    }
  }

  const handleLeverageChange = (value: number[]) => {
    setLeverage(value[0])
  }

  const handleStopLossChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (value === "") {
      setStopLoss(null)
    } else if (!isNaN(numValue)) {
      setStopLoss(numValue)
    }
  }

  const handleTakeProfitChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (value === "") {
      setTakeProfit(null)
    } else if (!isNaN(numValue)) {
      setTakeProfit(numValue)
    }
  }

  const calculatePnL = () => {
    if (!takeProfit) return null

    const entryValue = positionSize
    const exitValue =
      direction === "long" ? positionSize * (takeProfit / currentPrice) : positionSize * (currentPrice / takeProfit)

    return direction === "long" ? exitValue - entryValue : entryValue - exitValue
  }

  const potentialProfit = calculatePnL()

  const handleSubmit = () => {
    router.post('/futures/open', {
      market: selectedPair,
      amount: amount,
      leverage: leverage,
      type: direction,
      entry_price: currentPrice,
      stop_loss: stopLoss,
      take_profit: takeProfit,
    }, {
      preserveScroll: true,
    })
  }

  return (
    <div className="w-full mx-auto">
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader className="border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                
                <Select value={selectedPair} onValueChange={onPairChange}>
                  <SelectTrigger className="w-[160px] h-10 bg-zinc-800 border-zinc-700 text-sm">
                    <SelectValue placeholder="Contract" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                    <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                    <SelectItem value="XRPUSDT">XRP/USDT</SelectItem>
                    <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
                    <SelectItem value="BNBUSDT">BNB/USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-2xl font-bold">${currentPrice.toLocaleString()}</span>
                <span className={`text-sm font-medium ${priceChangePercent >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {priceChangePercent >= 0 ? "+" : ""}
                  {priceChangePercent.toFixed(2)}%
                </span>
              </div>
              <CardDescription className="text-zinc-400">Updates every: 1 sec</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            <div className="p-6">
              <Tabs defaultValue="market" className="w-full">
                <TabsList className="w-full bg-zinc-800 text-zinc-400">
                  <TabsTrigger
                    value="market"
                    className="flex-1 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    Market
                  </TabsTrigger>
                  <TabsTrigger value="limit" className="flex-1">
                    Limit
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="market" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="amount" className="text-zinc-400">
                        Amount (USDT)
                      </Label>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-5 w-5 rounded-sm bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                          onClick={() => setAmount(Math.max(0, amount - 10))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-5 w-5 rounded-sm bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                          onClick={() => setAmount(amount + 10)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Input
                      id="amount"
                      type="text"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 focus-visible:ring-emerald-500"
                    />
                    <div className="flex justify-between gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-7 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-xs"
                        onClick={() => setAmount(100)}
                      >
                        $100
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-7 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-xs"
                        onClick={() => setAmount(500)}
                      >
                        $500
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-7 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-xs"
                        onClick={() => setAmount(1000)}
                      >
                        $1000
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-zinc-400">Leverage</Label>
                      <span className="text-sm font-medium">{leverage}x</span>
                    </div>
                    <Slider
                      defaultValue={[10]}
                      max={100}
                      min={1}
                      step={1}
                      value={[leverage]}
                      onValueChange={handleLeverageChange}
                      className=""
                    />
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>1x</span>
                      <span>100x</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="stopLoss" className="text-zinc-400">
                          Stop Loss (optional)
                        </Label>
                      </div>
                      <Input
                        id="stopLoss"
                        type="text"
                        value={stopLoss === null ? "" : stopLoss}
                        onChange={(e) => handleStopLossChange(e.target.value)}
                        placeholder={direction === "long" ? "Below entry price" : "Above entry price"}
                        className="bg-zinc-800 border-zinc-700 focus-visible:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="takeProfit" className="text-zinc-400">
                          Take Profit (optional)
                        </Label>
                      </div>
                      <Input
                        id="takeProfit"
                        type="text"
                        value={takeProfit === null ? "" : takeProfit}
                        onChange={(e) => handleTakeProfitChange(e.target.value)}
                        placeholder={direction === "long" ? "Above entry price" : "Below entry price"}
                        className="bg-zinc-800 border-zinc-700 focus-visible:ring-emerald-500"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="limit" className="mt-4">
                  <div className="h-[300px] flex items-center justify-center text-zinc-500">
                    <p>Limit order form would go here</p>
                  </div>
                </TabsContent>
                <TabsContent value="stop" className="mt-4">
                  <div className="h-[300px] flex items-center justify-center text-zinc-500">
                    <p>Stop order form would go here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Position Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Position Size</span>
                    <span className="font-medium">${positionSize.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Initial Margin</span>
                    <span className="font-medium">${amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Entry Price</span>
                    <span className="font-medium">${currentPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-400">Liquidation Price</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-zinc-500" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
                            <p className="text-xs max-w-[200px]">
                              Price at which your position will be liquidated if reached
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="font-medium text-red-500">${liquidationPrice.toFixed(2)}</span>
                  </div>
                  {takeProfit && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Potential Profit</span>
                      <span className="font-medium text-emerald-500">
                        ${potentialProfit?.toFixed(2)} ({((potentialProfit! / amount) * 100).toFixed(2)}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col">
              <div className="flex-1">
                <div className="flex gap-2 mb-6">
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                    onClick={() => setDirection("long")}
                    variant={direction === "long" ? "default" : "outline"}
                  >
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Long
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12"
                    onClick={() => setDirection("short")}
                    variant={direction === "short" ? "default" : "outline"}
                  >
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Short
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Available Balance</span>
                      <span className="font-medium">${balance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Position size</span>
                      <span className="font-medium">${(10000 * leverage).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Margin Mode</span>
                      <Select defaultValue="isolated">
                        <SelectTrigger className="w-[140px] h-8 bg-zinc-800 border-zinc-700 text-sm">
                          <SelectValue placeholder="Margin Mode" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectItem value="isolated">Isolated</SelectItem>
                          <SelectItem value="cross" disabled>Cross</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleSubmit}
                  className={`w-full h-14 text-lg font-medium ${
                    direction === "long"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {direction === "long" ? "Buy / Long" : "Sell / Short"} BTC
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-zinc-800 py-3 px-6">
          <div className="flex items-center justify-between w-full text-xs text-zinc-400">
            <div className="flex items-center gap-4">
              <span>24h Change: <span className={`text-xs font-medium ${priceChangePercent >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {priceChangePercent >= 0 ? "+" : ""}{priceChangePercent.toFixed(2)}%
                </span>
              </span>
              <span>24h High: $43,250.00</span>
              <span>24h Low: $41,780.50</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
