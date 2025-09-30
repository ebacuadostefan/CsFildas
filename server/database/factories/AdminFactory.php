<?php

namespace Database\Factories;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
{
    protected $model = Admin::class;

    public function definition(): array
    {
        $name = fake()->name();
        $email = fake()->unique()->safeEmail();
        return [
            'name' => $name,
            'email' => $email,
            'password' => Hash::make('password'),
        ];
    }

    /**
     * Indicate that the admin should have a known email/password.
     */
    public function defaultAdmin(): static
    {
        return $this->state(fn () => [
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
    }
}


