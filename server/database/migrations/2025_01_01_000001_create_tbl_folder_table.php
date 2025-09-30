<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_folder', function (Blueprint $table) {
            $table->id();
            
            // Foreign Key to 'departments'
            $table->foreignId('department_id')
                  ->constrained('departments') // Now guaranteed to exist
                  ->onDelete('cascade');
                  
            $table->string('folderName');
            $table->text('description')->nullable();
            $table->string('slug')->unique();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_folder');
    }
};
