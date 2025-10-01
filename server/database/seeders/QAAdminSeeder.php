<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class QAAdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'], // unique key
            [
                'name' => 'QA Admin',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
                'role' => 'admin',
                'department_id' => null, // Admin has no specific department
            ]
        );
    }
}
