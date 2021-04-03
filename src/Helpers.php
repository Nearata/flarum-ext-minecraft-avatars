<?php

namespace Nearata\MinecraftAvatars;

use GuzzleHttp\Client as Client;

class Helpers
{
    public static function isUsername(string $minotar): bool
    {
        $validUsernameRegex = '/^[a-zA-Z0-9_]{1,16}$/';
        return preg_match($validUsernameRegex, $minotar);
    }

    public static function getUUID(string $minotar): string
    {
        $client = new Client(['base_uri' => 'https://api.mojang.com/users/profiles/minecraft/']);
        $response = $client->request('GET', $minotar);
        $statusCode = $response->getStatusCode();

        if ($statusCode === 204) {
            return '';
        }

        return json_decode($response->getBody())->id;
    }
}
