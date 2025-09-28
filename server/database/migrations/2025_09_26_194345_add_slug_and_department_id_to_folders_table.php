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
        Schema::table('tbl_folder', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('description');
            $table->unsignedBigInteger('department_id')->nullable()->after('slug');
        });

        // For existing folders, we'll need to assign them to a default department or handle them separately
        // For now, let's just add the columns and handle the foreign key later
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tbl_folder', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn(['slug', 'department_id']);
        });
    }
};
