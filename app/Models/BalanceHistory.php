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
    public static function getLast50()
    {
        //
    }
}
