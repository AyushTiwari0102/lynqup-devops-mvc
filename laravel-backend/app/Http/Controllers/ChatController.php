<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    /**
     * Handle incoming chatbot commands and proxy to Gemini.
     */
    public function handleChat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'nullable|array'
        ]);

        $apiKey = env('GEMINI_API_KEY') ?: env('API_KEY');

        if (!$apiKey) {
            return response()->json([
                'error' => 'API Configuration error: Missing Gemini credentials in Laravel Environment.'
            ], 500);
        }

        $message = $request->input('message');
        $history = $request->input('history', []);

        // Reformat conversation history for Google Gemini SDK specifications
        $formattedHistory = [];
        foreach ($history as $msg) {
            $formattedHistory[] = [
                'role' => ($msg['role'] ?? 'user') === 'model' ? 'model' : 'user',
                'parts' => [
                    ['text' => $msg['text'] ?? '']
                ]
            ];
        }

        $formattedHistory[] = [
            'role' => 'user',
            'parts' => [
                ['text' => $message]
            ]
        ];

        try {
            $client = new Client();
            
            // Build direct Google Gemini API endpoints
            $response = $client->post("https://generativedesign.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" . $apiKey, [
                'headers' => [
                    'Content-Type' => 'application/json'
                ],
                'json' => [
                    'contents' => $formattedHistory,
                    'systemInstruction' => [
                        'parts' => [
                            ['text' => "You are LynqSwift, the execution-first AI assistant for LYNQUP on a PHP Laravel & DevOps microservice node. Respond with high-impact, technical execution advice using emojis like ⚡ and ⚙️."]
                        ]
                    ]
                ]
            ]);

            $body = json_decode($response->getBody()->getContents(), true);
            $botText = $body['candidates'][0]['content']['parts'][0]['text'] ?? 'Connection handshake timed out.';

            return response()->json([
                'text' => $botText,
                'status' => 'operational'
            ]);

        } catch (\Exception $e) {
            Log::error('Laravel Gemini Request Failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Signal degradation detected on PHP proxy cluster.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
