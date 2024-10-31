<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SpeedTest extends Model
{
    protected $fillable = [
        'instance_id',
        'total_records_attempted',
        'successful_records',
        'failed_records',
        'total_time_seconds',
        'average_time_per_record_seconds',
        'records_per_second',
        'test_started_at',
        'test_ended_at'
    ];

    protected $casts = [
        'total_time_seconds' => 'float',
        'average_time_per_record_seconds' => 'float',
        'records_per_second' => 'float',
        'test_started_at' => 'datetime',
        'test_ended_at' => 'datetime'
    ];

    public function instance(): BelongsTo
    {
        return $this->belongsTo(Instance::class);
    }
}
