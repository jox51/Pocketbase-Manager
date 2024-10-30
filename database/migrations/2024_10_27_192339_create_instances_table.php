<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('instances', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->integer('port')->default(8090)->unique();
            $table->enum('status', ['created','stopped', 'starting', 'running', 'updating'])->default('created');
            $table->string('version')->nullable()->after('port');
            $table->string('download_url')->nullable()->after('version');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instances');
    }
};
