<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehicleHandoverTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_handovers', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('checking_item');
            $table->string('name');
            $table->string('signature');
            $table->timestamp('time');
            $table->foreignId('service_no')->constrained('service_records')->onDelete('cascade'); // Foreign key constraint for service_records
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
        Schema::dropIfExists('vehicle_handover');
    }
}
