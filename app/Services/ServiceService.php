<?php

namespace App\Services;

use App\Models\Service;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ServiceService
{
    /**
     * Get all active services
     */
    public function getActiveServices(): Collection
    {
        return Service::where('status', 'active')->get();
    }

    /**
     * Get all services (for admin)
     */
    public function getAllServices(): Collection
    {
        return Service::all();
    }

    /**
     * Create a new service
     */
    public function createService(array $data): Service
    {
        return Service::create($data);
    }

    /**
     * Update an existing service
     */
    public function updateService(Service $service, array $data): bool
    {
        return $service->update($data);
    }

    /**
     * Delete a service
     */
    public function deleteService(Service $service): bool
    {
        return $service->delete();
    }

    /**
     * Find service by ID
     */
    public function findService(int $id): ?Service
    {
        return Service::find($id);
    }

    /**
     * Find service by ID or fail
     */
    public function findServiceOrFail(int $id): Service
    {
        return Service::findOrFail($id);
    }
}
