<?php

namespace Nearata\MinecraftAvatars\Listeners;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\BasicUserSerializer;

class AddUserMinotarAttribute
{
    public function handle(Serializing $event)
    {
        if ($event->isSerializer(BasicUserSerializer::class)) {
            $event->attributes['minotar'] = $event->model->minotar;
        }
    }
}