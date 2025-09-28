<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePackagepricesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('package_prices', function (Blueprint $table) {
            $table->id('id'); 
            $table->decimal('price', 10, 2); 
            $table->string('job_name');
            $table->string('vehicle_type');
            $table->timestamps();
        });

        // Adding the foreign key constraint to the service_records table
        Schema::table('service_records_packages', function (Blueprint $table) {
            $table->unsignedBigInteger('job_type_id');

            $table->foreign('job_type_id')->references('id')->on('job_type')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('service_records', function (Blueprint $table) {
            $table->dropForeign(['package_price_id']);
            $table->dropColumn('package_price_id');
        });

        // Dropping the package_prices table
        Schema::dropIfExists('package_prices');    }
}
