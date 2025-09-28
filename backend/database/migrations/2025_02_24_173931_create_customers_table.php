<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id('customer_id'); // Primary key
            $table->string('first_name', 50);
            $table->string('last_name', 50);
            $table->string('mobile_number', 15)->unique();
            $table->string('email', 100)->unique()->nullable();
            $table->string('house_number', 20)->nullable();
            $table->string('street_name', 100);
            $table->string('city', 50);
            $table->string('state', 50);
            $table->date('dob')->nullable();
            $table->string('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
        });

        // Add foreign key constraints for related tables
        Schema::table('service_records', function (Blueprint $table) {
            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('cascade');
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('cascade');
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
            $table->dropForeign(['customer_id']);
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
        });

        Schema::dropIfExists('customers');
    }
}
