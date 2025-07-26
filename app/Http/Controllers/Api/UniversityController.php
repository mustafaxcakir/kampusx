<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\University;
use Illuminate\Http\JsonResponse;

class UniversityController extends Controller
{
    public function index(): JsonResponse
    {
        $universities = University::orderBy('name')->get(['id', 'name', 'email_domain']);
        
        return response()->json($universities);
    }
} 