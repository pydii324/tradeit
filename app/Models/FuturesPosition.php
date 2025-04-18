<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FuturesPosition extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'market',
        'type',
        'entry_price',
        'amount',
        'leverage',
        'status',
        'exit_price',
        'pnl',
        'closed_at',
    ];

    protected $casts = [
        'closed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
