<?php

namespace App\Http\Controllers;

use App\Models\Instance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\PocketbaseInstanceService;
use Illuminate\Support\Facades\Log;
class PocketbaseDashboardController extends Controller
{
    protected $instanceService;

    public function __construct(PocketbaseInstanceService $instanceService)
    {
        $this->instanceService = $instanceService;
    }

    public function index()
    {
        $instances = Instance::with(['latestSpeedTest' => function($query) {
            $query->select(
                'id',
                'instance_id',
                'total_records_attempted',
                'successful_records',
                'total_time_seconds',
                'average_time_per_record_seconds',
                'records_per_second'
            );
        }])
        ->get()
        ->map(function ($instance) {
            return array_merge($instance->toArray(), [
                'is_speed_test' => $instance->isSpeedTest()
            ]);
        });
        
        return Inertia::render('PocketbaseDashboard', [
            'instances' => $instances,
            'statuses' => $this->instanceService->checkInstancesStatus()
        ]);
    }

    public function create(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:instances,name',
                'version' => 'nullable|string',
                'download_url' => 'nullable|url'
            ]);
    
            $instance = Instance::create([
                'name' => $validated['name'],
                'version' => $validated['version'] ?? null,
                'download_url' => $validated['download_url'] ?? null,
                'status' => 'created'
            ]);
    
            return redirect()->back()->with('success', 'Instance created successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect()->back()->withErrors([
                'name' => 'The instance name must be unique.'
            ])->withInput();
        }
    }

    public function start(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);

        $instance = Instance::where('name', $validated['name'])->firstOrFail();
        
        $instance->update(['status' => 'updating']);
        
        try {
            // $version = $instance->version ?? '';
            // $downloadUrl = $instance->download_url ?? '';
            
            $success = $this->instanceService->startInstance(
                $validated['name'], 

                // $version,        // Pass empty string instead of null
                // $downloadUrl    // Pass empty string instead of null
            );

            if ($success) {
                $instance->update(['status' => 'running']);
                return redirect()->back()->with('status', 'Instance started successfully');
            } else {
                $instance->update(['status' => 'stopped']);
                return redirect()->back()->with('error', 'Failed to start instance');
            }
        } catch (\Exception $e) {
            $instance->update(['status' => 'stopped']);
            Log::error('Failed to start instance:', [
                'error' => $e->getMessage(),
                'instance' => $instance->toArray()
            ]);
            
            return redirect()->back()->with('error', 'Failed to start instance: ' . $e->getMessage());
        }
    }

    public function shutdown()
    {
        try {
            $success = $this->instanceService->shutdownDocker();
            
            if ($success) {
                // Log before update
                Log::info('Before status update:', [
                    'instances' => Instance::all()->toArray()
                ]);

                // Update all instances status to stopped
                $updated = Instance::query()->update(['status' => 'stopped']);
                
                // Log after update
                Log::info('After status update:', [
                    'updated_count' => $updated,
                    'instances' => Instance::all()->toArray()
                ]);

                if ($updated > 0) {
                    return redirect()->back()->with('status', "All instances have been shut down ($updated updated)");
                } else {
                    Log::warning('No instances were updated during shutdown');
                    return redirect()->back()->with('warning', 'Shutdown successful but no instances were updated');
                }
            } else {
                return redirect()->back()->with('error', 'Failed to shut down instances');
            }
        } catch (\Exception $e) {
            Log::error('Failed to shut down docker:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->with('error', 'Failed to shut down instances: ' . $e->getMessage());
        }
    }

    public function delete(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);

        $instance = Instance::where('name', $validated['name'])->firstOrFail();
        
        if ($instance->status !== 'stopped' && $instance->status !== 'created') {
            return redirect()->back()->with('error', 'Instance must be stopped before it can be deleted');
        }
        
        $instance->update(['status' => 'updating']);
        
        try {
            $success = $this->instanceService->deleteInstance(
                $validated['name'],
            );

            if ($success) {
                $instance->delete();
                return redirect()->back()->with('status', 'Instance has been deleted successfully');
            } else {
                $instance->update(['status' => 'stopped']);
                return redirect()->back()->with('error', 'Failed to delete instance');
            }
        } catch (\Exception $e) {
            $instance->update(['status' => 'stopped']);
            Log::error('Failed to delete instance:', [
                'error' => $e->getMessage(),
                'instance' => $instance->toArray()
            ]);
            
            return redirect()->back()->with('error', 'Failed to delete instance: ' . $e->getMessage());
        }
    }

    public function stop(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string'
        ]);

        $instance = Instance::where('name', $validated['name'])->firstOrFail();
        
        $instance->update(['status' => 'updating']);
        
        try {
            $success = $this->instanceService->stopInstance($validated['name']);

            if ($success) {
                $instance->update(['status' => 'stopped']);
                return redirect()->back()->with('status', 'Instance stopped successfully');
            } else {
                $instance->update(['status' => 'running']);
                return redirect()->back()->with('error', 'Failed to stop instance');
            }
        } catch (\Exception $e) {
            $instance->update(['status' => 'running']);
            Log::error('Failed to stop instance:', [
                'error' => $e->getMessage(),
                'instance' => $instance->toArray()
            ]);
            
            return redirect()->back()->with('error', 'Failed to stop instance: ' . $e->getMessage());
        }
    }

    public function checkStatus()
    {
        try {
            $statuses = $this->instanceService->checkInstancesStatus();
            
            if (isset($statuses['error'])) {
                return Inertia::render('PocketbaseDashboard', [
                    'error' => $statuses['error']
                ]);
            }

            return Inertia::render('PocketbaseDashboard', [
                'statuses' => $statuses
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to check instances status:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return Inertia::render('PocketbaseDashboard', [
                'error' => "error: {$e->getMessage()} trace: {$e->getTraceAsString()}"
            ]);
        }
    }

    public function restart(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string'
        ]);

        $instance = Instance::where('name', $validated['name'])->firstOrFail();
        
        $instance->update(['status' => 'updating']);

        
        try {
            $success = $this->instanceService->restartInstance($validated['name']);

            if ($success) {
                $instance->update(['status' => 'running']);
                return redirect()->back()->with('status', 'Instance has been restarted successfully');
            } else {
                $instance->update(['status' => 'stopped']);
                return redirect()->back()->with('error', 'Failed to restart instance');
            }
        } catch (\Exception $e) {
            $instance->update(['status' => 'stopped']);
            Log::error('Failed to restart instance:', [
                'error' => $e->getMessage(),
                'instance' => $instance->toArray()
            ]);
            
            return redirect()->back()->with('error', 'Failed to restart instance: ' . $e->getMessage());
        }
    }
}
