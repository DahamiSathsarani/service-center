<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOldCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('old_customers', function (Blueprint $table) {
            $table->id();
            
            // Define the columns before setting them as foreign keys
            $table->string('vehicle_number'); 
            $table->unsignedBigInteger('customer_id');

            // Fix the table name 'vehilces' → 'vehicles'
            $table->foreign('vehicle_number')->references('vehicle_number')->on('vehicles')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');

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
        Schema::dropIfExists('old_customers');
    }
}
