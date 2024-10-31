<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use App\Models\Instance;

class PocketbaseInstanceService

{

    private $currentDir;
    private $scriptsPath;

    public function __construct()
    {
        $this->scriptsPath = base_path('scripts/pb-manager-scripts');
        $this->currentDir = $this->scriptsPath; // Initialize with the default directory
    }
    private function isDockerRunning(): bool
    {
        exec("docker compose ps 2>&1", $output, $returnCode);
        return $returnCode === 0 && !empty($output);
    }

    private function startDocker(): bool
    {
        $scriptsPath = base_path('scripts/pb-manager-scripts');
        
        // Build the command with proper directory change
        $command = sprintf('cd "%s" && bash run.sh', $scriptsPath);
        
        exec($command . " 2>&1", $output, $returnCode);
        
        Log::info('Run Script Output:', [
            'command' => $command,
            'output' => $output,
            'returnCode' => $returnCode
        ]);

        return $returnCode === 0;
    }

    private function addInstance(string $name, int $port): bool
    {
        $scriptsPath = base_path('scripts/pb-manager-scripts');
        
        // Properly escape the arguments
        $escapedName = escapeshellarg($name);
        $escapedPort = escapeshellarg((string)$port);
        
        // Build the command ensuring proper spacing and argument handling
        $command = sprintf(
            'cd "%s" && bash add_and_start_instance.sh %s %s',
            $scriptsPath,
            $escapedName,
            $escapedPort
        );

        Log::info('Current working directory:', [
          'directory' => getcwd()
        ]);

        exec('whoami', $output);
        Log::info('User running the script:', [
          'user' => $output
        ]);

      
        
        exec($command . " 2>&1", $output, $returnCode);
        
        Log::info('Add Instance Script Output:', [
            'command' => $command,
            'output' => implode("\n", $output),
            'returnCode' => $returnCode,
            'name' => $name,
            'port' => $port
        ]);

        return $returnCode === 0;
    }

    public function startInstance(string $name, ?int $port = null): bool
    {
        // Check if this is the first instance and docker isn't running
        if (!$this->isDockerRunning()) {
            Log::info('Docker not running, initializing with run.sh');
            if (!$this->startDocker()) {
                Log::error('Failed to run initial setup');
                return false;
            }
            // Add a small delay to ensure Docker is fully initialized
            sleep(2);
        }

        // Now add the new instance
        $success = $this->addInstance($name, $port ?? 8080);
        
        if ($success) {
            // Increase delay to give more time for container to fully start
            sleep(2);
            
            // Double-check the instance status
            $statuses = $this->checkInstancesStatus();
            $isRunning = isset($statuses[$name]) && strtolower($statuses[$name]) === 'running';

            
            // Remove the dd() call and add more logging
            Log::info('Instance start status:', [
                'name' => $name,
                'isRunning' => $isRunning,
                'statuses' => $statuses
            ]);
            
            if (!$isRunning) {
                Log::warning('Instance reported success but is not running:', [
                    'name' => $name,
                    'status' => $statuses[$name] ?? 'unknown'
                ]);
                return false;
            }
        }

        return $success;
    }
    

    private function cleanupEnvFile(): bool
    {
        $scriptsPath = base_path('scripts/pb-manager-scripts');
        
        // Simply truncate the .env file
        $command = sprintf('cd "%s" && echo "" > .env', $scriptsPath);
        
        // Optionally, if you want to restore from .env.example:
        // $command = sprintf('cd "%s" && cp .env.example .env', $scriptsPath);
        
        exec($command . " 2>&1", $output, $returnCode);
        
        Log::info('Env Cleanup Output:', [
            'command' => $command,
            'output' => $output,
            'returnCode' => $returnCode
        ]);

        return $returnCode === 0;
    }

    public function shutdownDocker(): bool
    {
        // First cleanup the env file
        if (!$this->cleanupEnvFile()) {
            Log::error('Failed to cleanup env file');
            return false;
        }

        $scriptsPath = base_path('scripts/pb-manager-scripts');
        $command = sprintf('cd "%s" && docker compose down', $scriptsPath);
        
        exec($command . " 2>&1", $output, $returnCode);
        
        Log::info('Docker Shutdown Output:', [
            'command' => $command,
            'output' => $output,
            'returnCode' => $returnCode
        ]);

        if ($returnCode === 0) {
            Instance::query()->update(['status' => 'stopped']);
            return true;
        }

        return false;
    }

