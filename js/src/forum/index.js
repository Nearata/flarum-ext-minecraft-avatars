import app from 'flarum/app';
import { extend } from 'flarum/extend';
import AvatarEditor from 'flarum/components/AvatarEditor'
import Button from 'flarum/components/Button';
import SettingsPage from 'flarum/components/SettingsPage';
import User from 'flarum/models/User';
import ChangeMinotarModal from './components/ChangeMinotarModal';

app.initializers.add('nearata/flarum-ext-minecraft-avatars', function() {
  const minotarUrl = 'https://minotar.net';

  User.prototype.avatarUrl = function() {
    const avatarUrl = this.attribute('avatarUrl');
    const minotar = this.attribute('minotar');

    if (!avatarUrl && minotar) {
      this.pushAttributes({
        avatarUrl: minotarUrl + '/avatar/' + minotar + '/64.png'
      });
    }

    return this.attribute('avatarUrl');
  };

  extend(SettingsPage.prototype, 'accountItems', items => {
    items.add(
      'changeMinecraftAvatar',
      Button.component({
        children: app.translator.trans('nearata-minecraft-avatars.forum.change_button'),
        className: 'Button',
        onclick: () => app.modal.show(new ChangeMinotarModal())
      })
    );
  });

  extend(AvatarEditor.prototype, 'controlItems', items => {
    const avatarUrl = app.session.user.avatarUrl();

    if (avatarUrl && avatarUrl.startsWith(minotarUrl)) {
      items.remove('remove');
    }
  });
});