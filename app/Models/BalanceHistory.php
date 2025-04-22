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
        'date',
        'user_id',
    ];

    public function history(): BelongsTo
    {
        return $this->belongsTo(Balance::class);
    }

    public function getFormattedCreatedAtAttribute()
    {
        return $this->created_at->toIso8601String();
    }
}