    public function deleteInstance(string $name, int $port): bool
    {
        $scriptsPath = base_path('scripts/pb-manager-scripts');
        
        // Properly escape the arguments
        $escapedName = escapeshellarg($name);
        $escapedPort = escapeshellarg((string)$port);
        
        // Build the command ensuring proper spacing and argument handling
        $command = sprintf(
            'cd "%s" && bash delete_instance.sh %s %s',
            $scriptsPath,
            $escapedName,
            $escapedPort
        );
        
        exec($command . " 2>&1", $output, $returnCode);
        
        Log::info('Delete Instance Script Output:', [
            'command' => $command,
            'output' => implode("\n", $output),
            'returnCode' => $returnCode,
            'name' => $name,
            'port' => $port
        ]);

        return $returnCode === 0;
    }

    public function stopInstance(string $name): bool
    {
        $scriptsPath = base_path('scripts/pb-manager-scripts');
        
        // Properly escape the argument
        $escapedName = escapeshellarg($name);
        
        // Build the command ensuring proper spacing and argument handling
        $command = sprintf(
            'cd "%s" && bash stop_instance.sh %s',
            $scriptsPath,
            $escapedName
        );
        
        exec($command . " 2>&1", $output, $returnCode);
        
        Log::info('Stop Instance Script Output:', [
            'command' => $command,
            'output' => implode("\n", $output),
            'returnCode' => $returnCode,
            'name' => $name
        ]);

        if ($returnCode === 0) {
            Instance::query()->where('name', $name)->update(['status' => 'stopped']);
            return true;
        }

        return false;
    }

    public function checkInstancesStatus(): array
    {
        $instances = Instance::all();
        $statuses = [];

        foreach ($instances as $instance) {
            $isRunning = $this->checkInstanceStatus($instance);
            $statuses[$instance->name] = $isRunning ? 'running' : 'stopped';
        }

        Log::info('Status check complete:', [
            'statuses' => $statuses
        ]);

        return $statuses;
    }

    public function checkInstanceStatus(Instance $instance): bool
    {
        $containerName = $instance->name;
        $port = $instance->port;
        
        Log::debug('Checking instance:', [
            'name' => $containerName,
            'port' => $port,
            'current_status' => $instance->status
        ]);

        // Check if Docker container is running
        $dockerCommand = "docker inspect --format='{{.State.Running}}' $containerName 2>/dev/null";
        exec($dockerCommand, $dockerOutput, $dockerReturnCode);
        
        // Get only the last (most recent) output
        $isRunningInDocker = false;
        if ($dockerReturnCode === 0) {
            $lastOutput = end($dockerOutput);
            $isRunningInDocker = trim($lastOutput) === 'true';
            
            Log::debug('Docker status check:', [
                'container' => $containerName,
                'output' => $dockerOutput,
                'lastOutput' => $lastOutput,
                'isRunning' => $isRunningInDocker
            ]);
        }

        // Only check health if Docker container is running
        $isHealthy = false;
        if ($isRunningInDocker) {
            $healthCommand = "curl -s -o /dev/null -w '%{http_code}' http://localhost:$port/api/health";
            exec($healthCommand, $healthOutput, $healthReturnCode);
            
            $lastHealthOutput = end($healthOutput);
            $isHealthy = $healthReturnCode === 0 && $lastHealthOutput === '200';
            
            Log::debug('Health check:', [
                'instance' => $containerName,
                'output' => $healthOutput,
                'lastOutput' => $lastHealthOutput,
                'isHealthy' => $isHealthy
            ]);
        }

        $isRunning = $isRunningInDocker && $isHealthy;
        
        // Determine the new status based on current status and running state
        $newStatus = $instance->status;
        if ($isRunning) {
            $newStatus = 'running';
        } elseif ($instance->status === 'running') {
            $newStatus = 'stopped';
        } elseif ($instance->status === 'created') {
            // Keep 'created' status if it hasn't been started yet
            $newStatus = 'created';
        }
        
        Log::debug('Final status determination:', [
            'instance' => $containerName,
            'oldStatus' => $instance->status,
            'newStatus' => $newStatus,
            'isRunning' => $isRunning,
            'dockerRunning' => $isRunningInDocker,
            'healthCheck' => $isHealthy
        ]);

        if ($instance->status !== $newStatus) {
            Log::info('Updating instance status:', [
                'instance' => $containerName,
                'oldStatus' => $instance->status,
                'newStatus' => $newStatus
            ]);
            $instance->status = $newStatus;
            $instance->save();
        }

        return $isRunning;
    }
    

