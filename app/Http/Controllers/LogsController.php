<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\LogManagerService;
class LogsController extends Controller
{
  private $logManagerService;

  public function __construct(LogManagerService $logManagerService)
  {
      $this->logManagerService = $logManagerService;
  }
    public function show(Request $request, $instance)
    {
        $logPath = storage_path('logs/laravel.log');
        $logs = [];
        
        if (file_exists($logPath)) {
            $logContent = file_get_contents($logPath);
            $logLines = explode("\n", $logContent);
            
            // Get last 1000 lines (or adjust as needed)
            $logLines = array_slice($logLines, -1000);
            
            foreach ($logLines as $line) {
                if (
                    !empty($line) && // Skip empty lines
                    (
                        strpos($line, '"name":"' . $instance . '"') !== false ||
                        strpos($line, '"instance":"' . $instance . '"') !== false ||
                        strpos($line, '"statuses":{"' . $instance . '":') !== false ||
                        strpos($line, '"container":"' . $instance . '"') !== false
                    )
                ) {
                    $logs[] = $line;
                }
            }
        }
        
        return Inertia::render('Logs', [
            'logs' => $logs,
            'instance' => $instance,
        ]);
    }
} 