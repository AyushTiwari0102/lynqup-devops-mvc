<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Creator extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'role',
        'industry',
        'rate',
        'location',
        'status',
        'rating',
        'verified',
        'tags',
        'metrics',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'verified' => 'boolean',
        'tags' => 'array',
        'metrics' => 'array',
        'rate' => 'integer',
        'rating' => 'float',
    ];
}
