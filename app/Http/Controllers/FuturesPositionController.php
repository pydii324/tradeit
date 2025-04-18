<?php

namespace App\Http\Controllers;

use App\Models\FuturesPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FuturesPositionController extends Controller
{
    public function open(Request $request)
    {
        $validated = $request->validate([
            'market' => 'required|string',
            'type' => 'required|in:long,short',
            'entry_price' => 'required|numeric',
            'amount' => 'required|numeric',
            'leverage' => 'required|integer|min:1|max:100',
        ]);
    
        $validated['user_id'] = Auth::id();
    
        $position = FuturesPosition::create($validated);
    
        return response()->json([
            'message' => 'Position opened',
            'position' => $position,
        ]);
    }

    public function close(Request $request, FuturesPosition $position)
    {
        $this->authorize('update', $position); // Optional: Ensure user owns the position
    
        $validated = $request->validate([
            'exit_price' => 'required|numeric',
        ]);
    
        if ($position->status === 'closed') {
            return response()->json(['message' => 'Position already closed'], 400);
        }
    
        // Calculate PnL (simplified logic)
        $pnl = $this->calculatePnL($position, $validated['exit_price']);
    
        $position->update([
            'exit_price' => $validated['exit_price'],
            'closed_at' => now(),
            'status' => 'closed',
            'pnl' => $pnl,
        ]);
    
        return response()->json([
            'message' => 'Position closed',
            'position' => $position,
        ]);
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
