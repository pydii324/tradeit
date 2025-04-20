<?php 

namespace App\Http\Controllers;

use App\Models\FuturesPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use App\Models\Balance;
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
        $margin = $validated['amount'] * $validated['entry_price'];

        DB::beginTransaction();

        try {
            $balance = Balance::firstOrCreate(
                ['user_id' => $userId],
                ['balance' => 0]
            );

            if ($balance->balance < $margin) {
                // Use Inertia to return a response
                return Inertia::render('YourComponent', [
                    'message' => 'Not enough balance to open this position.',
                    'success' => false,
                ]);
            }

            $balance->decrement('balance', $margin);

            FuturesPosition::create($validated);

            DB::commit();

            return Inertia::render('YourComponent', [
                'message' => 'Position opened successfully.',
                'success' => true,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return Inertia::render('YourComponent', [
                'message' => 'Something went wrong while opening the position.',
                'success' => false,
            ]);
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
            return Inertia::render('YourComponent', [
                'message' => 'Position already closed.',
                'success' => false,
            ]);
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
            $initialMargin = $position->amount * $position->entry_price;

            $balance->increment('balance', $initialMargin + $pnl);

            DB::commit();

            return Inertia::render('YourComponent', [
                'message' => 'Position closed successfully.',
                'position' => $position,
                'success' => true,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return Inertia::render('YourComponent', [
                'message' => 'Failed to close position.',
                'success' => false,
            ]);
        }
    }

    private function calculatePnL(FuturesPosition $position, $exitPrice)
    {
        $entry = $position->entry_price;
        $exit = $exitPrice;
        $amount = $position->amount;
        $leverage = $position->leverage;
        $direction = $position->type;

        $priceDiff = $direction === 'long'
            ? $exit - $entry
            : $entry - $exit;

        return $priceDiff * $amount * $leverage;
    }
}
