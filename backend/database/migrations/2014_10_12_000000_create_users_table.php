<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id'); // Primary key
            $table->string('first_name');
            $table->string('last_name');
            $table->string('username', 191)->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('profile_picture');
            $table->string('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->foreignId('role_id')->constrained('user_roles')->onDelete('cascade'); // Foreign key constraint for user roles
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
