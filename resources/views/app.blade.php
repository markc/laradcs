<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <script>
            (() => {
                const storageKey = @json(config('dcs.storage_key', 'laradcs-state'));
                const html = document.documentElement;
                let state = {};

                try {
                    state = JSON.parse(window.localStorage.getItem(storageKey) || '{}') || {};
                } catch {
                    state = {};
                }

                const theme = state.theme === 'light' ? 'light' : 'dark';
                const schemes = ['ocean', 'crimson', 'stone', 'forest', 'sunset', 'mono'];
                const scheme = schemes.includes(state.scheme) ? state.scheme : 'ocean';
                const width = state.width === 'narrow' || state.width === 'wide' ? state.width : 'normal';
                const clampWidth = (value) =>
                    typeof value === 'number' && Number.isFinite(value) ? Math.max(10, Math.min(100, Math.round(value))) : 15;

                html.classList.add('preload', theme);
                if (scheme !== 'ocean') html.classList.add(`scheme-${scheme}`);
                if (width !== 'normal') html.classList.add(width);
                html.style.setProperty('--sidebar-width-left', `${clampWidth(state.sidebarWidthLeft)}%`);
                html.style.setProperty('--sidebar-width-right', `${clampWidth(state.sidebarWidthRight)}%`);
                html.style.setProperty('--topnav-height', @json(config('dcs.topnav_height', '4rem')));
            })();
        </script>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700|quicksand:400,500,600,700" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
