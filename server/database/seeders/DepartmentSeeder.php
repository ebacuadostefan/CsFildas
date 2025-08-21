<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $departments = [
            'Computer Studies',
            'Hospitality and Tourism Management',
            'College of Nursing',
            'Arts and Science',
            'Business and Accountancy',
            'Teacher\'s Education',
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(['name' => $dept]);
        }
    }
}
