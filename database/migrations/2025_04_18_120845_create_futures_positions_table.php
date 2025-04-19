<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('futures_positions');
        Schema::create('futures_positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('market'); // e.g., BTC/USDT
            $table->enum('type', ['long', 'short']);
            $table->decimal('entry_price', 20, 10);
            $table->decimal('amount', 20, 10); // size in base asset (e.g. BTC)
            $table->unsignedInteger('leverage');
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->decimal('exit_price', 20, 10)->nullable();
            $table->decimal('pnl', 20, 10)->nullable(); // profit or loss
            $table->timestamp('closed_at')->nullable();
            $table->decimal('stop_loss', 20, 10)->nullable();
            $table->decimal('take_profit', 20, 10)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('futures_positions');
    }
};
