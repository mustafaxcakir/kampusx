<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'about' => ['nullable', 'string', 'max:250'],
            'phone' => [
                'nullable', 
                'string', 
                'max:25',
                'regex:/^[\+]?[0-9\s\-\(\)]{7,20}$/'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Geçerli bir telefon numarası giriniz. Sadece rakam, boşluk, tire, parantez ve + işareti kullanabilirsiniz.',
        ];
    }
}
