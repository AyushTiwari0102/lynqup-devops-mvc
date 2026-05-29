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
        Schema::create('event_requests', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_token')->unique();
            $table->text('brief');
            $table->json('creators');
            $table->integer('budget')->nullable();
            $table->string('contact_email');
            $table->string('escrow_state')->default('locked'); // locked, verification_pending, released
            $table->timestamps();

            $table->index('tracking_token');
            $table->index('contact_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_requests');
    }
};
