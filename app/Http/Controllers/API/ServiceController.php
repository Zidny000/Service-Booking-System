<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Services\ServiceService;
use Illuminate\Http\Response;

class ServiceController extends Controller
{
    protected ServiceService $serviceService;

    public function __construct(ServiceService $serviceService)
    {
        $this->serviceService = $serviceService;
    }

    /**
     * Display a listing of the services.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $services = $this->serviceService->getActiveServices();
        return response()->json([
            'status' => 'success',
            'data' => ServiceResource::collection($services)
        ]);
    }

    /**
     * Display a listing of all services (Admin only).
     *
     * @return \Illuminate\Http\Response
     */
    public function adminIndex()
    {
        $services = $this->serviceService->getAllServices();
        return response()->json([
            'status' => 'success',
            'data' => ServiceResource::collection($services)
        ]);
    }

    /**
     * Store a newly created service in storage.
     * (Admin only)
     *
     * @param  \App\Http\Requests\Service\StoreServiceRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreServiceRequest $request)
    {
        $validated = $request->validated();
        $service = $this->serviceService->createService($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Service created successfully',
            'data' => new ServiceResource($service)
        ], Response::HTTP_CREATED);
    }

    /**
     * Update the specified service in storage.
     * (Admin only)
     *
     * @param  \App\Http\Requests\Service\UpdateServiceRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateServiceRequest $request, $id)
    {
        $service = $this->serviceService->findServiceOrFail($id);
        $validated = $request->validated();
        
        $this->serviceService->updateService($service, $validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Service updated successfully',
            'data' => new ServiceResource($service)
        ]);
    }

    /**
     * Remove the specified service from storage.
     * (Admin only)
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $service = $this->serviceService->findServiceOrFail($id);
        $this->serviceService->deleteService($service);

        return response()->json([
            'status' => 'success',
            'message' => 'Service deleted successfully'
        ]);
    }
}
