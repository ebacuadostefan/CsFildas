<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First add the slug column without unique constraint
        Schema::table('departments', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('alias');
        });

        // Populate slugs for existing departments
        $departments = DB::table('departments')->get();
        foreach ($departments as $department) {
            $slug = Str::slug($department->name);
            $originalSlug = $slug;
            $counter = 1;
            
            // Ensure unique slug
            while (DB::table('departments')->where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            
            DB::table('departments')
                ->where('id', $department->id)
                ->update(['slug' => $slug]);
        }

        // Now add the unique constraint
        Schema::table('departments', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
