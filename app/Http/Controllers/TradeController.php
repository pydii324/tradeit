<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Balance;

class TradeController extends Controller
{
    public function showTradesView()
    {
        return Inertia::render('trades', [
            'balance' => Balance::where('user_id', Auth::id())->first()->balance,
        ]);
    }
}
