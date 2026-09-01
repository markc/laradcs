<?php

return [
    // Both values must match the props passed to <ThemeProvider> (storageKey, topnavHeight):
    // the pre-paint script in app.blade.php reads them before React boots.
    'storage_key' => env('DCS_STORAGE_KEY', 'laradcs-state'),
    'topnav_height' => env('DCS_TOPNAV_HEIGHT', '4rem'),
];
