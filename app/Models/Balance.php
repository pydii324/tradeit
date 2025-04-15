<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Balance extends Model
{
    protected $fillable = [
        'balance',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function history(): HasMany
    {
        return $this->hasMany(BalanceHistory::class);
    }

    public function getOrCreate(int $user_id)
    {
        return self::firstOrCreate([
            ['user_id' => $user_id],
            ['balance' => 0] // Default value 0 if no balance found
        ])->balance;
    }
}
