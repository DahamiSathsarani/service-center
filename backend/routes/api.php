<?php

use App\Http\Controllers\BayController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\JobTypesController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\PackagePriceController;
use App\Http\Controllers\ServiceInventoryController;
use App\Http\Controllers\ServiceRecordController;
use App\Http\Controllers\ServiceRecordPackageController;
use App\Http\Controllers\ServiceTimeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VehicleInventoryController;
use App\Http\Controllers\VehicleHandoverController;
use App\Http\Controllers\OldCustomerController;
use App\Http\Controllers\NotificationController;
use App\Models\ServiceTime;
use Illuminate\Support\Facades\Route;

/* User routes */

Route::post('user/signin', [UserController::class, 'userLogin']);
Route::post('user/forgot-password', [UserController::class, 'send_resetLink']);
Route::post('user/reset-password', [UserController::class, 'reset_password']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('user/register', [UserController::class, 'user_registration']);
    Route::get('user/profile/{user_id}', [UserController::class, 'getAuthUserDetails']);
    Route::post('user/profile/update', [UserController::class, 'updateUserDetails']);
    Route::get('user/get/{role_id}', [UserController::class, 'get_users_by_type']);
    Route::put('user/delete/{user_id}', [UserController::class, 'delete_user']);
    Route::put('user/activate/{user_id}', [UserController::class, 'activate_user']);
});

/* Customer routes */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('customer/create', [CustomerController::class, 'customerCreation']);
    Route::post('customer/search', [CustomerController::class, 'customerSearch']);
    Route::post('customer/view', [CustomerController::class, 'customerView']);
    Route::get('customers/all/view', [CustomerController::class, 'get_all_customers_details']);
    Route::post('customer/update', [CustomerController::class, 'update_customer_details']);
    Route::post('customer/send-otp', [CustomerController::class, 'sendOtp']);
    Route::post('customer/verify-otp', [CustomerController::class, 'verifyOtp']);
    Route::put('/customer/update-mobile', [CustomerController::class, 'updateMobileNumber']);
});

/* Vehicle routes */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('vehicle/create', [VehicleController::class, 'vehicleCreation']);
    Route::post('vehicle/search', [VehicleController::class, 'vehicleSearch']);
    Route::post('vehicle/view', [VehicleController::class, 'vehicleView']);
    Route::post('vehicle/search-by-customer', [VehicleController::class, 'specificCustomerVehiclesView']);
    Route::get('/vehicle/getAll', [VehicleController::class, 'get_all']);
    Route::post('/vehicle/update', [VehicleController::class, 'update_vehicle_details']);
});

/* Vehicle Inventory */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('vehicleinventory/create', [VehicleInventoryController::class, 'inventoryCreation']);
    Route::post('vehicleinventory/update', [VehicleInventoryController::class, 'inventoryUpdate']);
    Route::get('vehicleinventory/update/{service_no}', [VehicleInventoryController::class, 'getInventoryByServiceNo']);
});
/* Job Types routes */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('jobtypes/getAll', [JobTypesController::class, 'getAllJobTypes']);
});
/* Package Price routes */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('jobtypes/getSubJobTypes', [PackagePriceController::class, 'getSubJobTypes']);

    /* Service Records Packages Mapping routes */
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('serviceRecord-Package/create', [ServiceRecordPackageController::class, 'serviceRecordPackageCreation']);
    });

    /* Service Records routes */
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('service-record/update_damages', [ServiceRecordController::class, 'update_damages']);
        Route::post('service-record/details', [ServiceRecordController::class, 'search_by_service_record_no']);
        Route::post('service-record/signature', [ServiceRecordController::class, 'update_signature']);
        Route::post('service-record/update/{record_id}', [ServiceRecordController::class, 'update_record_status']);
        Route::post('service-record/getCompleted', [ServiceRecordController::class, 'get_completed_records']);
        Route::post('service-record/getOngoing', [ServiceRecordController::class, 'get_ongoing_records']);
        Route::get('service-record/getPreviousOdometer/{vehicle_number}', [ServiceRecordController::class, 'get_previous_odometer']);
        Route::post('service-record/getStats', [ServiceRecordController::class, 'get_stats']);
        Route::get('service-records/get_all', [ServiceRecordController::class, 'get_all_records']);
        Route::post('damages/create', [ServiceRecordController::class, 'create_damages']);
    });
});

/* Bay Management routes */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('baymanagement/getInformation', [ServiceTimeController::class, 'getServiceTimeDetails']);
    Route::get('baymanagement/getDetails/{bay_type}', [BayController::class, 'get_all_bay_details']);
    Route::post('baymanagement/getTypeDetails/{bay_type}', [ServiceTimeController::class, 'getServiceTimesAccordingToType']);
    Route::post('baymanagement/create/{bay_type}', [ServiceTimeController::class, 'create_service_record']);
    Route::post('baymanagement/update/{bay_type}', [ServiceTimeController::class, 'update_service_record']);
});

/* Service Inventries routes */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('serviceinventries/getall', [ServiceInventoryController::class, 'get_all_inventories']);
});

/* Inspection routes */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('inspection/items', [InspectionController::class, 'create_and_update_inspections']);
    Route::post('inspection/items/get', [InspectionController::class, 'get_inspection_items']);
});



/* Vehicle Handover routes */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('handover/create', [VehicleHandoverController::class, 'create_handover_records']);
    Route::get('handover/get/{record_id}', [VehicleHandoverController::class, 'get_hondover_records']);
});


/* Old Customer routes */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('old-customer/create', [OldCustomerController::class, 'oldCustomerCreate']);
    Route::get('old-customer/search-by-customer/{searchValue}', [OldCustomerController::class, 'getOldVehicles']);
});

/* Notification Routes */
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/notifications/create', [NotificationController::class, 'createNotification']);
    Route::get('/notifications', [NotificationController::class, 'getUserNotifications']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadNotificationCount']);
    Route::post('/notifications/mark-as-read/{id}', [NotificationController::class, 'markAsRead']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('serviceinventories/getall', [ServiceInventoryController::class, 'get_all_inventories']);
    Route::post('serviceinventries', [ServiceInventoryController::class, 'store']);
    Route::get('serviceinventories/{service_inventory_id}', [ServiceInventoryController::class, 'show']);
    Route::put('serviceinventories/{service_inventory_id}', [ServiceInventoryController::class, 'update']);
    Route::delete('serviceinventories/{service_inventory_id}', [ServiceInventoryController::class, 'destroy']);
});

/* Logs routes */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('logs/getall', [LogController::class, 'get_all_logs']);
    Route::delete('logs/delete/{logId}', [LogController::class, 'delete_log']);
});