<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiceinventriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_inventories', function (Blueprint $table) {
            $table->id('service_inventory_id'); // Primary key
            $table->string('item_name');
            $table->integer('quantity');
            $table->string('item_code');
            $table->string('type');
            $table->decimal('price', 10, 2); // Price with two decimal places
            $table->timestamps();
        });

        // Adding the foreign key constraint to the inspections table
        Schema::table('inspections', function (Blueprint $table) {
            $table->unsignedBigInteger('service_inventory_id'); // Foreign key for service_inventories

            // Foreign key constraint
            $table->foreign('service_inventory_id')->references('service_inventory_id')->on('service_inventories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('inspections', function (Blueprint $table) {
            $table->dropForeign(['service_inventory_id']);
            $table->dropColumn('service_inventory_id');
        });

        // Dropping the service_inventories table
        Schema::dropIfExists('service_inventories');
    }
}
