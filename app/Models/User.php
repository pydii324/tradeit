<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relations
     */
    public function balance(): HasOne
    {
        return $this->hasOne(Balance::class);
    }

    /**
     * Getters
     */
    public function getBalance()
    {
        return Balance::firstOrCreate(
            ['user_id' => Auth::id()],
            ['balance' => 0] // Default value for balance, if none foudn
        )->balance;
    }

    public function addToBalance(float $amount)
    {
        $balance = Balance::firstOrCreate(
            ['user_id' => Auth::id()],
            ['balance' => 0] // Default value for balance, if none foudn
        );

        $balance->balance = $amount;
        return $balance->save();
    }

    public function getBalanceHistory()
    {
        return BalanceHistory::where('user_id', Auth::id())->get()->map(function ($balanceHistory) {
            $balanceHistory->created_at = $balanceHistory->created_at->toIso8601String();
            return $balanceHistory;
        });
    }
}
