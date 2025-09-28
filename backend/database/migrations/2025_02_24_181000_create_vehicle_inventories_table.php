<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehicleInventoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_inventories', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('item');
            $table->integer('no_of_items_in');
            $table->integer('no_of_items_out');
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
        Schema::dropIfExists('vehicle_inventories');
    }
}
