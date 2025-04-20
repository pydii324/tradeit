<?php

namespace App\Console\Commands;

use App\Models\FuturesPosition;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CheckFuturesPositions extends Command
{
    protected $signature = 'positions:check';
    protected $description = 'Checks all open futures positions for SL, TP, or liquidation';

    public function handle()
    {
        $positions = FuturesPosition::where('status', 'open')->get();

        foreach ($positions as $position) {
            // Example: fetch price from Binance (or other API)
            $symbol = strtolower(str_replace('/', '', $position->market));
            $response = Http::get("https://api.binance.com/api/v3/ticker/price", [
                'symbol' => strtoupper($symbol)
            ]);

            if (!$response->ok()) continue;

            $currentPrice = floatval($response['price']);
            $entry = floatval($position->entry_price);
            $leverage = floatval($position->leverage);
            $amount = floatval($position->amount);

            // 💥 Calculate liquidation price
            $liqPrice = $this->calculateLiquidationPrice($position);

            // 🎯 Check TP or SL
            if ($position->take_profit && (
                ($position->type === 'long' && $currentPrice >= $position->take_profit) ||
                ($position->type === 'short' && $currentPrice <= $position->take_profit)
            )) {
                $this->closePosition($position, $currentPrice, 'TP');
                continue;
            }

            if ($position->stop_loss && (
                ($position->type === 'long' && $currentPrice <= $position->stop_loss) ||
                ($position->type === 'short' && $currentPrice >= $position->stop_loss)
            )) {
                $this->closePosition($position, $currentPrice, 'SL');
                continue;
            }

            // ⚠️ Liquidation
            if (
                ($position->type === 'long' && $currentPrice <= $liqPrice) ||
                ($position->type === 'short' && $currentPrice >= $liqPrice)
            ) {
                $this->closePosition($position, $currentPrice, 'Liquidated');
            }
        }
    }

    protected function calculateLiquidationPrice(FuturesPosition $position)
    {
        $entry = floatval($position->entry_price);
        $leverage = floatval($position->leverage);

        // Assuming maintenance margin = 0.5%
        $maintenanceMargin = 0.005;

        if ($position->type === 'long') {
            return $entry * (1 - (1 / $leverage) + $maintenanceMargin);
        } else {
            return $entry * (1 + (1 / $leverage) - $maintenanceMargin);
        }
    }

    protected function closePosition(FuturesPosition $position, $price, $reason = 'closed')
    {
        $pnl = $this->calculatePNL($position, $price);

        $position->update([
            'status' => 'closed',
            'exit_price' => $price,
            'pnl' => $pnl,
            'closed_at' => now()
        ]);

        Log::info("Position {$position->id} closed via {$reason}. PNL: {$pnl}");
    }

    protected function calculatePNL(FuturesPosition $position, $currentPrice)
    {
        $entry = floatval($position->entry_price);
        $amount = floatval($position->amount);
        $leverage = floatval($position->leverage);

        if ($position->type === 'long') {
            return ($currentPrice - $entry) * $amount * $leverage;
        } else {
            return ($entry - $currentPrice) * $amount * $leverage;
        }
    }
}