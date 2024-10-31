<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('speed_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instance_id')->constrained()->onDelete('cascade');
            $table->integer('total_records_attempted');
            $table->integer('successful_records');
            $table->integer('failed_records');
            $table->decimal('total_time_seconds', 8, 3);
            $table->decimal('average_time_per_record_seconds', 8, 3);
            $table->decimal('records_per_second', 8, 2);
            $table->timestamp('test_started_at');
            $table->timestamp('test_ended_at');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('speed_tests');
    }
};