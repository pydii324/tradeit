<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BalanceHistory extends Model
{
    protected $fillable = [
        'balance',
        'user_id',
    ];

    public function history(): BelongsTo
    {
        return $this->belongsTo(Balance::class);
    }

    /** 
     * Method for getting the balance history, grouped by months
     * Метод за взимане на историята на баланса, групирани за седмица
     */
    public static function getHistoryByMonths($userId)
    {
        return self::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(balance) as total_balance')
            ->where('user_id', $userId)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                $carbonDate = Carbon::createFromFormat('Y-m', $item->month);
                return [
                    'month' => $carbonDate->format('F'), // "January"
                    'year' => $carbonDate->format('Y'),
                    'label' => $carbonDate->format('F Y'), // "January 2024"
                    'total' => $item->total_balance,
                ];
            });
    }
}
