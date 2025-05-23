<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Balance;
use App\Models\FuturesPosition;
use App\Models\FuturesTradeHistory;

class TradeController extends Controller
{
    public function showFuturesView()
    {
        #dd(FuturesTradeHistory::getTrades());

        return Inertia::render('futures/futures-trading-page', [
            'balance' => Auth::user()->getBalance(),
            'open_positions' => FuturesPosition::getOpenPositions(),
            'position_history' => FuturesTradeHistory::getTrades(),
        ]);
    }
}
