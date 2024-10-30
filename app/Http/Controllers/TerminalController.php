<?php

namespace App\Http\Controllers;

use App\Services\PocketbaseInstanceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;

class TerminalController extends Controller
{
    public function __construct(
        private PocketbaseInstanceService $pocketbaseService
    ) {}

    public function executeCommand(Request $request)
    {
        $request->validate([
            'instance' => 'required|string',
            'command' => 'required|string'
        ]);
    
        $output = iterator_to_array($this->pocketbaseService->executeCommand(
            $request->input('instance'),
            $request->input('command')
        ));

    
        return response()->json([
            'status' => 'success',
            'output' => $output
        ]);
    }
    

    


    public function show(Request $request, string $instanceName)
    {
        $instance = $this->pocketbaseService->getInstance($instanceName);
        
        if (!$instance) {
            return redirect()->back()->with('error', 'Instance not found');
        }

        return Inertia::render('Terminal', [
            'instance' => $instance
        ]);
    }
}
