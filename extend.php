<?php

namespace Nearata\MinecraftAvatars;

use Flarum\Extend;
use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\User\Event\Saving;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js'),
    new Extend\Locales(__DIR__.'/resources/locale'),
    (new Extend\ApiSerializer(BasicUserSerializer::class))
        ->attribute('minotar', function ($serializer, $user, $attributes) {
            return $user->minotar;
        }),
    (new Extend\Event)
        ->listen(Saving::class, SaveMinecraftAvatar::class)
];
