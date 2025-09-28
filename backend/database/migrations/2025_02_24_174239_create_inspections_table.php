<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInspectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inspections', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->unsignedBigInteger('service_no'); // Foreign key for ServiceRecord
            $table->unsignedBigInteger('service_inventory_id')->nullable(); // Foreign key for ServiceInventory
            $table->string('item');
            $table->text('remark')->nullable();
            $table->integer('quantity')->default(1);
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('service_no')->references('service_no')->on('service_records')->onDelete('cascade');
            $table->foreign('service_inventory_id')->references('service_inventory_id')->on('service_inventories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inspections');
    }
}
