<?php

namespace Nearata\MinecraftAvatars;

use Flarum\Foundation\ValidationException;
use Flarum\User\Event\Saving;

use Illuminate\Support\Arr;

class SaveUserMinotar
{
    public function handle(Saving $event)
    {
        if (Arr::has($event->data, 'attributes.minotar')) {
            $minotar = Arr::get($event->data, 'attributes.minotar');

            $validUUIDPlainRegex = '[0-9a-f]{32}';
            $validUUIDDashRegex = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

            $validUUIDRegex = '(' . $validUUIDPlainRegex . '|' . $validUUIDDashRegex . ')';

            if (strlen($minotar) === 0) {
                $minotar = null;
            } else if (strlen($minotar) > 0 && !preg_match('/^' . $validUUIDRegex . '$/', $minotar)) {
                throw new ValidationException([
                    'minotar' => app('translator')->trans('nearata-minecraft-avatars.forum.username_uuid_not_valid')
                ]);
            }

            $user = $event->user;

            $user->minotar = $minotar;
            $user->save();
        }
    }
}
