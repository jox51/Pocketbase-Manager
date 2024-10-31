<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instance extends Model
{
    protected $fillable = [
        'name',
        'port',
        'status',
        'version',
        'download_url',
    ];

    public function speedTests()
    {
        return $this->hasMany(SpeedTest::class);
    }

    public function latestSpeedTest()
    {
        return $this->hasOne(SpeedTest::class)->latest();
    }

    public function isSpeedTest(): bool
    {
        return str_starts_with($this->name, 'speedtest_');
    }
}
