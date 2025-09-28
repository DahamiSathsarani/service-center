<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehiclesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->string('vehicle_number')->primary(); // Primary key
            $table->string('brand');
            $table->string('type');
            $table->string('engine_number');
            $table->string('fuel_type');
            $table->string('model');
            $table->date('license_expire_date');
            $table->date('insurence_expire_date');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade'); // Foreign key constraint for customers
            $table->string('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehicles');
    }
}
