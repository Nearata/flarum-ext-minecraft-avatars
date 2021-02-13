import app from 'flarum/app';
import { extend, override } from 'flarum/extend';
import AvatarEditor from 'flarum/components/AvatarEditor'
import Button from 'flarum/components/Button';
import User from 'flarum/models/User';
import ChangeMinotarModal from './components/ChangeMinotarModal';

app.initializers.add('nearata-minecraft-avatars', function () {
    const minotarUrl = 'https://crafatar.com/';

    User.prototype.avatarUrl = function () {
        const avatarUrl = this.attribute('avatarUrl');
        const minotar = this.attribute('minotar');

        if (minotar) {
            return minotarUrl + '/avatars/' + minotar + '?size=64';
        }

        return avatarUrl;
    };

    extend(AvatarEditor.prototype, 'controlItems', items => {
        const minotar = app.session.user.attribute('minotar');
        const changeButton = app.translator.trans('nearata-minecraft-avatars.forum.change_button');
        const useButton = app.translator.trans('nearata-minecraft-avatars.forum.use_button');

        items.add(
            'nearataMinecraftAvatars',
            m(Button, {
                icon: 'fas fa-cloud-upload-alt',
                onclick: () => app.modal.show(ChangeMinotarModal)
            }, minotar ? changeButton : useButton),
            1
        );

        const avatarUrl = app.session.user.avatarUrl();
        if (avatarUrl) {
            if (!avatarUrl.startsWith(minotarUrl)) {
                items.remove('nearataMinecraftAvatars');
            } else {
                items.remove('upload');
            }
        } else {
            items.remove('remove');
        }
    });

    override(AvatarEditor.prototype, 'quickUpload', () => {
        return;
    });

    extend(AvatarEditor.prototype, 'remove', function() {
        const minotar = this.attrs.user.attribute('minotar');

        if (minotar) {
            app.session.user.save({
                minotar: ''
            })
            .then(this.success.bind(this), this.failure.bind(this));
        }
    });
});
