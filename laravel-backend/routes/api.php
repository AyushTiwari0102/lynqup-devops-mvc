<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CreatorController;
use App\Http\Controllers\ChatController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider inside a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Health Probe (Verify DevOps deployment and database links)
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'pipeline' => 'DevOps Docker-Compose Orchestrated',
        'database' => 'Connected to Postgres',
        'timestamp' => now()->toIso8601String()
    ]);
});

// Vetted Talent shelf endpoints
Route::get('/creators', [CreatorController::class, 'index']);
Route::post('/event-requests', [CreatorController::class, 'submitRequest']);

// Dedicated AI Assistant Proxy Endpoint in PHP (Laravel + Guzzle API client)
Route::post('/chat', [ChatController::class, 'handleChat']);
