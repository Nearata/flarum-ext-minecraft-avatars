<?php

namespace Nearata\MinecraftAvatars\User\Listener;

use Flarum\User\Event\LoggedIn;
use Nearata\MinecraftAvatars\Helpers;

class LoggedInListener
{
    public function handle(LoggedIn $event): void
    {
        $minotar = $event->user->minotar;

        if (! is_null($minotar) && Helpers::isUUID($minotar)) {
            return;
        }

        $newMinotar = null;

        if (is_null($minotar)) {
            $newMinotar = Helpers::getRandomUsername();
        } elseif (! in_array($minotar, Helpers::$usernames)) {
            $uuid = Helpers::getUUID($minotar);

            if (empty($uuid)) {
                $newMinotar = Helpers::getRandomUsername();
            } else {
                $newMinotar = $uuid;
            }
        } else {
            $newMinotar = $minotar;
        }

        if ($newMinotar !== $minotar) {
            $event->user->minotar = $newMinotar;
            $event->user->save();
        }
    }
}
