<?php

namespace App\Console\Commands;

use App\Http\Controllers\NewsController;
use Illuminate\Console\Command;

class FetchExternalNews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-external-news';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Gets news from newsApi on 10 minute basis';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $controller = new NewsController();
        $controller->fetchCryptoNews();
        $controller->fetchForexNews();
        $controller->fetchEnergyNews();
    }
}
