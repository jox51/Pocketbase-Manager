<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Carbon\Carbon;

class LogManagerService
{
    private $logFile;
    private $maxLogAge; // in days
    private $maxLines;

    public function __construct()
    {
        $this->logFile = storage_path('logs/laravel.log');
        $this->maxLogAge = 7; // Keep logs for 7 days
        $this->maxLines = 1000; // Keep last 1000 lines
    }

    public function getRecentLogs(int $limit = 100): array
    {
        if (!File::exists($this->logFile)) {
            return [];
        }

        // Clean up old logs first
        $this->cleanup();

        // Read the last N lines
        $logs = array_slice(file($this->logFile), -$limit);
        
        return array_map(function ($line) {
            return $this->parseLine($line);
        }, array_filter($logs));
    }

    private function cleanup(): void
    {
        if (!File::exists($this->logFile)) {
            return;
        }

        $lines = file($this->logFile);
        
        if (count($lines) > $this->maxLines) {
            // Keep only the last maxLines
            $lines = array_slice($lines, -$this->maxLines);
            File::put($this->logFile, implode('', $lines));
        }
    }

    private function parseLine(string $line): ?array
    {
        if (empty(trim($line))) {
            return null;
        }

        // Parse the log line into a structured format
        preg_match('/\[(.*?)\] (\w+)\.(\w+): (.*)/', $line, $matches);
        
        if (count($matches) < 5) {
            return null;
        }

        try {
            $data = json_decode($matches[4], true) ?? $matches[4];
        } catch (\Exception $e) {
            $data = $matches[4];
        }

        return [
            'timestamp' => Carbon::parse($matches[1])->format('Y-m-d H:i:s'),
            'level' => $matches[3],
            'data' => $data
        ];
    }
} 