<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_records_packages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_no');
            $table->unsignedBigInteger('package_id');
            $table->timestamps();

            $table->foreign('service_no')->references('service_no')->on('service_records')->onDelete('cascade');
            $table->foreign('package_id')->references('id')->on('package_prices')->onDelete('cascade');

            $table->unique(['service_no', 'package_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('service_records_packages');
    }
};
