<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create an admin user
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'is_admin' => true,
            'password' => bcrypt('admin@123'),
        ]);

        // Create a regular user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'is_admin' => false,
            'password' => bcrypt('regular@123'),
        ]);

        // Create some more regular users
        User::factory(8)->create();

        // Create some services
        Service::factory(10)->create();
        
        // Create some bookings
        $users = User::where('is_admin', false)->get();
        $services = Service::all();
        
        foreach ($users as $user) {
            // Create 1-3 bookings for each user
            $bookingCount = rand(1, 3);
            for ($i = 0; $i < $bookingCount; $i++) {
                Booking::factory()->create([
                    'user_id' => $user->id,
                    'service_id' => $services->random()->id,
                ]);
            }
        }
    }
}
