<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_files', function (Blueprint $table) {
            $table->id(); // primary key
            $table->unsignedBigInteger('folder_id'); 
            $table->string('fileName'); 
            $table->string('filePath'); 
            $table->string('fileType')->nullable(); // pdf, docx, jpg, etc.
            $table->bigInteger('fileSize')->nullable(); // store size in bytes
            $table->timestamps(); // created_at, updated_at

            // Foreign key constraint
            $table->foreign('folder_id')
                  ->references('id')->on('tbl_folder')
                  ->onDelete('cascade'); // if folder is deleted, files go too
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_files');
    }
};
