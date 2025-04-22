<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;

class FuturesTradeHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'market',
        'type',
        'entry_price',
        'amount',
        'leverage',
        'status', # open, closed
        'exit_price',
        'pnl',
        'closed_at',
        'stop_loss',
        'take_profit',
    ];

    protected $casts = [
        'closed_at' => 'datetime',
    ];
    
    public static function getTrades()
    {
        return self::where('user_id', Auth::id())->get();
    }

    /**
     * Relations
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