    public function restartInstance(string $name): bool
    {
        $scriptsPath = base_path('scripts/pb-manager-scripts');
        
        // Properly escape the argument
        $escapedName = escapeshellarg($name);
        
        // Build the command ensuring proper spacing and argument handling
        $command = sprintf(
            'cd "%s" && bash restart_instance.sh %s',
            $scriptsPath,
            $escapedName
        );
        
        exec($command . " 2>&1", $output, $returnCode);
        
        Log::info('Restart Instance Script Output:', [
            'command' => $command,
            'output' => implode("\n", $output),
            'returnCode' => $returnCode,
            'name' => $name
        ]);

        if ($returnCode === 0) {
            Instance::query()->where('name', $name)->update(['status' => 'running']);
            return true;
        }

        return false;
    }

    public function executeCommand(string $instanceName, string $command): \Generator
    {
        // Use base_path directly without additional quoting
        $scriptsPath = escapeshellarg(base_path('scripts/pb-manager-scripts'));
    
    
        // Set current directory if not already set
        if (!$this->currentDir) {
            $this->currentDir = base_path('scripts/pb-manager-scripts');
        }
    
        // Handle 'cd' command specifically
        if (preg_match('/^cd\s+(.+)$/', $command, $matches)) {
            $newDir = $matches[1];
    
            // Determine if the path is absolute or relative
            $targetDir = ($newDir[0] === '/') ? $newDir : $this->currentDir . '/' . $newDir;
            $targetDir = realpath($targetDir); // Resolve to an absolute path
    
            // Check if directory exists and update
            if ($targetDir && str_starts_with($targetDir, base_path())) {
                $this->currentDir = $targetDir;
    
                // Persist current directory in session
                session(['current_directory' => $this->currentDir]);
    
                yield [
                    'type' => 'output',
                    'content' => '',
                    'currentDir' => $this->currentDir
                ];
            } else {
                yield [
                    'type' => 'error',
                    'content' => 'Directory not found or access denied',
                    'currentDir' => $this->currentDir
                ];
            }
            return;
        }
    
        // Retrieve and set the current directory from session
        $this->currentDir = session('current_directory', $this->currentDir);
        chdir($this->currentDir);
    
        Log::info('Executing command:', [
            'instance' => $instanceName,
            'command' => $command,
            'workingDir' => $this->currentDir
        ]);
    
        // Execute the command
        $descriptorSpec = [
            1 => ['pipe', 'w'],  // stdout
            2 => ['pipe', 'w']   // stderr
        ];
    
        $process = proc_open($command, $descriptorSpec, $pipes);
    
        if (is_resource($process)) {
            while (!feof($pipes[1]) || !feof($pipes[2])) {
                $stdout = fgets($pipes[1]);
                if ($stdout !== false) {
                    yield [
                        'type' => 'output',
                        'content' => trim($stdout),
                        'currentDir' => $this->currentDir
                    ];
                }
    
                $stderr = fgets($pipes[2]);
                if ($stderr !== false) {
                    yield [
                        'type' => 'error',
                        'content' => trim($stderr),
                        'currentDir' => $this->currentDir
                    ];
                }
            }
    
            fclose($pipes[1]);
            fclose($pipes[2]);
            proc_close($process);
        } else {
            yield [
                'type' => 'error',
                'content' => 'Failed to execute command',
                'currentDir' => $this->currentDir
            ];
        }
    }
    

    public function getInstances(): array
    {
        $instances = Instance::all()->map(function ($instance) {
            return [
                'name' => $instance->name,
                'port' => $instance->port,
                'status' => $instance->status,
                'created_at' => $instance->created_at,
                'updated_at' => $instance->updated_at,
            ];
        })->toArray();

        return $instances;
    }

    
    public function getInstance(string $instanceName): ?array
    {
        $instance = Instance::where('name', $instanceName)->first();
        
        if (!$instance) {
            return null;
        }

        return [
            'name' => $instance->name,
            'port' => $instance->port,
            'status' => $instance->status,
            'created_at' => $instance->created_at,
            'updated_at' => $instance->updated_at,
        ];
    }
}
