<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_files', function (Blueprint $table) {
            $table->id();
            
            // Foreign Key to 'tbl_folder'
            $table->foreignId('folder_id')
                  ->constrained('tbl_folder') // Now guaranteed to exist
                  ->onDelete('cascade');
                  
            $table->string('fileName');
            $table->string('filePath');
            $table->string('fileType')->nullable();
            $table->bigInteger('fileSize')->nullable();
            $table->timestamps();
            $table->softDeletes(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_files');
    }
};
