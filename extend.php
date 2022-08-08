<?php

namespace Nearata\MinecraftAvatars;

use Flarum\Extend;
use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\User\Event\LoggedIn;
use Flarum\User\Event\Registered;
use Flarum\User\Event\Saving;
use Flarum\User\User;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\ApiSerializer(BasicUserSerializer::class))
        ->attribute('minotar', function (BasicUserSerializer $serializer, User $user, array $attributes) {
            return $user->minotar;
        }),

    (new Extend\Event)
        ->listen(Saving::class, SaveMinecraftAvatar::class)
        ->listen(LoggedIn::class, LoggedInListener::class)
        ->listen(Registered::class, RegisteredListener::class),
];
