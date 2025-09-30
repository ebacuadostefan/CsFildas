<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->unsignedBigInteger('folder_id')->nullable();
            $table->string('item_name'); // folder name or file name
            $table->string('type'); // folder or file
            $table->enum('status', ['added', 'renamed', 'deleted']);
            $table->timestamps(); // stores date & time
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};

