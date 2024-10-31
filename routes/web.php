<?php

use App\Http\Controllers\PocketbaseController;
use App\Http\Controllers\PocketbaseDashboardController;
use App\Http\Controllers\ProfileController;
use App\Models\Instance;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TerminalController;
use App\Http\Controllers\LogsController;
use App\Http\Controllers\PocketbaseVersionController;
use App\Http\Controllers\PocketbaseTestController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/pb-dashboard', [PocketbaseDashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('pb-dashboard');

Route::post('/create-instance', [PocketbaseDashboardController::class, 'create'])->middleware(['auth', 'verified'])->name('create-instance');

Route::post('/start-instance', [PocketbaseDashboardController::class, 'start'])->middleware(['auth', 'verified'])->name('start-instance');

Route::post('/shutdown-docker', [PocketbaseDashboardController::class, 'shutdown'])->middleware(['auth', 'verified'])->name('shutdown-docker');

Route::post('/delete-instance', [PocketbaseDashboardController::class, 'delete'])->middleware(['auth', 'verified'])->name('delete-instance');

Route::post('/stop-instance', [PocketbaseDashboardController::class, 'stop'])->middleware(['auth', 'verified'])->name('stop-instance');

// Route::get('/check-status', [PocketbaseDashboardController::class, 'checkStatus'])->middleware(['auth', 'verified'])->name('check-status');

Route::get('/check-instance-name', function (Request $request) {
    $exists = Instance::where('name', $request->name)->exists();
    return response()->json(['isUnique' => !$exists]);
});

Route::get('/check-instance-port', function (Request $request) {
    $exists = Instance::where('port', $request->port)->exists();
    return response()->json(['isUnique' => !$exists]);
});

Route::post('/restart-instance', [PocketbaseDashboardController::class, 'restart'])->middleware(['auth', 'verified'])->name('restart-instance');

Route::post('/execute-command', [TerminalController::class, 'executeCommand'])
    ->name('terminal.execute')
    ->middleware(['auth', 'verified']);

Route::get('/terminal/{instance}', [TerminalController::class, 'show'])
    ->name('terminal.show')
    ->middleware(['auth']);

Route::get('/instances/{instance}/logs', [LogsController::class, 'show'])
    ->name('instances.logs');

Route::get('/api/pocketbase-versions', [PocketbaseVersionController::class, 'index'])
    ->name('api.pocketbase-versions');

Route::post('/speed-test', [PocketbaseTestController::class, 'runSpeedTest'])
    ->middleware(['auth', 'verified'])
    ->name('speed-test');

Route::get('/privacy', function () {
    return Inertia::render('Privacy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

require __DIR__.'/auth.php';
