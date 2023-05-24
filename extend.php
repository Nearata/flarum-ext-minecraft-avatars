<?php

namespace Nearata\MinecraftAvatars;

use Flarum\Extend;
use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\Frontend\Document;
use Flarum\Http\RequestUtil;
use Flarum\User\Event\LoggedIn;
use Flarum\User\Event\Registered;
use Flarum\User\Event\Saving;
use Flarum\User\User;
use Nearata\MinecraftAvatars\User\Listener\LoggedInListener;
use Nearata\MinecraftAvatars\User\Listener\RegisteredListener;
use Nearata\MinecraftAvatars\User\Listener\SavingListener;
use Psr\Http\Message\ServerRequestInterface;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->route('/minecraft-avatars', 'nearata.minecraft-avatars', function (Document $document, ServerRequestInterface $request) {
            RequestUtil::getActor($request)->assertRegistered();
            $document->title = 'Minecraft Avatars';
        }),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\ApiSerializer(BasicUserSerializer::class))
        ->attributes(function (BasicUserSerializer $serializer, User $user, array $attributes) {
            return [
                'minotar' => $user->minotar,
                'minotarEnabled' => $user->minotar_enabled
            ];
        }),

    (new Extend\Event)
        ->listen(Saving::class, SavingListener::class)
        ->listen(LoggedIn::class, LoggedInListener::class)
        ->listen(Registered::class, RegisteredListener::class),

    (new Extend\Settings)
        ->default('nearata-minecraft-avatars.retrieve_avatar_on_register', false)
];
