<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $table = 'news';

    protected $casts = [
        'published_at' => 'datetime',
    ];

    protected $fillable = [
        'source',
        'author',
        'title',
        'description',
        'url',
        'url_to_image',
        'published_at',
        'content',
        # Сами си го задаваме
        'category',
    ];

    public static function createNew(Array $article_data, String $category)
    {
        return self::firstOrCreate(
            [ 'url' => $article_data['url'] ],
            [ 
                'source' => $article_data['source']['name'],
                'author' => $article_data['author'],
                'title' => $article_data['title'],
                'description' => $article_data['description'],
                'url_to_image' => $article_data['urlToImage'],
                'published_at' => $article_data['publishedAt'],
                'content' => $article_data['content'],
                # Сами си го задаваме
                'category' => $category,
            ]
        );
    }
}
