<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\Auth;

class BalanceController extends Controller
{
    public function showBalanceView()
    {
        return Inertia::render('balance/balance', [
            'balance' => Auth::user()->getBalance(),
        ]);
    }
}
