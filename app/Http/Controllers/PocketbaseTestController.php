<?php

namespace App\Http\Controllers;

use App\Models\Instance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Services\PocketbaseInstanceService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\SpeedTest;

class PocketbaseTestController extends Controller
{
    private string $baseUrl;
    private string $adminEmail;
    private string $adminPassword;
    private int $testRecordCount;
    protected $instanceService;

    public function __construct(PocketbaseInstanceService $instanceService)
    {
        $this->instanceService = $instanceService;
        $this->adminEmail = env('SPEED_TEST_ADMIN_EMAIL', 'admin@example.com');
        $this->adminPassword = env('SPEED_TEST_ADMIN_PASSWORD', 'password123456');
        $this->testRecordCount = (int)env('SPEED_TEST_RECORDS', 50);
    }

    public function runSpeedTest(Request $request)
    {
        try {
            // Check password length before proceeding
            if (strlen($this->adminPassword) < 10) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin password must be at least 10 characters long'
                ], 422);
            }

            // Step 1: Create instance
            $instance = $this->createTestInstance();
            
            // Step 2: Start instance
            $startSuccess = $this->startTestInstance($instance);
            if (!$startSuccess) {
                throw new \Exception('Failed to start instance');
            }



            $this->baseUrl = env('POCKETBASE_BASE_URL') . "/{$instance->name}";


            // Step 3: Create admin user
            $adminResponse = $this->createAdminUser();
            
            // Step 4: Login with admin credentials
            $authResponse = $this->loginAdmin();
            $token = $authResponse['token'];
            
            // Step 5: Create collection
            $collectionResponse = $this->createCollection($token);
            
            // Step 6: Write test records and measure performance
            $performanceResults = $this->writeTestRecords($token);
            
            // Save test results
            $speedTest = SpeedTest::create([
                'instance_id' => $instance->id,
                'total_records_attempted' => $performanceResults['total_records_attempted'],
                'successful_records' => $performanceResults['successful_records'],
                'failed_records' => $performanceResults['failed_records'],
                'total_time_seconds' => $performanceResults['total_time_seconds'],
                'average_time_per_record_seconds' => $performanceResults['average_time_per_record_seconds'],
                'records_per_second' => $performanceResults['records_per_second'],
                'test_started_at' => $performanceResults['start_time'],
                'test_ended_at' => $performanceResults['end_time']
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Speed test completed successfully',
                'instance' => $instance,
                'admin' => $adminResponse,
                'auth' => $authResponse,
                'collection' => $collectionResponse,
                'performance' => $performanceResults,
                'speedTest' => $speedTest
            ]);
        } catch (\Exception $e) {
            Log::error('Speed test failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function createTestInstance()
    {
        // Get the highest speedtest number currently in use
        $baseSpeedTestName = env('SPEED_TEST_INSTANCE_NAME', 'speedtest');
        $latestSpeedTest = Instance::where('name', 'like', $baseSpeedTestName . '_%')
            ->orderByRaw('CAST(SUBSTRING(name, ' . (strlen($baseSpeedTestName) + 2) . ') AS UNSIGNED) DESC')
            ->first();

        // Start with 1 if no speedtests exist, otherwise increment the last number
        $number = 1;
        if ($latestSpeedTest) {
            $lastNumber = (int) substr($latestSpeedTest->name, strlen($baseSpeedTestName) + 1);
            $number = $lastNumber + 1;
        }

        $name = "{$baseSpeedTestName}_{$number}";
 
        $instance = Instance::create([
            'name' => $name,
            'status' => 'created'
        ]);

        // Update status to 'updating' before starting
        $instance->update(['status' => 'updating']);

        return $instance;
    }

    private function startTestInstance(Instance $instance)
    {
        return $this->instanceService->startInstance(
            $instance->name,
        );
    }

    private function createAdminUser()
    {
        return Http::post("{$this->baseUrl}/api/admins", [
            'email' => $this->adminEmail,
            'password' => $this->adminPassword,
            'passwordConfirm' => $this->adminPassword
        ])->throw()->json();
    }

    private function loginAdmin()
    {
        return Http::post("{$this->baseUrl}/api/admins/auth-with-password", [
            'identity' => $this->adminEmail,
            'password' => $this->adminPassword
        ])->throw()->json();
    }

    private function createCollection(string $token)
    {
        return Http::withToken($token)
            ->post("{$this->baseUrl}/api/collections", [
                'type' => 'base',
                'name' => 'posts',
                'schema' => [
                    [
                        'system' => false,
                        'name' => 'name',
                        'type' => 'text',
                    ],
                    [
                        'system' => false,
                        'name' => 'description',
                        'type' => 'text',
                    ]
                ]
            ])->throw()->json();
    }

    private function writeTestRecords(string $token)
    {
        $startTime = microtime(true);
        $successCount = 0;
        $failureCount = 0;
        $totalTime = 0;
        $count = $this->testRecordCount;

        Log::info('Starting speed test write operation', [
            'recordCount' => $count,
            'startTime' => $startTime
        ]);

        for ($i = 0; $i < $count; $i++) {
            try {
                $response = Http::withToken($token)
                    ->post("{$this->baseUrl}/api/collections/posts/records", [
                        'name' => "Test Post " . ($i + 1),
                        'description' => "This is a test description for post " . ($i + 1) . ". " . 
                                       "Generated at " . now() . " with some random content: " . 
                                       Str::random(100)
                    ]);

                if ($response->successful()) {
                    $successCount++;
                } else {
                    $failureCount++;
                    Log::warning('Failed to create record', [
                        'record' => $i + 1,
                        'response' => $response->json()
                    ]);
                }
            } catch (\Exception $e) {
                $failureCount++;
                Log::error('Error creating record', [
                    'record' => $i + 1,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $endTime = microtime(true);
        $totalTime = $endTime - $startTime;
        $averageTimePerRecord = $totalTime / $count;

        $results = [
            'total_records_attempted' => $count,
            'successful_records' => $successCount,
            'failed_records' => $failureCount,
            'total_time_seconds' => round($totalTime, 3),
            'average_time_per_record_seconds' => round($averageTimePerRecord, 3),
            'records_per_second' => round($count / $totalTime, 2),
            'start_time' => now()->setTimestamp((int)$startTime),
            'end_time' => now()->setTimestamp((int)$endTime)
        ];

        Log::info('Speed test write operation completed', $results);

        return $results;
    }
}
