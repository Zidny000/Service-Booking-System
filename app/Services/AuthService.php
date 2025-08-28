<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthService
{
    /**
     * Register a new user
     */
    public function register(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    /**
     * Attempt to login user
     */
    public function login(array $credentials): ?User
    {
        if (Auth::attempt($credentials)) {
            return Auth::user();
        }

        return null;
    }

    /**
     * Create auth token for user
     */
    public function createToken(User $user): string
    {
        return $user->createToken('authToken')->plainTextToken;
    }

    /**
     * Logout user and revoke tokens
     */
    public function logout(User $user): bool
    {
        return $user->tokens()->delete();
    }

    /**
     * Get paginated users list
     */
    public function getUsersList(int $perPage = 10): \Illuminate\Pagination\LengthAwarePaginator
    {
        return User::latest()->paginate($perPage);
    }
}
