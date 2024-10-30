<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class PocketbaseVersionController extends Controller
{
    public function index()
    {
        $response = Http::get('https://api.github.com/repos/pocketbase/pocketbase/releases');

        
        if ($response->successful()) {
            $versions = $response->collect()
                ->filter(function ($release) {
                    // Only filter out drafts
                    return !$release['draft'];
                })
                ->map(function ($release) {
                    // Find the Linux AMD64 asset
                    $linuxAsset = collect($release['assets'])
                        ->first(function ($asset) {
                            return str_contains($asset['name'], 'linux_amd64.zip');
                        });

                    return [
                        'version' => ltrim($release['tag_name'], 'v'),
                        'name' => $release['name'],
                        'download_url' => $linuxAsset['browser_download_url'] ?? null,
                        'published_at' => $release['published_at'],
                        'is_prerelease' => $release['prerelease'],
                    ];
                })
                ->filter(function ($release) {
                    // Remove any releases where we couldn't find a Linux download
                    return !empty($release['download_url']);
                })
                ->values();


            return response()->json(['versions' => $versions]);
        }

        return response()->json(['error' => 'Unable to fetch versions'], 500);
    }
}
