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
        Schema::create('creators', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->string('industry');
            $table->integer('rate')->default(0);
            $table->string('location');
            $table->string('status')->default('active');
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->boolean('verified')->default(false);
            $table->json('tags')->nullable();
            $table->json('metrics')->nullable();
            $table->timestamps();
            
            // Database-level scaling Indexes (Perfect for DevOps & DBA review)
            $table->index('status');
            $table->index('industry');
            $table->index('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creators');
    }
};
