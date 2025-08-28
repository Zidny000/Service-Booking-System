<?php

namespace Tests\Unit;

use App\Models\User;
use App\Services\AuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthServiceTest extends TestCase
{
    use RefreshDatabase;

    protected AuthService $authService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authService = new AuthService();
    }

    public function test_can_register_user()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $user = $this->authService->register($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('Test User', $user->name);
        $this->assertEquals('test@example.com', $user->email);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    public function test_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123')
        ]);

        $credentials = [
            'email' => $user->email,
            'password' => 'password123'
        ];

        $loggedInUser = $this->authService->login($credentials);

        $this->assertInstanceOf(User::class, $loggedInUser);
        $this->assertEquals($user->id, $loggedInUser->id);
    }

    public function test_returns_null_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123')
        ]);

        $credentials = [
            'email' => $user->email,
            'password' => 'wrongpassword'
        ];

        $loggedInUser = $this->authService->login($credentials);

        $this->assertNull($loggedInUser);
    }

    public function test_can_create_token()
    {
        $user = User::factory()->create();

        $token = $this->authService->createToken($user);

        $this->assertIsString($token);
        $this->assertNotEmpty($token);
    }

    public function test_can_logout_user()
    {
        $user = User::factory()->create();
        $token = $this->authService->createToken($user);

        $result = $this->authService->logout($user);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id
        ]);
    }

    public function test_can_get_users_list()
    {
        User::factory()->count(5)->create();

        $users = $this->authService->getUsersList(3);

        $this->assertCount(3, $users);
        $this->assertEquals(5, $users->total());
    }
}
