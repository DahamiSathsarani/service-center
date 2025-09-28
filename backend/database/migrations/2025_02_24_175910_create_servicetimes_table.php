<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServicetimesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_times', function (Blueprint $table) {
            $table->id('id'); // Primary key
            $table->time('in_time');
            $table->time('out_time');
            $table->time('status');
            $table->timestamps();
        });

        // Adding foreign key constraints
        Schema::table('service_times', function (Blueprint $table) {
            // Foreign key for service_records table
            $table->unsignedBigInteger('service_no');
            $table->foreign('service_no')->references('service_no')->on('service_records')->onDelete('cascade');

            // Foreign key for bays table
            $table->unsignedBigInteger('bay_id');
            $table->foreign('bay_id')->references('bay_id')->on('bays')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Dropping the foreign key constraints before dropping the table
        Schema::table('service_times', function (Blueprint $table) {
            $table->dropForeign(['service_no']);
            $table->dropForeign(['bay_id']);
        });

        // Dropping the service_times table
        Schema::dropIfExists('service_times');
    }
}
