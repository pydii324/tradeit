<?php

namespace App\Http\Controllers;

use App\Models\BalanceHistory;
use App\Models\FuturesPosition;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\Auth;
use App\Models\User;

class BalanceController extends Controller
{
    public function showBalanceView()
    {
        $user = Auth::user();
        $balance = $user->getBalance();
        $balance_history = $user->getBalanceHistory();
        
        return Inertia::render('balance/balance', [
            'balance' => $balance,
            'balance_history' => $balance_history,
            'open_positions' => FuturesPosition::getOpenPositions(),
        ]);
    }

    public function addToBalance(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $user = Auth::user();
        $balance = $user->balance->get();

        $balance->balance += $validated['amount'];

        BalanceHistory::create([
            'user_id' => $user->id,
            'balance' => $balance->balance,
        ]);

        $balance->save();
    }
    
}
