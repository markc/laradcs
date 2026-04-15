<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use function Laravel\Ai\agent;

class ChatController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        if (! config('ai.providers.anthropic.key')) {
            return response()->json([
                'error' => 'ANTHROPIC_API_KEY is not set. Add it to .env to enable the chat panel.',
            ], 503);
        }

        try {
            $response = agent(
                instructions: 'You are the laradcs demo assistant. Keep replies concise — under 4 short sentences. The user is exploring a Laravel + Inertia + React starter kit with a Dual Carousel Sidebar (DCS) layout.',
            )->prompt(
                prompt: $data['message'],
                provider: 'anthropic',
                model: 'claude-haiku-4-5',
            );

            return response()->json([
                'reply' => $response->text,
                'usage' => [
                    'input_tokens' => $response->usage->inputTokens ?? null,
                    'output_tokens' => $response->usage->outputTokens ?? null,
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
