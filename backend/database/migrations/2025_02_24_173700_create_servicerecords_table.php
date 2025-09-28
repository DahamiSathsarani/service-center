<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServicerecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_records', function (Blueprint $table) {
            $table->id('service_no'); // Primary key
            $table->text('notes')->nullable();
            $table->text('damages')->nullable();
            $table->integer('odometer');
            $table->string('status');
            $table->string('customer_signature_start');
            $table->string('customer_signature_end');
            $table->date('date');
            $table->time('time');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });

        // Adding foreign key constraints
        Schema::table('service_records', function (Blueprint $table) {
            // Foreign key for users table
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');

            // Foreign key for customers table
            $table->unsignedBigInteger('customer_id');
            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('cascade');

            // Foreign key for vehicles table
            $table->string('vehicle_number');
            $table->foreign('vehicle_number')->references('vehicle_number')->on('vehicles')->onDelete('cascade');
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
            $table->dropForeign(['user_id']);
            $table->dropForeign(['customer_id']);
            $table->dropForeign(['vehicle_number']);
        });

        // Dropping the service_records table
        Schema::dropIfExists('service_records');    }
}
