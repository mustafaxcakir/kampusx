<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Gizlilik ayarları - 'public', 'members', 'private'
            $table->enum('email_privacy', ['public', 'members', 'private'])->default('private');
            $table->enum('phone_privacy', ['public', 'members', 'private'])->default('private');
            $table->enum('university_privacy', ['public', 'members', 'private'])->default('public');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['email_privacy', 'phone_privacy', 'university_privacy']);
        });
    }
};
