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
        Schema::create('product_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('asked_by_user_id')->constrained('users')->onDelete('cascade'); // Soruyu soran kullanıcı
            $table->text('question');
            $table->text('answer')->nullable(); // Sadece ürün sahibi cevaplayabilir
            $table->timestamp('answered_at')->nullable(); // Cevap verildiği tarih
            $table->boolean('is_public')->default(true); // Soru herkese görünür mü?
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_questions');
    }
};
