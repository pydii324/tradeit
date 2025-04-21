<?php 

namespace App\Http\Controllers;

use App\Models\FuturesPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use App\Models\Balance;
use App\Models\BalanceHistory;
use Inertia\Inertia;

class FuturesPositionController extends Controller
{
    public function open(Request $request)
    {
        $validated = $request->validate([
            'market' => 'required|string',
            'type' => 'required|in:long,short',
            'entry_price' => 'required|numeric',
            'stop_loss' => 'nullable|numeric',
            'take_profit' => 'nullable|numeric',
            'amount' => 'required|numeric',
            'leverage' => 'required|integer|min:1|max:100',
        ]);

        $userId = Auth::id();
        $validated['user_id'] = $userId;

        // Margin calculation (amount * entry price)
        $margin = $validated['amount'];

        DB::beginTransaction();

        try {
            $balance = Balance::firstOrCreate(
                ['user_id' => $userId],
                ['balance' => 0]
            );

            if ($balance->balance < $margin) {
                return Redirect::back()->with([
                    'success' => false,
                    'message' => 'Not enough balance to open this position.',
                ], 422);
            }

            $balance->decrement('balance', $margin);

            $position = FuturesPosition::create($validated);

            DB::commit();

            return Redirect::back()->with([
                'success' => true,
                'message' => 'Position opened successfully.',
                'position' => $position,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with([
                'success' => false,
                'message' => 'Something went wrong.',
            ], 500);
        }
    }

    public function close(Request $request, FuturesPosition $position)
    {
        if ($request->user()->cannot('update', $position)) {
            return abort(403);
        }

        $validated = $request->validate([
            'exit_price' => 'required|numeric',
        ]);

        if ($position->status === 'closed') {
            return;
        }

        $pnl = $this->calculatePnL($position, $validated['exit_price']);
        $userId = $position->user_id;

        DB::beginTransaction();

        try {
            $position->update([
                'exit_price' => $validated['exit_price'],
                'closed_at' => now(),
                'status' => 'closed',
                'pnl' => $pnl,
            ]);

            $balance = Balance::firstOrCreate(
                ['user_id' => $userId],
                ['balance' => 0]
            );

            // Add initial margin back + PnL
            $initialMargin = $position->amount;

            $balance->increment('balance', $initialMargin + $pnl);

            $balance_history = BalanceHistory::create([
                'user_id' => $userId,
                'balance' => $balance->balance, 
            ]);

            DB::commit();

            return Redirect::back()->with([
                'message' => 'Something went wrong.',
                'position' => $position,
                'success' => true,
            ], 500);
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with([
                'message' => 'Failed to close position.',
                'success' => false,
            ]);
        }
    }

    private function calculatePnL(FuturesPosition $position, $exitPrice)
    {
        $entry = $position->entry_price;
        $exit = $exitPrice;
        $amount = $position->amount; // This is the margin in USD
        $leverage = $position->leverage;
        $direction = $position->type;
    
        // Position size in units of the asset
        $positionSize = ($amount * $leverage) / $entry;
    
        $priceDiff = $direction === 'long'
            ? $exit - $entry
            : $entry - $exit;
    
        return $priceDiff * $positionSize;
    }
}
