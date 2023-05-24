<?php

namespace Nearata\MinecraftAvatars\User\Listener;

use Flarum\Foundation\ValidationException;
use Flarum\User\Event\Saving;
use Illuminate\Support\Arr;
use Nearata\MinecraftAvatars\Helpers;
use Symfony\Contracts\Translation\TranslatorInterface;

class SavingListener
{
    /**
     * @var TranslatorInterface
     */
    protected $translator;

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    public function handle(Saving $event): void
    {
        if (Arr::has($event->data, 'attributes.minotar')) {
            $this->avatar($event);
        }

        if (Arr::has($event->data, 'attributes.minotarEnabled')) {
            $this->switching($event);
        }
    }

    private function avatar(Saving $event)
    {
        $minotar = Arr::get($event->data, 'attributes.minotar');

        $uuid = null;

        if (Helpers::isUsername($minotar)) {
            $uuid = Helpers::getUUID($minotar);

            if (empty($uuid)) {
                throw new ValidationException([
                    'nearataMinecraftAvatars' => $this->translator->trans('nearata-minecraft-avatars.forum.username_not_found'),
                ]);
            }
        } elseif (Helpers::isUUID($minotar)) {
            $uuid = $minotar;
        } elseif (strlen($minotar) === 0) {
            $uuid = Helpers::getRandomUsername();
        } else {
            throw new ValidationException([
                'nearataMinecraftAvatars' => $this->translator->trans('nearata-minecraft-avatars.forum.username_uuid_not_valid'),
            ]);
        }

        $event->user->minotar = $uuid;
    }

    private function switching(Saving $event)
    {
        $enabled = (bool) Arr::get($event->data, 'attributes.minotarEnabled');

        $event->user->minotar_enabled = $enabled;
    }
}
