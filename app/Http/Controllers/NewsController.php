<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class NewsController extends Controller
{
    public function showCryptoNews()
    {
        /** Fetch crypto news and save to database */
        $response = Http::get('https://newsapi.org/v2/top-headlines/', [
            'q' => 'crypto',
            'apiKey' => env('NEWS_API_KEY'),
        ]);
        $results = $response->json();
        # Saving to db
        $articles = [];
        foreach ($results['articles'] as $article) {
            $articles[] = News::createNew($article, 'crypto');
        }

        /** Get the articles from the db and send them to React */
        $articles = News::where('category', 'crypto')->get();
        return Inertia::render('news/crypto-news', [
            'balance' => Auth::user()->getBalance(),
            'articles' => $articles,
        ]);
    }

    public function showForexNews()
    {
        /** Fetch crypto news and save to database */
        $response = Http::get('https://newsapi.org/v2/top-headlines/', [
            'q' => 'forex',
            'apiKey' => env('NEWS_API_KEY'),
        ]);
        $results = $response->json();
        #dd($results);
        # Saving to db
        $articles = [];
        foreach ($results['articles'] as $article) {
            $articles[] = News::createNew($article, 'forex');
        }

        /** Get the articles from the db and send them to React */
        $articles = News::where('category', 'forex')->get();
        return Inertia::render('news/forex-news', [
            'balance' => Auth::user()->getBalance(),
            'articles' => $articles,
        ]);
    }

    public function showEnergyNews()
    {
        /** Fetch crypto news and save to database */
        $response = Http::get('https://newsapi.org/v2/top-headlines/', [
            'q' => 'energy',
            'apiKey' => env('NEWS_API_KEY'),
        ]);
        $results = $response->json();
        # Saving to db
        $articles = [];
        foreach ($results['articles'] as $article) {
            $articles[] = News::createNew($article, 'energy');
        }

        /** Get the articles from the db and send them to React */
        $articles = News::where('category', 'energy')->get();
        return Inertia::render('news/energy-news', [
            'balance' => Auth::user()->getBalance(),
            'articles' => $articles,
        ]);
    }
}
