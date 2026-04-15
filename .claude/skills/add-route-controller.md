---
name: add-route-controller
description: Add a new Laravel route + controller pair, with conventions for Inertia pages, JSON APIs, and chat-style endpoints
---

# Add a route + controller

The kit follows standard Laravel conventions plus a few laradcs
specifics. Pick the section below that matches your endpoint type.

## A. Inertia page route

For pages that render an Inertia component, prefer a closure if the
page needs no logic, or a controller if it needs queries/forms.

### Closure route (no controller)

File: `routes/web.php`

```php
Route::middleware(['auth'])->group(function () {
    Route::get('reports', function () {
        return Inertia::render('reports', [
            'reports' => Report::latest()->get(),
        ]);
    })->name('reports.index');
});
```

### Controller route

File: `app/Http/Controllers/ReportController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('reports/index', [
            'reports' => Report::latest()->get(),
        ]);
    }
}
```

Then in `routes/web.php`:

```php
use App\Http\Controllers\ReportController;

Route::middleware(['auth'])->group(function () {
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
});
```

## B. JSON endpoint (called via fetch from a panel)

For panels that need to POST/GET JSON without a full Inertia page,
follow the `ChatController` pattern.

File: `app/Http/Controllers/MyController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MyController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        try {
            // ... do the work
            return response()->json(['ok' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
```

In `routes/web.php`:

```php
use App\Http\Controllers\MyController;

Route::middleware(['auth'])->group(function () {
    Route::post('my-endpoint', [MyController::class, 'store'])->name('my.store');
});
```

**Always inside the auth middleware group** so the session-based
web CSRF token protects the route. Then the panel can call it via:

```tsx
const csrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
const res = await fetch('/my-endpoint', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
    },
    credentials: 'same-origin',
    body: JSON.stringify({ message: '...' }),
});
```

The CSRF meta tag is already in `resources/views/app.blade.php`.
Don't remove it.

## C. LLM endpoint (chat-style)

If the controller calls Anthropic or another provider via
`laravel/ai`, follow the pattern in
`app/Http/Controllers/ChatController.php`:

```php
use function Laravel\Ai\agent;

$response = agent(instructions: 'You are ...')
    ->prompt(
        prompt: $data['message'],
        provider: 'anthropic',
        model: 'claude-haiku-4-5',
    );

return response()->json(['reply' => $response->text]);
```

Always check `config('ai.providers.anthropic.key')` first and 503
with a friendly error if it's missing — don't blow up.

## Verify

```bash
php artisan route:list --path=my-endpoint    # confirm registration
php artisan test                              # tests still pass
```

Then hit the route in your browser (for GET) or via curl/Inertia
(for POST) to confirm it returns the expected response.

## Conventions

- Routes inside `Route::middleware(['auth'])->group(...)` — always.
- Route names use dot notation: `resource.action`.
- Controllers in `app/Http/Controllers/`, named `<Resource>Controller.php`.
- Form requests in `app/Http/Requests/<Resource>/<Action>Request.php`
  for any non-trivial validation.
