<?php

namespace Nearata\MinecraftAvatars;

use Flarum\Foundation\ValidationException;
use Flarum\User\Event\Saving;

use Illuminate\Support\Arr;

use GuzzleHttp\Client as Client;

class SaveMinecraftAvatar
{
    public function handle(Saving $event)
    {
        if (!Arr::has($event->data, 'attributes.minotar')) {
            return;
        }

        $minotar = Arr::get($event->data, 'attributes.minotar');

        $validUsernameRegex = '/^[a-zA-Z0-9_]{1,16}$/';
        $validUUIDPlainRegex = '[0-9a-f]{32}';
        $validUUIDDashRegex = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
        $validUUIDRegex = '/^(' . $validUUIDPlainRegex . '|' . $validUUIDDashRegex . ')$/';

        $uuid = null;

        if (preg_match($validUsernameRegex, $minotar)) {
            $client = new Client(['base_uri' => 'https://api.mojang.com/users/profiles/minecraft/']);
            $response = $client->request('GET', $minotar);
            $statusCode = $response->getStatusCode();

            if ($statusCode === 204) {
                throw new ValidationException([
                    'nearataMinecraftAvatars' => app('translator')->trans('nearata-minecraft-avatars.forum.username_not_found')
                ]);
            }

            $json = json_decode($response->getBody());

            $uuid = $json->id;
        } else if (preg_match($validUUIDRegex, $minotar)) {
            $uuid = $minotar;
        } else if (strlen($minotar) === 0) {
            $uuid = null;
        } else {
            throw new ValidationException([
                'nearataMinecraftAvatars' => app('translator')->trans('nearata-minecraft-avatars.forum.username_uuid_not_valid')
            ]);
        }

        $user = $event->user;

        $user->minotar = $uuid;
        $user->save();
    }
}
