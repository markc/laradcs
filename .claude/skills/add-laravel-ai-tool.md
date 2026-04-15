---
name: add-laravel-ai-tool
description: Define a Laravel\Ai\Contracts\Tool class so the chat panel agent can call functions in your codebase
---

# Add a tool to the laravel/ai agent

The Haiku chat panel runs an anonymous `agent()` via `laravel/ai`.
By default it has no tools and just answers questions. Adding tools
lets the LLM call PHP functions in your codebase — query the
database, run an artisan command, summarise a model, etc.

## Anatomy of a tool

`laravel/ai` tools are PHP classes that implement
`Laravel\Ai\Contracts\Tool`. Generate the scaffold with:

```bash
php artisan make:tool ListUsers
```

That writes `app/Ai/Tools/ListUsers.php` from `stubs/tool.stub`.

The class shape:

```php
<?php

namespace App\Ai\Tools;

use Illuminate\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;

class ListUsers implements Tool
{
    public function name(): string
    {
        return 'list_users';
    }

    public function description(): string
    {
        return 'List the most recent users in the system. Returns up to `limit` users sorted by created_at descending.';
    }

    public function schema(JsonSchema $schema): JsonSchema
    {
        return $schema->object([
            'limit' => $schema->integer()->minimum(1)->maximum(50)->default(10),
        ]);
    }

    public function handle(array $arguments): array
    {
        $limit = $arguments['limit'] ?? 10;

        return \App\Models\User::latest()
            ->limit($limit)
            ->get(['id', 'name', 'email', 'created_at'])
            ->toArray();
    }
}
```

Three things matter:

1. **`name()`** — snake_case. The LLM uses this exact string when
   deciding to call the tool. Keep it short and verb_noun.
2. **`description()`** — what the tool does, in plain English. The
   LLM reads this to decide whether to use it. Be specific about
   inputs/outputs.
3. **`schema(JsonSchema $schema)`** — declares the tool's parameter
   shape using Laravel's first-party JSON schema builder. The LLM
   will conform to this when calling.

## Wire the tool into the chat agent

File: `app/Http/Controllers/ChatController.php`

Add the tool to the `agent()` call:

```php
use App\Ai\Tools\ListUsers;
use function Laravel\Ai\agent;

$response = agent(
    instructions: 'You are the laradcs demo assistant. Use the
        available tools to answer questions about the system.',
    tools: [
        new ListUsers,
    ],
)->prompt(
    prompt: $data['message'],
    provider: 'anthropic',
    model: 'claude-haiku-4-5',
);
```

Multiple tools: pass an array. The LLM will pick whichever fits.

## Verify

```bash
php artisan test
```

Then in the Haiku chat panel ask: "How many users are in the
system?" and the agent should call `list_users` and report the
count. Use `php artisan pail` in another terminal to watch the
tool calls hit the log.

## Common patterns

- **Read-only tools** are safe to expose (queries, listings).
- **Mutating tools** (create, update, delete) need authorisation
  guards INSIDE `handle()` — check `auth()->user()` and
  `$user->can(...)`. The LLM will happily call destructive tools
  if they're in scope.
- **Long-running tools** (HTTP calls, expensive queries) should
  return a job id and dispatch a queued job rather than blocking
  the chat round-trip.

## Don't

- Don't put database write operations behind a tool without
  authorization.
- Don't return raw Eloquent models — convert to arrays/scalars so
  the LLM gets clean JSON.
- Don't use a tool when a simple `Inertia::render(..., ['data' =>
  ...])` shared prop would do. Tools are for dynamic agent-driven
  queries, not for static page data.
