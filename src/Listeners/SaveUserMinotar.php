<?php

namespace Nearata\MinecraftAvatars\Listeners;

use Flarum\Foundation\ValidationException;
use Flarum\Locale\Translator;
use Flarum\User\Event\Saving;

use Illuminate\Support\Arr;

class SaveUserMinotar
{
    public function handle(Saving $event)
    {
        if (Arr::has($event->data, 'attributes.minotar')) {
            $minotar = Arr::get($event->data, 'attributes.minotar');

            $validUsernameRegex = '[a-zA-Z0-9_]{1,16}';
            $validUUIDPlainRegex = '[0-9a-f]{32}';
            $validUUIDDashRegex = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

            $validUUIDRegex = '(' . $validUUIDPlainRegex . '|' . $validUUIDDashRegex . ')';
            $validUsernameOrUUIDRegex = '(' . $validUUIDRegex . '|' . $validUsernameRegex . ')';

            if (strlen($minotar) === 0) {
                $minotar = null;
            } else if (strlen($minotar) > 0 && !preg_match('/^' . $validUsernameOrUUIDRegex . '$/', $minotar)) {
                throw new ValidationException([
                    'minotar' => app(Translator::class)->trans('nearata-minecraft-avatars.forum.username_uuid_not_valid')
                ]);
            }

            $user = $event->user;

            $user->minotar = $minotar;
            $user->save();
        }
    }
}
