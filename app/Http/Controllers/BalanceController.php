<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\Auth;

class BalanceController extends Controller
{
    public function showBalanceView()
    {
        $balance = Auth::user()->getBalance();
        $balance_history = Auth::user()->getBalanceHistoryThisYear();
        
        return Inertia::render('balance/balance', [
            'balance' => $balance,
            'balance_history' => $balance_history,
        ]);
    }
}
