<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\TradeController;
use App\Http\Controllers\BalanceController;
use App\Http\Controllers\NewsController;

use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'balance' => Auth::user()->getBalance(),
        ]);
    })->name('dashboard');

    # /trades
    Route::get('trades', [TradeController::class, 'showTradesView'])->name('trades');

    # /balance
    Route::get('balance', [BalanceController::class, 'showBalanceView'])->name('balance');

    # /news
    Route::get('news', [NewsController::class, 'showNews'])->name('show.news');

    Route::get('news/crypto', [NewsController::class, 'showCryptoNews'])->name('show.crypto.news');
    Route::get('news/forex', [NewsController::class, 'showForexNews'])->name('show.forex.news');
    Route::get('news/energy', [NewsController::class, 'showEnergyNews'])->name('show.energy.news');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
