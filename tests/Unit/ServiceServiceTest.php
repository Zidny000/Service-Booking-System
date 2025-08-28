<?php

namespace Tests\Unit;

use App\Models\Service;
use App\Services\ServiceService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ServiceService $serviceService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->serviceService = new ServiceService();
    }

    public function test_can_get_active_services()
    {
        // Create active and inactive services
        Service::factory()->create(['status' => 'active']);
        Service::factory()->create(['status' => 'inactive']);
        Service::factory()->create(['status' => 'active']);

        $activeServices = $this->serviceService->getActiveServices();

        $this->assertCount(2, $activeServices);
        $this->assertEquals('active', $activeServices->first()->status);
    }

    public function test_can_get_all_services()
    {
        // Create multiple services
        Service::factory()->count(3)->create();

        $allServices = $this->serviceService->getAllServices();

        $this->assertCount(3, $allServices);
    }

    public function test_can_create_service()
    {
        $serviceData = [
            'name' => 'Test Service',
            'description' => 'Test Description',
            'price' => 100.00,
            'status' => 'active'
        ];

        $service = $this->serviceService->createService($serviceData);

        $this->assertInstanceOf(Service::class, $service);
        $this->assertEquals('Test Service', $service->name);
        $this->assertEquals(100.00, $service->price);
    }

    public function test_can_update_service()
    {
        $service = Service::factory()->create();
        $updateData = ['name' => 'Updated Service'];

        $result = $this->serviceService->updateService($service, $updateData);

        $this->assertTrue($result);
        $this->assertEquals('Updated Service', $service->fresh()->name);
    }

    public function test_can_delete_service()
    {
        $service = Service::factory()->create();

        $result = $this->serviceService->deleteService($service);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('services', ['id' => $service->id]);
    }

    public function test_can_find_service_by_id()
    {
        $service = Service::factory()->create();

        $foundService = $this->serviceService->findService($service->id);

        $this->assertInstanceOf(Service::class, $foundService);
        $this->assertEquals($service->id, $foundService->id);
    }

    public function test_returns_null_for_nonexistent_service()
    {
        $foundService = $this->serviceService->findService(999);

        $this->assertNull($foundService);
    }
}
