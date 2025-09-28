<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->id('permission_id');
            $table->string('value');
            $table->timestamps();
        });

        Schema::table('user_roles', function (Blueprint $table) {
            $table->unsignedBigInteger('permission_id');
            $table->foreign('permission_id')->references('permission_id')->on('permissions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_roles', function (Blueprint $table) {
            $table->dropForeign(['permission_id']);
            $table->dropColumn('permission_id');
        });

        // Dropping the permissions table
        Schema::dropIfExists('permissions');    }
}
